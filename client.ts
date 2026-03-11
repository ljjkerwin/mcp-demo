import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "stdio.ts"],
  });

  const client = new Client(
    {
      name: "example-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  await client.connect(transport);

  const result = await client.callTool({
    name: "predict-fortune",
    arguments: {
      name: "Trae",
      date: "2023-10-27",
    },
  });

  console.log(JSON.stringify(result, null, 2));

  process.exit()
}

main().catch(console.error);
