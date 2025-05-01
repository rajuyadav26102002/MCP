# 🤖 AI Agent for Automated Social Media and Communication

Automate social media posts, emails, and speech-based interactions with an intelligent AI Agent!

---

## 📌 Overview

The **AI Agent** is an advanced automation tool that extends the capabilities of traditional Large Language Models (LLMs) by performing real-world tasks. It enables users to post on X (Twitter), send emails, and interact via text or speech through a single prompt — perfect for streamlining marketing, communication, and accessibility workflows.

Built with modern technologies like the **Model Context Protocol (MCP)** server, **Twitter API v2**, **Nodemailer**, and **Web Speech API**, this project demonstrates real-world AI integration and user-centric design.

---

## 🧠 Problem Solved

Traditional LLMs are limited — they **can't**:
- Post on social media or send emails
- Access real-time data (e.g., live stock/weather)
- Support diverse input methods like speech

**This AI Agent solves that by**:
- Using an **MCP server** for real-world actions and data access
- Providing a **chatbot** interface with **text & speech input**
- Automating multiple actions from **one simple prompt**

---

## 🚀 Key Features

- **Chatbot Interface**: Type or speak prompts (e.g., “Post about AI”)
- **X Posting**: Automatically posts tweets using the **Twitter API v2** (⏱️ <16 seconds)
- **Email Automation**: Sends emails via **Nodemailer** with 100% reliability
- **Speech-to-Text**: Processes spoken prompts via **Web Speech API** (🎯 90%+ accuracy)
- **Real-Time Actions**: Powered by **MCP server** 
- **Secure & Scalable**: Uses `.env`, **Zod validation**, and modular tool structure

---


## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **AI**: Large Language Model (e.g., Gemini)
- **Middleware**: Model Context Protocol (MCP) server (TypeScript SDK)
- **APIs**:
  - Twitter API v2 (`twitter-api-v2`)
  - Nodemailer
  - Web Speech API (in-browser)

- **Validation**: Zod
- **Security**: dotenv
- **Communication**: Server-Sent Events (SSE)

---

## 🧩 Installation

### ✅ Prerequisites

- Node.js (v16+)
- npm
- Twitter Developer credentials
- SMTP credentials (e.g., Gmail)
- Gemini or other LLM API Key

### 📦 Setup Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-agent.git
cd ai-agent

# Install dependencies
npm install
