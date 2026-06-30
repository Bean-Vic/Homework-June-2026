/**
 * 20. Valid Parentheses
 * https://leetcode.com/problems/valid-parentheses
 */

function isValid(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = {
    "]": "[",
    "}": "{",
    ")": "(",
  };

  for (let i = 0; i < s.length; i++) {
    const char = s[i];
    if (char in map) {
      if (stack.pop() !== map[char]) {
        return false;
      }
    } else {
      stack.push(char);
    }
  }

  return stack.length === 0;
}
