function cloneGraph(node) {
  if (node === null) {
    return null;
  }

  const clones = new Map();

  function clone(current) {
    if (clones.has(current)) {
      return clones.get(current);
    }

    const copiedNode = new Node(current.val);
    clones.set(current, copiedNode);

    for (const neighbor of current.neighbors) {
      copiedNode.neighbors.push(clone(neighbor));
    }

    return copiedNode;
  }

  return clone(node);
}
