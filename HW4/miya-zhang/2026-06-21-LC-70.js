/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function (n) {
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  let curr = 0;

  for (let i = 3; i <= n; i++) {
    curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return curr;
};
