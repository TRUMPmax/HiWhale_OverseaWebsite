/** API 占位服务（Stage 10）：NestJS 后端就绪前的健康检查桩 */
const http = require("node:http");

const PORT = Number(process.env.PORT || 4000);

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ name: "hiwhale-api", message: "HiWhale API placeholder" }));
    return;
  }
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[api] placeholder listening on :${PORT}`);
});
