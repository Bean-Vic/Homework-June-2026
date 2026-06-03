
class Solution {
    /**
     * @param {number[]} nums
     * @return {boolean}
     */
    hasDuplicate(nums) {
        let numsSet = new Set();
        // remember semicolon

        for (let num of nums) {
            if (numsSet.has(num)){
                return true;
            }
            numsSet.add(num);
        }
        
        return false;

    }
}
