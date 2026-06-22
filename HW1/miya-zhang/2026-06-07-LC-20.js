var isValid = function (s) {
  let stack = [];

  for (let i = 0; i < s.length; i++) {
    let ch = s[i];

    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      let last = stack.pop();

      if (ch === ")" && last !== "(") {
        return false;
      }

      if (ch === "]" && last !== "[") {
        return false;
      }

      if (ch === "}" && last !== "{") {
        return false;
      }
    }
  }

  return stack.length === 0;
};
