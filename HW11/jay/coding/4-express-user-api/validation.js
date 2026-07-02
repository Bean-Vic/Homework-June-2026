const { ROLES } = require("./store");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateField(field, value, errors) {
  if (field === "name" && !isNonEmptyString(value)) {
    errors.push("name must be a non-empty string");
  }
  if (field === "email") {
    if (!isNonEmptyString(value)) {
      errors.push("email must be a non-empty string");
    } else if (!EMAIL_PATTERN.test(value)) {
      errors.push("email must be a valid email address");
    }
  }
  if (field === "role" && !ROLES.includes(value)) {
    errors.push(`role must be one of: ${ROLES.join(", ")}`);
  }
}

function validateCreate(body) {
  const errors = [];
  for (const field of ["name", "email", "role"]) {
    if (body[field] === undefined) {
      errors.push(`${field} is required`);
    } else {
      validateField(field, body[field], errors);
    }
  }
  return errors;
}

function validateReplace(body) {
  return validateCreate(body);
}

function validatePatch(body) {
  const errors = [];
  const fields = ["name", "email", "role"].filter(
    (f) => body[f] !== undefined
  );
  if (fields.length === 0) {
    errors.push("at least one of name, email, role is required");
  }
  for (const field of fields) {
    validateField(field, body[field], errors);
  }
  return errors;
}

module.exports = { validateCreate, validateReplace, validatePatch };
