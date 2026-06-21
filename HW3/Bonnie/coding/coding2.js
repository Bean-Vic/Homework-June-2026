// 2. const string =
// " Perhaps The Easiest-to-understand Case For Reduce Is To Return The Sum Of All The
// Elements In An Array ";
// Given the string, implement a function to replace the - character with space,
// and remove extra space in the string and convert the string to all lowercase

const str =
" Perhaps The Easiest-to-understand Case For Reduce Is To Return The Sum Of All The Elements In An Array";

function cleanString(str) {
    return str
        .toLowerCase()
        .replaceAll("-", " ")
        .replace(/\s+/g, " ")
        .trim();
}

console.log(cleanString(str));