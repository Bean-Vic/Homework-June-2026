
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    let left = 0
    let right = s.length-1

    function isAlphaNum(ch){
        return /^[0-9a-z]$/i.test(ch);
    };

    while (left < right) {
        if (!isAlphaNum(s[left])){
            left+=1;
        }
        else if (!isAlphaNum(s[right])){
            right-=1;
        }
        else if (s[left].toLowerCase() === s[right].toLowerCase()){
            left+=1;
            right-=1;
        }
        else {
            return false;
        }
    }
    return true;

};
