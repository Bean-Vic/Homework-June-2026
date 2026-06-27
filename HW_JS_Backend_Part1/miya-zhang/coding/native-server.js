const http = require("http");

const PORT = 3000;

let users = [
  {
    id: 1,
    name: "Miya Zhang",
    email: "miya.zhang@uw-student.org",
    role: "student",
    department: "Information Management",
  },
  {
    id: 2,
    name: "Iris Chen",
    email: "iris.chen@uw-advising.org",
    role: "admin",
    department: "Student Services",
  },
  {
    id: 3,
    name: "Sunayana Patel",
    email: "sunayana.patel@course-team.org",
    role: "instructor",
    department: "Web Development",
  },
  {
    id: 4,
    name: "Shree Kumar",
    email: "shree.kumar@course-team.org",
    role: "reviewer",
    department: "Project Review",
  },
];

let nextUserId = 5;

function sendJson(req, res, statusCode, data, startTime) {
  const responseTime = Date.now() - startTime;

  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });

  res.end(JSON.stringify(data, null, 2));

  console.log(`${req.method} ${req.url} ${statusCode} ${responseTime}ms`);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      resolve(body);
    });

    req.on("error", () => {
      reject(new Error("Could not read request body."));
    });
  });
}

function validateUser(user) {
  const requiredFields = ["name", "email", "role"];
  const missingFields = [];

  for (const field of requiredFields) {
    if (!user[field] || String(user[field]).trim() === "") {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return `Missing required field(s): ${missingFields.join(", ")}`;
  }

  if (!String(user.email).includes("@")) {
    return "Email must be a valid email address.";
  }

  return null;
}

const server = http.createServer(async (req, res) => {
  const startTime = Date.now();
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (req.method === "GET" && pathname === "/health") {
    return sendJson(req, res, 200, { status: "ok" }, startTime);
  }

  if (req.method === "GET" && pathname === "/api/time") {
    return sendJson(
      req,
      res,
      200,
      {
        timestamp: new Date().toISOString(),
        timezone: "UTC",
      },
      startTime
    );
  }

  if (req.method === "GET" && pathname === "/api/users") {
    const role = url.searchParams.get("role");

    let filteredUsers = users;

    if (role) {
      filteredUsers = users.filter((user) => user.role === role);
    }

    return sendJson(
      req,
      res,
      200,
      {
        count: filteredUsers.length,
        users: filteredUsers,
      },
      startTime
    );
  }

  if (req.method === "GET" && pathname.startsWith("/api/users/")) {
    const idText = pathname.split("/")[3];
    const id = Number(idText);

    if (!Number.isInteger(id)) {
      return sendJson(
        req,
        res,
        400,
        { error: "User id must be a number." },
        startTime
      );
    }

    const user = users.find((item) => item.id === id);

    if (!user) {
      return sendJson(
        req,
        res,
        404,
        { error: "User not found." },
        startTime
      );
    }

    return sendJson(req, res, 200, user, startTime);
  }

  if (req.method === "POST" && pathname === "/api/users") {
    const body = await readBody(req);

    if (!body.trim()) {
      return sendJson(
        req,
        res,
        400,
        { error: "Request body cannot be empty." },
        startTime
      );
    }

    let newUserData;

    try {
      newUserData = JSON.parse(body);
    } catch {
      return sendJson(
        req,
        res,
        400,
        { error: "Invalid JSON body." },
        startTime
      );
    }

    const validationError = validateUser(newUserData);

    if (validationError) {
      return sendJson(
        req,
        res,
        400,
        { error: validationError },
        startTime
      );
    }

    const newUser = {
      id: nextUserId,
      name: newUserData.name.trim(),
      email: newUserData.email.trim(),
      role: newUserData.role.trim(),
      department: newUserData.department
        ? newUserData.department.trim()
        : "General",
    };

    users.push(newUser);
    nextUserId += 1;

    return sendJson(
      req,
      res,
      201,
      {
        message: "User created successfully.",
        user: newUser,
      },
      startTime
    );
  }

  if (
    pathname === "/health" ||
    pathname === "/api/time" ||
    pathname === "/api/users" ||
    pathname.startsWith("/api/users/")
  ) {
    return sendJson(
      req,
      res,
      405,
      { error: "Method not allowed." },
      startTime
    );
  }

  return sendJson(
    req,
    res,
    404,
    { error: "Route not found." },
    startTime
  );
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
