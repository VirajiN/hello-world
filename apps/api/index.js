const http = require("http");

const port = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
});

server.listen(port, "0.0.0.0", () => {
  console.log(`API listening on ${port}`);
});
