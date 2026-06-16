

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const hashmap = {
        ')' : '(',
        '}' : '{',
        ']' : '['
    };

    const stack = [];

    for (const c of s) {
        if (c in hashmap) {
            if (stack.length===0){
                return false;
            }
            const temp = stack.pop();
            if (temp != hashmap[c]){
                return false;
            }
        } else {
            stack.push(c);
        }
    }

    return stack.length === 0;
};