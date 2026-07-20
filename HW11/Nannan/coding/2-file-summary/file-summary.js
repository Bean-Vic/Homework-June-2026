import { readFile, stat, readdir } from 'fs/promises';
import { resolve, basename, extname, join } from 'path';

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: node file-summary.js <file-or-directory>');
  process.exit(1);
}

async function summarizeFile(filePath) {
  const absPath = resolve(filePath);
  const [stats, content] = await Promise.all([stat(absPath), readFile(absPath, 'utf8')]);
  const lines = content.split('\n').length;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return {
    name: basename(absPath),
    extension: extname(absPath) || '(none)',
    absolutePath: absPath,
    size: stats.size,
    lines,
    words,
  };
}

function printSummary(s) {
  console.log(`\nFile:      ${s.name}`);
  console.log(`Extension: ${s.extension}`);
  console.log(`Path:      ${s.absolutePath}`);
  console.log(`Size:      ${s.size} bytes`);
  console.log(`Lines:     ${s.lines}`);
  console.log(`Words:     ${s.words}`);
}

async function main() {
  const absPath = resolve(inputPath);
  let stats;
  try {
    stats = await stat(absPath);
  } catch {
    console.error(`File or directory not found: ${absPath}`);
    process.exit(1);
  }

  if (stats.isDirectory()) {
    const entries = await readdir(absPath);
    const textFiles = entries.filter((f) => f.endsWith('.txt') || f.endsWith('.md'));
    if (textFiles.length === 0) {
      console.log('No .txt or .md files found in directory.');
      return;
    }
    const summaries = await Promise.all(textFiles.map((f) => summarizeFile(join(absPath, f))));
    // Extra credit: sort by file size descending
    summaries.sort((a, b) => b.size - a.size);
    summaries.forEach(printSummary);
  } else {
    const summary = await summarizeFile(absPath);
    printSummary(summary);
  }
}

main();
