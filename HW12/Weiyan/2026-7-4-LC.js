/**
 * 2667. Create Hello World Function
 * @return {Function}
 */
const createHelloWorld = function() {
    return () => "Hello World";
};

/**
 * 2620. Counter
 * @param {number} n
 * @return {Function} counter
 */
const createCounter = function(n) {
    return () => n++;
};

/**
 * 2704. To Be Or Not To Be
 * @param {string} val
 * @return {Object}
 */
const expect = function(val) {
    return {
        toBe: (val2) => {
            if (val !== val2) throw new Error("Not Equal");
            return true;
        },
        notToBe: (val2) => {
            if (val === val2) throw new Error("Equal");
            return true;
        }
    }
};

/**
 * expect(5).toBe(5); // true
 * expect(5).notToBe(5); // throws "Equal"
 */