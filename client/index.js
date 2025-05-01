import { config } from 'dotenv';
import { GoogleGenAI } from "@google/genai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

config();
const app = express();
const server = createServer(app);
const io = new Server(server);

let tools = [];
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const mcpClient = new Client({
    name: "example-client",
    version: "1.0.0",
});

const chatHistories = new Map(); // Store chat histories by socket ID

app.use(express.static('public'));

mcpClient.connect(new SSEClientTransport(new URL("http://localhost:3001/sse")))
    .then(async () => {
        console.log("Connected to mcp server");
        tools = (await mcpClient.listTools()).tools.map(tool => ({
            name: tool.name,
            description: tool.description,
            parameters: {
                type: tool.inputSchema.type,
                properties: tool.inputSchema.properties,
                required: tool.inputSchema.required
            }
        }));
        server.listen(3000, () => console.log('UI server running on port 3000'));
    });

io.on('connection', (socket) => {
    console.log('User connected');
    chatHistories.set(socket.id, []);

    socket.on('disconnect', () => {
        console.log('User disconnected');
        chatHistories.delete(socket.id);
    });

    socket.on('message', async (msg) => {
        try {
            const chatHistory = chatHistories.get(socket.id);
            chatHistory.push({
                role: "user",
                parts: [{ text: msg, type: "text" }]
            });

            await processMessage(socket, chatHistory);
        } catch (error) {
            console.error(error);
            socket.emit('error', 'An error occurred processing your message');
        }
    });
});

async function processMessage(socket, chatHistory, toolCall = null) {
    if (toolCall) {
        socket.emit('status', `Calling tool: ${toolCall.name}`);
        chatHistory.push({
            role: "model",
            parts: [{ text: `Calling tool ${toolCall.name}`, type: "text" }]
        });

        const toolResult = await mcpClient.callTool({
            name: toolCall.name,
            arguments: toolCall.args
        });

        chatHistory.push({
            role: "user",
            parts: [{ text: "Tool result: " + toolResult.content[0].text, type: "text" }]
        });
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: chatHistory,
        config: { tools: [{ functionDeclarations: tools }] }
    });

    const content = response.candidates[0].content.parts[0];

    if (content.functionCall) {
        return processMessage(socket, chatHistory, content.functionCall);
    }

    chatHistory.push({
        role: "model",
        parts: [{ text: content.text, type: "text" }]
    });

    socket.emit('response', content.text);
}
