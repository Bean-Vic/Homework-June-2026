// 11. Container With Most Water

/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    let left = 0, right = height.length - 1;
    let max = 0;

    while (left < right) {
        const water = Math.min(height[left], height[right]) * (right - left);
        max = Math.max(max, water);

        // move the shorter side inward
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return max;
};

// Time: O(n) | Space: O(1)
