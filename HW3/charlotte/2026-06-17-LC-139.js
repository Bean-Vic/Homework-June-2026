function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const canBreak = new Array(s.length + 1).fill(false);
  canBreak[0] = true;

  for (let end = 1; end <= s.length; end++) {
    for (let start = 0; start < end; start++) {
      if (canBreak[start] && words.has(s.slice(start, end))) {
        canBreak[end] = true;
        break;
      }
    }
  }

  return canBreak[s.length];
}
