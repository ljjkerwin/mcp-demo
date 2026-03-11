import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import predictFortune from "./services/predictFortune.js";

// Create an MCP server
const server = new McpServer({
  name: "fortune-teller",
  version: "1.0.0",
});

// Add the tool
server.tool(
  "predict_fortune",
  "测试今日运势",
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

// Connect to transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
