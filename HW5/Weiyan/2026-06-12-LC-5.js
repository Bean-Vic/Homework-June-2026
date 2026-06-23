/**
 * @param {string} s
 * @return {string}
 */

function palindrome(s, l, r) {
    while (l >= 0 && r < s.length && s[l] === s[r]) {
        l--; 
        r++;
    }
    return [l + 1, r];
}

var longestPalindrome = function(s) {
    let res = [0, 0];
        
    for (let i = 0; i < s.length; i++) {
        let s1 = palindrome(s, i, i);
        let s2 = palindrome(s, i, i + 1);

        res = (res[1] - res[0] > s1[1] - s1[0]) ? res : s1;
        res = (res[1] - res[0] > s2[1] - s2[0]) ? res : s2;
    }
    
    return s.substring(res[0], res[1]);
};
