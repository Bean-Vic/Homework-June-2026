// 139. Word Break
/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict); // O(1) lookup
    const dp = new Array(s.length + 1).fill(false);
    dp[0] = true; // empty string is always valid (base case)

    for (let i = 1; i <= s.length; i++) {
        for (let j = 0; j < i; j++) {
            // if s[0..j-1] is valid AND s[j..i-1] is a word
            if (dp[j] && wordSet.has(s.slice(j, i))) {
                dp[i] = true;
                break; // found one valid split, no need to continue
            }
        }
    }

    return dp[s.length];
};

// Time: O(n²) | Space: O(n)
