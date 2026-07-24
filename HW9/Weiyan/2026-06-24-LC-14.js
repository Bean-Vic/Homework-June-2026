/**
 * @param {string[]} strs
 * @return {string}
 */
const longestCommonPrefix = function(strs) {
    const m = strs.length;
    const n = strs[0].length;

    for (let col = 0; col < n; col++) {
        for (let row = 1; row < m; row++) {
            const thisStr = strs[row];
            const prevStr = strs[row - 1];

            if (col >= thisStr.length || col >= prevStr.length || 
                thisStr[col] !== prevStr[col]) {
                return strs[row].slice(0, col);
            }
        }
    }
    
    return strs[0];
};