function serialize(root) {
  const values = [];

  function dfs(node) {
    if (node === null) {
      values.push('null');
      return;
    }

    values.push(String(node.val));
    dfs(node.left);
    dfs(node.right);
  }

  dfs(root);

  return values.join(',');
}

function deserialize(data) {
  const values = data.split(',');
  let index = 0;

  function dfs() {
    if (values[index] === 'null') {
      index++;
      return null;
    }

    const node = new TreeNode(Number(values[index]));
    index++;
    node.left = dfs();
    node.right = dfs();

    return node;
  }

  return dfs();
}
