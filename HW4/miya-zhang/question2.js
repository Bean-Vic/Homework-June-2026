const string =
  "   Hey Everyone  I Am Currently Working On My Web-Dev Homework   ";

function formatString(str) {
  let lowerStr = str.toLowerCase();

  let noDashStr = lowerStr.replace("-", " ");

  let trimmedStr = noDashStr.trim();

  let wordsArray = trimmedStr.split(" ");
  let finalWords = [];

  for (let i = 0; i < wordsArray.length; i++) {
    if (wordsArray[i] !== "") {
      finalWords.push(wordsArray[i]);
    }
  }

  return finalWords.join(" ");
}
