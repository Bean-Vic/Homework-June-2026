var twoSum = function(nums, target) {
    const numToIndex = new Map();
    let res = [];

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (numToIndex.has(complement)) {
            res = [numToIndex.get(complement), i];
            break;
        }

        numToIndex.set(nums[i], i);
    }

    return res;
};