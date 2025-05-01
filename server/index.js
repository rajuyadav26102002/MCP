import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createPost } from "./mcp.tool.js";
import { sendEmailViaSMTP } from "./email.helper.js";
import { z } from "zod";

const server = new McpServer({
    name: "example-server",
    version: "1.0.0"
});

const app = express();

// Tool: Add two numbers
server.tool(
    "addTwoNumbers",
    "Add two numbers",
    {
        a: z.number(),
        b: z.number()
    },
    async (arg) => {
        const { a, b } = arg;
        return {
            content: [
                {
                    type: "text",
                    text: `The sum of ${a} and ${b} is ${a + b}`
                }
            ]
        };
    }
);

// Tool: Create a post on X (Twitter)
server.tool(
    "createPost",
    "Create a post on X formally known as Twitter",
    {
        status: z.string()
    },
    async (arg) => {
        const { status } = arg;
        return createPost(status);
    }
);

// ✅ Tool: Send an email (Gemini-compatible)
server.tool(
    "sendEmail",
    "Send an email to a recipient",
    {
        to: z.string(), // ✅ Removed `.email()` to fix Gemini format error
        subject: z.string(),
        body: z.string()
    },
    async ({ to, subject, body }) => {
        // Optional: Manual email format check
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
            throw new Error("Invalid email address format");
        }

        await sendEmailViaSMTP(to, subject, body);
        return {
            content: [{ type: "text", text: `Email sent to ${to}` }]
        };
    }
);

// Connection handling
const transports = {};

app.get("/sse", async (req, res) => {
    const transport = new SSEServerTransport('/messages', res);
    transports[transport.sessionId] = transport;
    res.on("close", () => {
        delete transports[transport.sessionId];
    });
    await server.connect(transport);
});

app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId;
    const transport = transports[sessionId];
    if (transport) {
        await transport.handlePostMessage(req, res);
    } else {
        res.status(400).send('No transport found for sessionId');
    }
});

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});
