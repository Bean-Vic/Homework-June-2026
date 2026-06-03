// 1. Two Sum
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map()
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i]
        }
        map.set(nums[i], i)
    }
};

// Time: O(n), Space: O(n)


// Map 常用API
// const map = new Map();
// map.set(key, value);    // 存
// map.get(key);           // 取，不存在返回 undefined
// map.has(key);           // 判断是否存在，返回 true/false
// map.delete(key);        // 删
// map.size;               // 大小（注意是属性，不是方法，没有括号）


//for循环写法
// 经典 for（刷题最常用，能拿到索引）
// for (let i = 0; i < nums.length; i++) { }

// // for...of（拿值，类似 Python 的 for x in arr）
// for (const num of nums) { }

// // for...in（拿键/索引，慎用，对数组不推荐）
// for (const i in nums) { }

// // 带索引和值
// for (const [i, num] of nums.entries()) { }
