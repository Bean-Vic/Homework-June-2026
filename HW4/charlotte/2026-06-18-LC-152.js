function maxProduct(nums) {
  let currentMax = nums[0];
  let currentMin = nums[0];
  let result = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];

    if (num < 0) {
      [currentMax, currentMin] = [currentMin, currentMax];
    }

    currentMax = Math.max(num, currentMax * num);
    currentMin = Math.min(num, currentMin * num);
    result = Math.max(result, currentMax);
  }

  return result;
}
