const string =
  ' Perhaps The Easiest-to-understand Case For Reduce Is To Return The Sum Of All The Elements In An Array  ';

const cleanedString = string
  .replace(/[^a-zA-Z\s]/g, ' ')
  .trim()
  .replace(/\s+/g, ' ')
  .toLowerCase();

console.log(cleanedString);
