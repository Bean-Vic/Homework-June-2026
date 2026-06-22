function eraseOverlapIntervals(intervals: number[][]): number {
  if (intervals.length <= 1) {
    return 0;
  }

  intervals.sort((a, b) => a[1] - b[1]);

  let removed = 0;
  let previousEnd = intervals[0][1];

  for (let i = 1; i < intervals.length; i++) {
    const [start, end] = intervals[i];

    if (start < previousEnd) {
      removed++;
    } else {
      previousEnd = end;
    }
  }

  return removed;
}
