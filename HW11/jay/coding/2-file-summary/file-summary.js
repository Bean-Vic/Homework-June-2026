const fs = require("fs/promises");
const path = require("path");

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

function countLines(content) {
  if (content.length === 0) return 0;
  const lines = content.split(/\r\n|\r|\n/);
  if (lines[lines.length - 1] === "") lines.pop();
  return lines.length;
}

function countWords(content) {
  const matches = content.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

async function summarizeFile(filePath) {
  const absolutePath = path.resolve(filePath);
  const stats = await fs.stat(absolutePath);
  const content = await fs.readFile(absolutePath, "utf8");

  return {
    name: path.basename(absolutePath),
    extension: path.extname(absolutePath) || "(none)",
    absolutePath,
    size: stats.size,
    lines: countLines(content),
    words: countWords(content),
  };
}

function printSummary(summary) {
  console.log(`File name:     ${summary.name}`);
  console.log(`Extension:     ${summary.extension}`);
  console.log(`Absolute path: ${summary.absolutePath}`);
  console.log(`Size:          ${formatBytes(summary.size)} (${summary.size} bytes)`);
  console.log(`Line count:    ${summary.lines}`);
  console.log(`Word count:    ${summary.words}`);
}

async function summarizeDirectory(dirPath) {
  const absoluteDir = path.resolve(dirPath);
  const entries = await fs.readdir(absoluteDir, { withFileTypes: true });
  const targets = entries.filter((entry) => {
    if (!entry.isFile()) return false;
    const ext = path.extname(entry.name).toLowerCase();
    return ext === ".txt" || ext === ".md";
  });

  if (targets.length === 0) {
    console.log(`No .txt or .md files found in ${absoluteDir}`);
    return;
  }

  const summaries = await Promise.all(
    targets.map((entry) => summarizeFile(path.join(absoluteDir, entry.name)))
  );

  summaries.sort((a, b) => b.size - a.size);

  console.log(`Directory: ${absoluteDir}`);
  console.log(`Matched ${summaries.length} file(s), sorted by size (largest first):`);
  for (const summary of summaries) {
    console.log("");
    console.log("----------------------------------------");
    printSummary(summary);
  }
}

async function main() {
  const target = process.argv[2];

  if (!target) {
    console.error("Usage: node file-summary.js <file-or-directory-path>");
    process.exitCode = 1;
    return;
  }

  try {
    const stats = await fs.stat(path.resolve(target));
    if (stats.isDirectory()) {
      await summarizeDirectory(target);
    } else {
      printSummary(await summarizeFile(target));
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`Error: no such file or directory: ${target}`);
    } else if (err.code === "EACCES") {
      console.error(`Error: permission denied: ${target}`);
    } else {
      console.error(`Error: ${err.message}`);
    }
    process.exitCode = 1;
  }
}

main();
