// 133. Clone Graph

/**
 * // Definition for a _Node.
 * function _Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {_Node} node
 * @return {_Node}
 */
var cloneGraph = function(node) {
    // DFS
    if (!node) return null;

    const visited = new Map(); // 原节点 → 克隆节点

    function dfs(node) {
        if (visited.has(node)) return visited.get(node);

        const clone = new _Node(node.val);
        visited.set(node, clone); // 先存，再处理邻居（防止死循环）

        for (const neighbor of node.neighbors) {
            clone.neighbors.push(dfs(neighbor));
        }

        return clone;
    }

    return dfs(node);

    // BFS
    // if (!node) return null;

    // const visited = new Map();
    // const queue = [node];
    // visited.set(node, new _Node(node.val));

    // while (queue.length) {
    //     const curr = queue.shift();

    //     for (const neighbor of curr.neighbors) {
    //         if (!visited.has(neighbor)) {
    //             visited.set(neighbor, new _Node(neighbor.val));
    //             queue.push(neighbor);
    //         }
    //         visited.get(curr).neighbors.push(visited.get(neighbor));
    //     }
    // }

    // return visited.get(node);

};


// 为什么要先 set 再递归:  图可能有环，如果先递归再存，会死循环
// Map 的作用: 同一个原节点只克隆一次，后续直接复用
// 时间复杂度:  O(N + E)，N 节点数，E 边数
// 空间复杂度:  O(N)，Map + 递归栈
