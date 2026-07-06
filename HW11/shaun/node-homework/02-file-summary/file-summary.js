const fs = require("fs/promises");
const path = require("path");

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log("Please provide a file path.");
    return;
  }

  try {
    const content = await fs.readFile(filePath, "utf8");
    const stats = await fs.stat(filePath);

    const fileName = path.basename(filePath);
    const extension = path.extname(filePath);
    const absolutePath = path.resolve(filePath);
    const fileSize = stats.size;

    const lines = content.split("\n").length;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;

    console.log(`File Name: ${fileName}`);
    console.log(`Extension: ${extension}`);
    console.log(`Absolute Path: ${absolutePath}`);
    console.log(`File Size: ${fileSize} bytes`);
    console.log(`Line Count: ${lines}`);
    console.log(`Word Count: ${words}`);
  } catch (err) {
    console.log("File not found.");
  }
}

main();