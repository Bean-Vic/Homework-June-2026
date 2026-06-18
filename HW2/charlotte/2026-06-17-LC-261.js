function validTree(n, edges) {
  if (edges.length !== n - 1) {
    return false;
  }

  const graph = Array.from({ length: n }, () => []);

  for (const [a, b] of edges) {
    graph[a].push(b);
    graph[b].push(a);
  }

  const visited = new Set();
  const stack = [0];

  while (stack.length > 0) {
    const node = stack.pop();

    if (visited.has(node)) {
      continue;
    }

    visited.add(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  return visited.size === n;
}
