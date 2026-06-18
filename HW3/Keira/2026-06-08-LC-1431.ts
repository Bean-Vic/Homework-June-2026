function kidsWithCandies(candies: number[], extraCandies: number): boolean[] {
  const greatest = Math.max(...candies);

  return candies.map((candyCount) => candyCount + extraCandies >= greatest);
}
