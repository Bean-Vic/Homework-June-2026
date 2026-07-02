# 1. JSON Request Validator

A Node.js CLI tool that validates a JSON file's syntax and a sample user schema.

## Requirements

- Node.js (uses only built-in `fs/promises` and `path`, no dependencies)

## Usage

```bash
node validate-json.js <path-to-json> [-pretty]
```

- Reads the JSON file path from command line arguments.
- Parses it with `fs/promises`.
- Prints `Valid JSON` if the file is valid.
- Prints a useful error message if invalid.
- The root value must be an object or an array.
- Each user object must contain non-empty `name`, `email`, and `role` fields.

## Flags

- `-pretty` (extra credit): print the formatted JSON after validation.
- An array root (extra credit) is validated user-by-user.

## Sample files

| File | Expected result |
| --- | --- |
| `samples/valid.json` | Valid JSON |
| `samples/invalid-syntax.json` | Invalid JSON syntax error |
| `samples/invalid-data.json` | Valid syntax but missing required field |
| `samples/valid-array.json` | Valid JSON (array of users) |

## Test

```bash
node validate-json.js samples/valid.json
node validate-json.js samples/invalid-syntax.json
node validate-json.js samples/invalid-data.json
node validate-json.js samples/valid-array.json -pretty
```
