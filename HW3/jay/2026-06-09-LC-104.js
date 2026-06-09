

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    let maxDepth = 0
    function dfs(node, depthYet) {
        if (!node){
            return;
        }
        depthYet += 1;
        maxDepth = Math.max(maxDepth, depthYet);
        dfs(node.left, depthYet);
        dfs(node.right, depthYet);
    }

    dfs(root, 0);
    return maxDepth;
};