/**
 * 121. Best Time to Buy and Sell Stock
 * https://leetcode.com/problems/best-time-to-buy-and-sell-stock
 */

function maxProfit(prices: number[]): number {
  // edge cases
  if (prices.length < 2) {
    return 0;
  }

  // initialization
  let l = 0;
  let profit = 0;

  // iterate
  for (let r = 1; r < prices.length; r++) {
    profit = Math.max(profit, prices[r] - prices[l]);

    // update left pointer
    if (prices[r] < prices[l]) {
      l = r;
    }
  }

  return profit;
}
