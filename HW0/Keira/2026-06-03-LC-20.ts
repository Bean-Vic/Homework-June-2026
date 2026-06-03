function isValid(s: string): boolean {
    
  const stack: string[] = [];

  const pairs: Record<string, string> = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  for (const char of s) {
    if (char === "(" || char === "{" || char === "[") {
      stack.push(char);
    } else {
      const lastOpen = stack.pop();

      if (lastOpen !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}