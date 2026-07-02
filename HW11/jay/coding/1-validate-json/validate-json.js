const fs = require("fs/promises");
const path = require("path");

const REQUIRED_FIELDS = ["name", "email", "role"];

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = { pretty: false };
  const positionals = [];
  for (const arg of args) {
    if (arg === "-pretty" || arg === "--pretty") {
      flags.pretty = true;
    } else {
      positionals.push(arg);
    }
  }
  return { filePath: positionals[0], flags };
}

function validateUser(user, label) {
  const errors = [];
  if (typeof user !== "object" || user === null || Array.isArray(user)) {
    errors.push(`${label} is not an object`);
    return errors;
  }
  for (const field of REQUIRED_FIELDS) {
    if (!(field in user)) {
      errors.push(`${label} is missing required field "${field}"`);
    } else if (typeof user[field] !== "string" || user[field].trim() === "") {
      errors.push(`${label} field "${field}" must be a non-empty string`);
    }
  }
  return errors;
}

function validateBusinessData(root) {
  if (Array.isArray(root)) {
    const errors = [];
    root.forEach((item, index) => {
      errors.push(...validateUser(item, `user[${index}]`));
    });
    return errors;
  }
  return validateUser(root, "user");
}

async function main() {
  const { filePath, flags } = parseArgs(process.argv);

  if (!filePath) {
    console.error("Usage: node validate-json.js <path-to-json> [-pretty]");
    process.exitCode = 1;
    return;
  }

  const resolved = path.resolve(filePath);
  let raw;
  try {
    raw = await fs.readFile(resolved, "utf8");
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`Error: file not found at ${resolved}`);
    } else {
      console.error(`Error: could not read file: ${err.message}`);
    }
    process.exitCode = 1;
    return;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`Error: invalid JSON syntax in ${filePath}`);
    console.error(`  ${err.message}`);
    process.exitCode = 1;
    return;
  }

  const isObject = typeof data === "object" && data !== null && !Array.isArray(data);
  const isArray = Array.isArray(data);
  if (!isObject && !isArray) {
    console.error("Error: root value must be an object or an array");
    process.exitCode = 1;
    return;
  }

  const businessErrors = validateBusinessData(data);
  if (businessErrors.length > 0) {
    console.error("Error: JSON is syntactically valid but failed business validation:");
    for (const message of businessErrors) {
      console.error(`  - ${message}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Valid JSON");
  if (flags.pretty) {
    console.log(JSON.stringify(data, null, 2));
  }
}

main();
