function longestConsecutive(nums: number[]): number {
  const values = new Set(nums);
  let longest = 0;

  for (const num of values) {
    if (!values.has(num - 1)) {
      let current = num;
      let length = 1;

      while (values.has(current + 1)) {
        current += 1;
        length += 1;
      }

      longest = Math.max(longest, length);
    }
  }

  return longest;
}
