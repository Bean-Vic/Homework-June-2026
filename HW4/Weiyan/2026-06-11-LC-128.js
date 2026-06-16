/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    const set = new Set(nums);
    let best = 0;

    for (let n of set) {
        if (set.has(n - 1)) {
            continue;
        }

        let length = 1;

        while (set.has(++n)) {
            length++;
        }

        best = Math.max(best, length);

        if (best > Math.floor(nums.length / 2)) {
            break;
        }
    }

    return best;
};