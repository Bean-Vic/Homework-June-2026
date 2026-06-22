function isSubtree(root: TreeNode | null, subRoot: TreeNode | null): boolean {
  if (subRoot === null) {
    return true;
  }

  if (root === null) {
    return false;
  }

  return isSameTree(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}

function isSameTree(first: TreeNode | null, second: TreeNode | null): boolean {
  if (first === null && second === null) {
    return true;
  }

  if (first === null || second === null) {
    return false;
  }

  return first.val === second.val && isSameTree(first.left, second.left) && isSameTree(first.right, second.right);
}
