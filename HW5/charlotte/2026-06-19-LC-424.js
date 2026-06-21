function characterReplacement(s, k) {
  const counts = new Map();
  let left = 0;
  let maxCount = 0;
  let longest = 0;

  for (let right = 0; right < s.length; right++) {
    const rightChar = s[right];
    counts.set(rightChar, (counts.get(rightChar) || 0) + 1);
    maxCount = Math.max(maxCount, counts.get(rightChar));

    while (right - left + 1 - maxCount > k) {
      const leftChar = s[left];
      counts.set(leftChar, counts.get(leftChar) - 1);
      left++;
    }

    longest = Math.max(longest, right - left + 1);
  }

  return longest;
}
