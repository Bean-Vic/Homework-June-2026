/**
 * @param {string} s
 * @return {number}
 */
const firstUniqChar = function(s) {
    const count = {};

    for (const c of s) {
        count[c] = (count[c] || 0) + 1;
    }

    for (let i = 0; i < s.length; i++) {
        if (count[s[i]] === 1) {
            return i;
        }
    }

    return -1;
};