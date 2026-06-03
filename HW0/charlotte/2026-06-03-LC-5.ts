function longestPalindrome(s: string): string {
  let start = 0;
  let end = 0;

  const expandFromCenter = (left: number, right: number): void => {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }

    const length = right - left - 1;

    if (length > end - start + 1) {
      start = left + 1;
      end = right - 1;
    }
  };

  for (let i = 0; i < s.length; i++) {
    expandFromCenter(i, i);
    expandFromCenter(i, i + 1);
  }

  return s.slice(start, end + 1);
}
