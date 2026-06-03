function missingNumber(nums: number[]): number {

  const n = nums.length;
  let expectedSum = n * (n + 1) / 2;
  let actualSum = 0;
  for (const num of nums){
    actualSum += num;
  } 
  return expectedSum - actualSum;

};