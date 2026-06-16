function isValid(s: string): boolean {
  //数组作stack
  const stack: string[] = [];

  //Note: 在 TypeScript / JavaScript 里，string 本身就是可迭代的，不用toCharArray()
  for (const ch of s) {
    if (ch == "(" || ch == "[" || ch == "{") {
      stack.push(ch);
    } else {
      if (stack.length == 0) return false;

      //Note: 在 TypeScript / JavaScript 里，string 本身就是可迭代的，不用toCharArray()
      const top = stack.pop();
      if (
        (ch == ")" && top != "(") ||
        (ch == "]" && top != "[") ||
        (ch == "}" && top != "{")
      ) {
        return false;
      }
    }
  }
  return stack.length == 0;
}
