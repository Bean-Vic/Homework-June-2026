var isSubtree = function (root, subRoot) {
  const isSameTree = (first, second) => {
    if (!first && !second) return true;
    if (!first || !second || first.val !== second.val) return false;

    return (
      isSameTree(first.left, second.left) &&
      isSameTree(first.right, second.right)
    );
  };

  if (!root) return false;
  if (isSameTree(root, subRoot)) return true;

  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
};
