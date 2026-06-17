const string =
  " Perhaps The Easiest-to-understand Case For Reduce Is To Return The Sum Of All The Elements In An Array  ";

// Given the string, implement a function to remove all the non-alphabet characters and extra space in the string and convert the string to all lowercase.

const transform = string.split("-").join(" ").trim().toLowerCase();
console.log(transform);
