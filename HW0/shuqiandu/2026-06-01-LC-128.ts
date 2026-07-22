function longestConsecutive(nums: number[]): number {
  const numSet: Set<number> = new Set(nums);
  let longest: number = 0;
  for (const x of numSet) {
    if (!numSet.has(x - 1)) {
      let y: number = x + 1;
      while (numSet.has(y)) {
        y += 1;
      }
      longest = Math.max(longest, y - x);
    }
  }
  return longest;
}
