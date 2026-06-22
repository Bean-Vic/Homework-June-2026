// 261. Graph Valid Tree
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */
var validTree = function(n, edges) {
    // Condition 1: a tree with n nodes must have exactly n-1 edges
    if (edges.length !== n - 1) return false;

    // Union-Find setup
    const parent = Array.from({ length: n }, (_, i) => i);

    const find = (x) => {
        if (parent[x] !== x) parent[x] = find(parent[x]); // path compression
        return parent[x];
    };

    const union = (x, y) => {
        const px = find(x), py = find(y);
        if (px === py) return false; // cycle detected
        parent[px] = py;
        return true;
    };

    // Condition 2: no cycles → all unions must succeed
    for (const [u, v] of edges) {
        if (!union(u, v)) return false;
    }

    return true;
};

// Time: O(n·α(n)) ≈ O(n) | Space: O(n)
