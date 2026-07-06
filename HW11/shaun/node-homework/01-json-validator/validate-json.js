const fs = require("fs/promises");

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log("Please provide a JSON file.");
    return;
  }

  try {
    const content = await fs.readFile(filePath, "utf8");
    const data = JSON.parse(content);

    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      throw new Error("Root value must be a JSON object.");
    }

    const requiredFields = ["name", "email", "role"];

    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    console.log("Valid JSON");
  } catch (err) {
    console.log("Invalid JSON");
    console.log(err.message);
  }
}

main();