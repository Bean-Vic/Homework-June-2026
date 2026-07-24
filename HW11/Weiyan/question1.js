const fs = require('fs/promises');
const path = require('path');

async function main() {

  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Error: Please provide a file path.');
    console.error('Usage: node question1.js <path-to-file.json>');
    process.exit(1);
  }

  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const fileContent = await fs.readFile(absolutePath, 'utf-8');
    
    let data;
    try {
      data = JSON.parse(fileContent);
    } catch (parseError) {
      // Case 2: Invalid JSON Syntax
      throw new Error(`Error - Invalid JSON Syntax.\nDetails: ${parseError.message}`);
    }

    // Validate that the root value is an object or array
    if (typeof data !== 'object' || data === null) {
      throw new Error('Validation Error - Root value must be a JSON object or array.');
    }

    // Helper function to check required fields for a user object
    const requiredFields = ['name', 'email', 'role'];
    const validateUser = (user, index = null) => {
      if (typeof user !== 'object' || user === null) {
        throw new Error(`Validation Error - Item${index !== null ? ` at index ${index}` : ''} is not an object.`);
      }
      
      const missing = requiredFields.filter(field => !user[field]);
      if (missing.length > 0) {
        throw new Error(`Validation Error - Missing required fields: [${missing.join(', ')}]${index !== null ? ` at index ${index}` : ''}.`);
      }
    };

    // Apply validation depending on whether root is Array or Object
    if (Array.isArray(data)) {
      data.forEach((item, index) => validateUser(item, index));
    } else {
      validateUser(data);
    }

    // Case 1: Valid JSON
    console.log('Valid JSON');

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: File not found at path "${filePath}"`);
    } else {
      console.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
}

main();