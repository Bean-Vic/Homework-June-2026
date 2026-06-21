


/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
    candidates.sort((a, b) => a - b);

    const res = [];
    const path = [];

    function dfs(i, total) {
        if (total === target) {
            res.push([...path]);
            return;
        }

        if (total > target || i >= candidates.length) {
            return;
        }

        // choose candidates[i]
        path.push(candidates[i]);
        dfs(i, total + candidates[i]);
        path.pop();

        // skip candidates[i]
        dfs(i + 1, total);
    }

    dfs(0, 0);
    return res;
};