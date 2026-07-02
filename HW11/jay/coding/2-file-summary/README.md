# Task 2 — Node.js File Summary Tool

A CLI tool that prints a summary of a file (or every `.txt`/`.md` file in a
directory). Uses only Node built-ins: `fs/promises` and `path`. No synchronous
file APIs are used.

## Install

No dependencies. Node 16+ recommended.

```bash
cd HW11/jay/coding/2-file-summary
```

## Run

Summarize a single file:

```bash
node file-summary.js samples/hello.txt
```

Output includes file name, extension, absolute path, file size, line count, and
word count.

## Extra credit

Pass a directory to summarize all `.txt` and `.md` files inside it, sorted by
size (largest first):

```bash
node file-summary.js samples
```

## Behavior notes

- Line count matches `wc -l` (a trailing newline does not add a phantom line).
- Word count splits on whitespace runs.
- Missing path exits with code `1` and a clear message; permission errors and
  other errors are reported distinctly.
- No path argument prints usage and exits `1`.

## Sample files

- `samples/hello.txt` — multi-line text.
- `samples/notes.md` — markdown.
- `samples/words.txt` — single line, ten words.
