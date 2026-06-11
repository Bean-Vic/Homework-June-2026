export function canPlaceFlowers(flowerbed: number[], n: number): boolean {
  for (let i = 0; i < flowerbed.length && n > 0; i++) {
    if (flowerbed[i] === 1) continue;

    const leftEmpty = i === 0 || flowerbed[i - 1] === 0;
    const rightEmpty = i === flowerbed.length - 1 || flowerbed[i + 1] === 0;

    if (leftEmpty && rightEmpty) {
      flowerbed[i] = 1;
      n--;
    }
  }

  return n === 0;
}
