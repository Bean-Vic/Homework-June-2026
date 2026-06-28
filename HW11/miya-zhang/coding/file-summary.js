const fs = require("fs/promises");
const path = require("path");

function countLines(content) {
  if (content.length === 0) {
    return 0;
  }

  return content.split(/\r\n|\r|\n/).length;
}

function countWords(content) {
  const text = content.trim();

  if (text.length === 0) {
    return 0;
  }

  return text.split(/\s+/).length;
}

async function createFileSummary(filePath) {
  const stats = await fs.stat(filePath);

  if (!stats.isFile()) {
    throw new Error("The provided path is not a file.");
  }

  const content = await fs.readFile(filePath, "utf8");

  return {
    fileName: path.basename(filePath),
    extension: path.extname(filePath) || "no extension",
    absolutePath: path.resolve(filePath),
    fileSize: stats.size,
    lineCount: countLines(content),
    wordCount: countWords(content),
  };
}

function printSummary(summary) {
  console.log("File Name:", summary.fileName);
  console.log("Extension:", summary.extension);
  console.log("Absolute Path:", summary.absolutePath);
  console.log("File Size:", `${summary.fileSize} bytes`);
  console.log("Line Count:", summary.lineCount);
  console.log("Word Count:", summary.wordCount);
}

async function summarizeDirectory(directoryPath) {
  const items = await fs.readdir(directoryPath);
  const summaries = [];

  for (const item of items) {
    const itemPath = path.join(directoryPath, item);
    const stats = await fs.stat(itemPath);

    if (!stats.isFile()) {
      continue;
    }

    const extension = path.extname(item).toLowerCase();

    if (extension !== ".txt" && extension !== ".md") {
      continue;
    }

    const summary = await createFileSummary(itemPath);
    summaries.push(summary);
  }

  summaries.sort((a, b) => b.fileSize - a.fileSize);

  if (summaries.length === 0) {
    console.log("No .txt or .md files were found in this directory.");
    return;
  }

  for (const summary of summaries) {
    console.log("------------------------------");
    printSummary(summary);
  }
}

async function main() {
  const targetPath = process.argv[2];

  if (!targetPath) {
    console.error("Missing file or directory path.");
    console.error("Run it like this:");
    console.error("node file-summary.js project-brief.md");
    console.error("node file-summary.js reading-notes.txt");
    console.error("node file-summary.js .");
    process.exit(1);
  }

  try {
    const stats = await fs.stat(targetPath);

    if (stats.isFile()) {
      const summary = await createFileSummary(targetPath);
      printSummary(summary);
      return;
    }

    if (stats.isDirectory()) {
      await summarizeDirectory(targetPath);
      return;
    }

    console.error("The provided path is not a regular file or directory.");
    process.exit(1);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("File or directory not found:", targetPath);
    } else {
      console.error("Error:", error.message);
    }

    process.exit(1);
  }
}

main();
