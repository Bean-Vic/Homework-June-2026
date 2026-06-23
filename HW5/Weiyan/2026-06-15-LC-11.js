/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    let i = 0, j = height.length - 1;
    let mArea = 0;
    
    while (i < j) {
        if (height[i] <= height[j]) {
            mArea = Math.max(mArea, (j - i) * height[i++]);
        } else {
            mArea = Math.max(mArea, (j - i) * height[j--]);
        }
    }
    
    return mArea;
};
