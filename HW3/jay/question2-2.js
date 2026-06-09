


const string =
  " Perhaps The Easiest-to-understand Case For Reduce Is To Return The Sum Of All The Elements In An Array ";

const result = string
  .replaceAll("-", " ")  // replace hyphens with spaces
  .trim()                // remove leading/trailing spaces
  .replace(/\s+/g, " ")  // collapse multiple spaces into one
  .toLowerCase();        // lowercase everything

console.log(result);


