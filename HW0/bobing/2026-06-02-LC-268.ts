/**
 * 268. Missing Number
 * https://leetcode.com/problems/missing-number
 */

function missingNumber(nums: number[]): number {
  const n = nums.length;
  const expected = (n * (n + 1)) / 2;

  const actual = nums.reduce((sum, cur) => {
    return sum + cur;
  }, 0);

  return expected - actual;
}
