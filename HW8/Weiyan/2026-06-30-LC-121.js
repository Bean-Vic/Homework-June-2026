/**
 * @param {number[]} prices
 * @return {number}
 */
const maxProfit = function(prices) {
    let cash = 0;
    let hold = -prices[0];
    
    for (let i = 1; i < prices.length; i++) {
        cash = Math.max(cash, hold + prices[i]);
        hold = Math.max(hold, -prices[i]);
    }
    
    return cash;
};