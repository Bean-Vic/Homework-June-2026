const fs = require('fs/promises');
const path = require('path');

async function main() {

  const filePath = process.argv[2];

  if (!filePath) {
    console.error('Error: Please provide a file path.');
    console.error('Usage: node question2.js <path-to-file.txt>');
    process.exit(1);
  }

  try {
    const absolutePath = path.resolve(process.cwd(), filePath);

    const stats = await fs.stat(absolutePath);

    if (stats.isDirectory()) {
        throw { code: 'EISDIR', message: 'The provided path is a directory, not a file.' };
    }

    const content = await fs.readFile(absolutePath, 'utf-8');
    const fileName = path.basename(absolutePath);
    const fileExt = path.extname(absolutePath) || '(No extension)';
    const fileSize = stats.size;
    const lineCount = content.length === 0 ? 0 : content.split(/\r?\n/).length;
    const words = (content.match(/\S+/g) || []).length;


    console.log('\n --- File Summary ---');
    console.log(`Name          : ${fileName}`);
    console.log(`Extension     : ${fileExt}`);
    console.log(`Size          : ${fileSize} bytes`);
    console.log(`Lines         : ${lineCount}`);
    console.log(`Words         : ${words}`);
    console.log(`Absolute Path : ${absolutePath}`);
    console.log('------------------------\n');

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: File not found at "${filePath}".`);
    } else {
      console.error(`Unexpected Error: ${error.message}`);
    }
    process.exit(1);
  }
}

main();