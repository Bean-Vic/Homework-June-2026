/**
 * @param {string} s
 * @return {boolean}
 */
const isValid = function(s) {
    const stk = [];
    const map = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    for (const c of s) {
        if (c === '(' || c === '[' || c === '{') {
            stk.push(c);
        } else {
            if (stk.length === 0) return false;
            if (stk.pop() !== map[c]) return false;
        }
    }

    return stk.length === 0;
};