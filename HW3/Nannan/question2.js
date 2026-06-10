// Given the string, implement a function to remove all the non-alphabet characters and extra space in the string and convert the string to all lowercase.

const string =   " Perhaps The Easiest-to-understand Case For Reduce Is To Return The Sum Of All The Elements In An Array  ";

const cleanString = (str) =>
  str
    .replace(/[^a-zA-Z\s]/g, '')  // 1. 移除非字母（保留空格）
    .replace(/\s+/g, ' ')          // 2. 压缩连续空白为单个空格
    .trim()                        // 3. 去掉首尾空格
    .toLowerCase();                // 4. 转小写

console.log(cleanString(string));
