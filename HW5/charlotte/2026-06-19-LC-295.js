class MedianFinder {
  constructor() {
    this.nums = [];
  }

  addNum(num) {
    let left = 0;
    let right = this.nums.length;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      if (this.nums[mid] < num) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    this.nums.splice(left, 0, num);
  }

  findMedian() {
    const length = this.nums.length;
    const middle = Math.floor(length / 2);

    if (length % 2 === 1) {
      return this.nums[middle];
    }

    return (this.nums[middle - 1] + this.nums[middle]) / 2;
  }
}
