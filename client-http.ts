import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

async function main() {
  const transport = new SSEClientTransport(
    new URL("http://localhost:3001/sse")
  );

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
    name: "predict_fortune",
    arguments: {
      name: "Trae",
      date: "2023-10-27",
    },
  });

  console.log(JSON.stringify(result, null, 2));

  process.exit()
}

main().catch(console.error);
