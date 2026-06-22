/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function (height) {
  let maxArea = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      let width = j - i;
      let currentHeight = Math.min(height[i], height[j]);
      let currentArea = width * currentHeight;

      if (currentArea > maxArea) {
        maxArea = currentArea;
      }
    }
  }

  return maxArea;
};
