import { readFile } from 'fs/promises';
import { resolve } from 'path';

const args = process.argv.slice(2);
const filePath = args.find((a) => !a.startsWith('-'));
const pretty = args.includes('-pretty');

if (!filePath) {
  console.error('Usage: node validate-json.js <file.json> [-pretty]');
  process.exit(1);
}

const REQUIRED_FIELDS = ['name', 'email', 'role'];
const VALID_ROLES = ['student', 'mentor', 'admin'];

function validateUser(user, index = null) {
  const label = index !== null ? `User[${index}]` : 'User';
  for (const field of REQUIRED_FIELDS) {
    if (!Object.hasOwn(user, field) || user[field] === null || user[field] === '') {
      throw new Error(`${label} is missing required field: "${field}"`);
    }
  }
  if (!VALID_ROLES.includes(user.role)) {
    throw new Error(
      `${label} has invalid role: "${user.role}". Must be one of: ${VALID_ROLES.join(', ')}`
    );
  }
}

async function main() {
  const absPath = resolve(filePath);
  let raw;
  try {
    raw = await readFile(absPath, 'utf8');
  } catch {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`Invalid JSON syntax: ${err.message}`);
    process.exit(1);
  }

  if (typeof data !== 'object' || data === null) {
    console.error('Invalid: root value must be an object or array');
    process.exit(1);
  }

  try {
    if (Array.isArray(data)) {
      data.forEach((item, i) => validateUser(item, i));
    } else {
      validateUser(data);
    }
  } catch (err) {
    console.error(`Business validation failed: ${err.message}`);
    process.exit(1);
  }

  console.log('Valid JSON');
  if (pretty) {
    console.log(JSON.stringify(data, null, 2));
  }
}

main();
