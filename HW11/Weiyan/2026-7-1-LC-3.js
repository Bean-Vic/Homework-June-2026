/**
 * @param {string} s
 * @return {number}
 */
const lengthOfLongestSubstring = function(s) {
    let i = 0;
    let best = 0;
    const window = new Map();

    for (let j = 0; j < s.length; j++) {
        const c = s[j];
        
        if (window.has(c)) {
            i = Math.max(window.get(c) + 1, i);
        }
        
        window.set(c, j);
        best = Math.max(best, j - i + 1);
    }

    return best;
};