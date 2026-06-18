// 5. Longest Palindromic Substring
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    if (s.length === 0) return "";

    let start = 0;
    let maxLen = 0;

    for (let i = 0; i < s.length; i++) {
        const len1 = expandAroundCenter(s, i, i);      // 奇数
        const len2 = expandAroundCenter(s, i, i + 1);  // 偶数
        const len = Math.max(len1, len2);

        if (len > maxLen) {
            maxLen = len;
            start = i - Math.floor((len - 1) / 2);
        }
    }

    return s.slice(start, start + maxLen);
}

function expandAroundCenter(s, left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
        left--;
        right++;
    }
    return right - left - 1;
};


// 时间 O(n²)：n 个中心 × 每个最多扩 n 次
// 空间 O(1)：不算结果字符串本身
