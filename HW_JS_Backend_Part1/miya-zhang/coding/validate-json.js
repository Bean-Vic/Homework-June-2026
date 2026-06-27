const fs = require("fs/promises");

const requiredFields = ["name", "email", "role"];

function validateUser(user, index = null) {
  const label = index === null ? "User" : `User at index ${index}`;

  if (typeof user !== "object" || user === null || Array.isArray(user)) {
    throw new Error(`${label} must be an object.`);
  }

  const missingFields = [];

  for (const field of requiredFields) {
    if (!user[field] || String(user[field]).trim() === "") {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    throw new Error(
      `${label} is missing required field(s): ${missingFields.join(", ")}`
    );
  }
}

function printHelp() {
  console.log("JSON Request Validator");
  console.log("");
  console.log("Usage:");
  console.log("  node validate-json.js <file.json>");
  console.log("");
  console.log("Options:");
  console.log("  --pretty   Print formatted JSON after validation");
  console.log("  --help     Show help message");
  console.log("");
  console.log("Examples:");
  console.log("  node validate-json.js valid-user.json");
  console.log("  node validate-json.js valid-user.json --pretty");
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    printHelp();
    return;
  }

  const pretty = args.includes("--pretty");
  const filePath = args.find((arg) => !arg.startsWith("--"));

  if (!filePath) {
    console.error("Missing file path.");
    console.error("Usage: node validate-json.js <file.json>");
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
      data.forEach((user, index) => validateUser(user, index));
    } else {
      validateUser(data);
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
