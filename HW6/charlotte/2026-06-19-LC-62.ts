function uniquePaths(m: number, n: number): number {
  const ways = new Array<number>(n).fill(1);

  for (let row = 1; row < m; row++) {
    for (let col = 1; col < n; col++) {
      ways[col] += ways[col - 1];
    }
  }

  return ways[n - 1];
}
