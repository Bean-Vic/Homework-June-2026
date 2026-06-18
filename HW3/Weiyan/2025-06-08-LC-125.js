/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    let i = 0;
    let j = s.length - 1;

    const isAlnum = (char) => {
        const lower = char.toLowerCase();
        return (lower >= 'a' && lower <= 'z') || (lower >= '0' && lower <= '9');
    };

    while (i < j) {
        while (i < j && !isAlnum(s[i])) i++;
        while (i < j && !isAlnum(s[j])) j--;
        
        if (s[i].toLowerCase() !== s[j].toLowerCase()) {
            return false;
        }
        
        i++;
        j--;
    }
    
    return true;
};