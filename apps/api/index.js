const http = require("http");
const { Pool } = require("pg");
const { URL } = require("url");

const port = process.env.PORT || 4000;
const databaseUrl = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
});

function json(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);

  if (reqUrl.pathname === "/health") {
    return json(res, 200, { ok: true });
  }

  if (reqUrl.pathname === "/db") {
    if (!databaseUrl) {
      return json(res, 500, { ok: false, error: "DATABASE_URL is not set" });
    }

    try {
      const result = await pool.query("SELECT NOW() as now");
      return json(res, 200, { ok: true, now: result.rows[0].now });
    } catch (error) {
      return json(res, 500, {
        ok: false,
        error: error.message || "Database error",
      });
    }
  }

  return json(res, 404, { ok: false, error: "Not found" });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`API listening on ${port}`);
});
