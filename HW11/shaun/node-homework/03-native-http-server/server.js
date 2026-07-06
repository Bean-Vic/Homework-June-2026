const http = require("http");

let users = [
  {
    id: 1,
    name: "Alice",
    email: "alice@test.com",
    role: "student",
  },
  {
    id: 2,
    name: "Bob",
    email: "bob@test.com",
    role: "admin",
  },
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      resolve(body);
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

function validateUser(user) {
  if (!user.name || !user.email || !user.role) {
    return false;
  }

  return true;
}

const server = http.createServer(async (req, res) => {
  if (req.url === "/health") {
    if (req.method !== "GET") {
      return sendJson(res, 405, {
        error: "Method Not Allowed",
      });
    }

    return sendJson(res, 200, {
      status: "ok",
    });
  }

  if (req.url === "/api/time") {
    if (req.method !== "GET") {
      return sendJson(res, 405, {
        error: "Method Not Allowed",
      });
    }

    return sendJson(res, 200, {
      time: new Date().toISOString(),
    });
  }

  if (req.url === "/api/users") {
    if (req.method === "GET") {
      return sendJson(res, 200, users);
    }

    if (req.method === "POST") {
      try {
        const body = await readBody(req);
        const user = JSON.parse(body);

        if (!validateUser(user)) {
          return sendJson(res, 400, {
            error: "Missing required fields: name, email, role",
          });
        }

        const newUser = {
          id: users.length + 1,
          name: user.name,
          email: user.email,
          role: user.role,
        };

        users.push(newUser);

        return sendJson(res, 201, newUser);
      } catch (err) {
        return sendJson(res, 400, {
          error: "Invalid JSON body",
        });
      }
    }

    return sendJson(res, 405, {
      error: "Method Not Allowed",
    });
  }

  if (req.method === "GET" && req.url.startsWith("/api/users/")) {
    const id = Number(req.url.split("/")[3]);
    const user = users.find((user) => user.id === id);

    if (!user) {
      return sendJson(res, 404, {
        error: "User not found",
      });
    }

    return sendJson(res, 200, user);
  }

  if (req.url.startsWith("/api/users/")) {
    return sendJson(res, 405, {
      error: "Method Not Allowed",
    });
  }

  return sendJson(res, 404, {
    error: "Not Found",
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});