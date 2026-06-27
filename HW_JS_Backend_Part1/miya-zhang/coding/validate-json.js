const fs = require("fs/promises");

const requiredFields = ["name", "email", "role"];

function checkUser(user, index) {
  if (typeof user !== "object" || user === null || Array.isArray(user)) {
    throw new Error(`User ${index} must be an object.`);
  }

  const missingFields = [];

  for (const field of requiredFields) {
    if (!user[field] || String(user[field]).trim() === "") {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    throw new Error(
      `User ${index} is missing required field(s): ${missingFields.join(", ")}`
    );
  }
}

async function main() {
  const filePath = process.argv[2];
  const pretty = process.argv.includes("--pretty");

  if (!filePath) {
    console.error("Please provide a JSON file path.");
    console.error("Example: node validate-json.js valid-user.json");
    process.exit(1);
  }

  try {
    const content = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(content);

    if (typeof data !== "object" || data === null) {
      throw new Error("Root value must be an object or an array.");
    }

    if (Array.isArray(data)) {
      data.forEach((user, index) => checkUser(user, index));
    } else {
      checkUser(data, 0);
    }

    console.log("valid JSON");

    if (pretty) {
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error("Invalid JSON syntax:", error.message);
    } else {
      console.error("Invalid JSON:", error.message);
    }

    process.exit(1);
  }
}

main();
