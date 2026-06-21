function combinationSum(candidates, target) {
  const result = [];

  function backtrack(start, total, path) {
    if (total === target) {
      result.push([...path]);
      return;
    }

    if (total > target) {
      return;
    }

    for (let i = start; i < candidates.length; i++) {
      path.push(candidates[i]);
      backtrack(i, total + candidates[i], path);
      path.pop();
    }
  }

  backtrack(0, 0, []);

  return result;
}
