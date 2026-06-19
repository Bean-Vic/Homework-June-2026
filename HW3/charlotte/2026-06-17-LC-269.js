function alienOrder(words) {
  const graph = new Map();
  const indegree = new Map();

  for (const word of words) {
    for (const char of word) {
      if (!graph.has(char)) {
        graph.set(char, new Set());
        indegree.set(char, 0);
      }
    }
  }

  for (let i = 0; i < words.length - 1; i++) {
    const first = words[i];
    const second = words[i + 1];
    const minLength = Math.min(first.length, second.length);
    let foundDifference = false;

    for (let j = 0; j < minLength; j++) {
      const from = first[j];
      const to = second[j];

      if (from !== to) {
        if (!graph.get(from).has(to)) {
          graph.get(from).add(to);
          indegree.set(to, indegree.get(to) + 1);
        }

        foundDifference = true;
        break;
      }
    }

    if (!foundDifference && first.length > second.length) {
      return '';
    }
  }

  const queue = [];

  for (const [char, count] of indegree) {
    if (count === 0) {
      queue.push(char);
    }
  }

  let order = '';

  while (queue.length > 0) {
    const char = queue.shift();
    order += char;

    for (const neighbor of graph.get(char)) {
      indegree.set(neighbor, indegree.get(neighbor) - 1);

      if (indegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  return order.length === indegree.size ? order : '';
}
