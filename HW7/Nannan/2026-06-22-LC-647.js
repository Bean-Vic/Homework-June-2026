// 647. Palindromic Substrings

/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function(s) {
    let count = 0;

    const expand = (l, r) => {
        while (l >= 0 && r < s.length && s[l] === s[r]) {
            count++;
            l--;
            r++;
        }
    };

    for (let i = 0; i < s.length; i++) {
        expand(i, i);     // 奇数长度：以 s[i] 为中心
        expand(i, i + 1); // 偶数长度：以 s[i]/s[i+1] 之间为中心
    }

    return count;
};

// 时间复杂度 O(n²)
// 空间复杂度 O(1)
