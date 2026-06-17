function reverseBits(n: number): number {
  const binary: string = n.toString(2).padStart(32, "0");
  const reversed: string = binary.split("").reverse().join("");
  return parseInt(reversed, 2);
}
