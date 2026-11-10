import { createServer } from "node:http";
import { handlePresentation } from "./presentation.mjs";

const port = Number(process.env.PORT || 8787);

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://127.0.0.1");
  if (req.method === "OPTIONS" && url.pathname === "/api/apresentacao") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "http://127.0.0.1:5173",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "600",
    });
    res.end();
    return;
  }
  if (url.pathname === "/api/apresentacao") {
    await handlePresentation(req, res);
    return;
  }
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ error: "Não encontrado." }));
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`palais-api ${port}\n`);
});
