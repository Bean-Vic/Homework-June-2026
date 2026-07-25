/**
 * 2665. Counter II
 * @param {integer} init
 * @return { increment: Function, decrement: Function, reset: Function }
 */
const createCounter = function(init) {
    
    let count = init;
    return {
        increment: () => ++count,
        decrement: () => --count,
        reset: () => (count = init),
    }

};

/**
 * const counter = createCounter(5)
 * counter.increment(); // 6
 * counter.reset(); // 5
 * counter.decrement(); // 4
 */


/**
 * 2634. Filter Elements from Array
 * @param {number[]} arr
 * @param {Function} fn
 * @return {number[]}
 */
const filter = function(arr, fn) {
    return arr.filter(fn);
};

/**
 * 2635. Apply Transform Over Each Element in Array
 * @param {number[]} arr
 * @param {Function} fn
 * @return {number[]}
 */
const map = function(arr, fn) {
    return arr.filter(() => true).map(fn);
};