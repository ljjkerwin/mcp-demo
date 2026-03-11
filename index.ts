import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import predictFortune from "./services/predictFortune.js";

// Create an MCP server
const server = new McpServer({
  name: "mcp-demo",
  version: "1.0.0",
});

// Add the tool
server.tool(
  "predict_fortune",
  "Predict today's fortune based on name and date",
  {
    name: z.string().describe("The name of the person"),
  },
  async ({ name }) => {
    const fortune = predictFortune(name);
    return {
      content: [
        {
          type: "text",
          text: fortune,
        },
      ],
    };
  }
);

const app = express();
const transports = new Map<string, SSEServerTransport>();

app.get("/sse", async (req, res) => {
  console.log("New SSE connection");
  const transport = new SSEServerTransport("/messages", res);
  const sessionId = transport.sessionId;

  transports.set(sessionId, transport);

  transport.onclose = () => {
    console.log("SSE connection closed", sessionId);
    transports.delete(sessionId);
  };

  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    res.status(400).send("Missing sessionId");
    return;
  }

  const transport = transports.get(sessionId);
  if (!transport) {
    res.status(404).send("Session not found");
    return;
  }

  await transport.handlePostMessage(req, res);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MCP Server running on http://localhost:${PORT}/sse`);
});
