const http = require("http");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;

let users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "student" },
  { id: 3, name: "Carol", email: "carol@example.com", role: "mentor" },
];

let nextId = 4;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1e6) {
        reject(new Error("Payload too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (raw.trim() === "") {
        resolve(undefined);
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function handleGetUsers(res, url) {
  const role = url.searchParams.get("role");
  let result = users;
  if (role) {
    result = users.filter((u) => u.role === role);
  }
  sendJson(res, 200, result);
}

function handleGetUserById(res, id) {
  const user = users.find((u) => u.id === id);
  if (!user) {
    sendJson(res, 404, { error: "User not found" });
    return;
  }
  sendJson(res, 200, user);
}

async function handleCreateUser(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch (err) {
    sendJson(res, 400, { error: err.message });
    return;
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    sendJson(res, 400, { error: "Request body must be a JSON object" });
    return;
  }

  const { name, email, role } = body;
  const missing = [];
  if (!name) missing.push("name");
  if (!email) missing.push("email");
  if (!role) missing.push("role");

  if (missing.length > 0) {
    sendJson(res, 400, {
      error: "Missing required fields",
      fields: missing,
    });
    return;
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof role !== "string"
  ) {
    sendJson(res, 400, { error: "Fields name, email and role must be strings" });
    return;
  }

  const user = { id: nextId++, name, email, role };
  users.push(user);
  sendJson(res, 201, user);
}

const server = http.createServer(async (req, res) => {
  const start = process.hrtime.bigint();
  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(
      `${req.method} ${req.url} ${res.statusCode} ${ms.toFixed(1)}ms`
    );
  });

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.replace(/\/+$/, "") || "/";
  const method = req.method;

  if (pathname === "/health") {
    if (method !== "GET") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (pathname === "/api/time") {
    if (method !== "GET") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }
    sendJson(res, 200, { time: new Date().toISOString() });
    return;
  }

  if (pathname === "/api/users") {
    if (method === "GET") {
      handleGetUsers(res, url);
      return;
    }
    if (method === "POST") {
      await handleCreateUser(req, res);
      return;
    }
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const userMatch = pathname.match(/^\/api\/users\/([^/]+)$/);
  if (userMatch) {
    if (method !== "GET") {
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }
    const id = Number(userMatch[1]);
    if (!Number.isInteger(id)) {
      sendJson(res, 400, { error: "User id must be an integer" });
      return;
    }
    handleGetUserById(res, id);
    return;
  }

  sendJson(res, 404, { error: "Not found" });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
