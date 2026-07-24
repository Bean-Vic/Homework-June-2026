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
 * @return {number[][]}
 */
const levelOrder = function(root) {
    if (!root) return [];

    const q = [root];
    const result = [];
    
    while (q.length > 0) {
        const level = [];
        const size = q.length; 
        
        for (let i = 0; i < size; i++) {
            const cur = q.shift();
            level.push(cur.val);
            
            if (cur.left) q.push(cur.left);
            if (cur.right) q.push(cur.right);
        }
        
        result.push(level);
    }

    return result;
};