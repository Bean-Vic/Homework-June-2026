// 261. Graph Valid Tree

/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */
var validTree = function(n, edges) {
    // 条件1：边数必须恰好是 n-1
    if (edges.length !== n - 1) return false;

    const parent = Array.from({ length: n }, (_, i) => i);

    function find(x) {
        if (parent[x] !== x) parent[x] = find(parent[x]); // 路径压缩
        return parent[x];
    }

    function union(x, y) {
        const px = find(x), py = find(y);
        if (px === py) return false; // 已连通 → 成环
        parent[px] = py;
        return true;
    }

    for (const [u, v] of edges) {
        if (!union(u, v)) return false; // 有环
    }

    return true; // 边数已保证连通
};

// 时间/空间复杂度：O(N)/O(N)
