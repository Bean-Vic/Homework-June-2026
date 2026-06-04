/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map()
    for (let i = 0; i < nums.length; i++){
        const n = nums[i]
        if (map.has(target - n)){
            return [i, map.get(target - n)]
        }
        map.set(n, i)
    }
    return []
};