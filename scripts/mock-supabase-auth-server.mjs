import { createServer } from "node:http";

const port = 54321;

function json(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = createServer((req, res) => {
  const url = req.url ?? "/";

  if (url === "/health") {
    json(res, 200, { ok: true });
    return;
  }

  if (url.startsWith("/auth/v1/")) {
    json(res, 401, {
      code: "PGRST301",
      message: "No active session"
    });
    return;
  }

  json(res, 404, { message: "Not found" });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`[mock-supabase] listening on ${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
