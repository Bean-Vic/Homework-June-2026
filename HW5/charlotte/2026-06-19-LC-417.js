function pacificAtlantic(heights) {
  const rows = heights.length;
  const cols = heights[0].length;
  const pacific = Array.from({ length: rows }, () => Array(cols).fill(false));
  const atlantic = Array.from({ length: rows }, () => Array(cols).fill(false));

  function dfs(row, col, ocean, previousHeight) {
    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      ocean[row][col] ||
      heights[row][col] < previousHeight
    ) {
      return;
    }

    ocean[row][col] = true;

    dfs(row + 1, col, ocean, heights[row][col]);
    dfs(row - 1, col, ocean, heights[row][col]);
    dfs(row, col + 1, ocean, heights[row][col]);
    dfs(row, col - 1, ocean, heights[row][col]);
  }

  for (let row = 0; row < rows; row++) {
    dfs(row, 0, pacific, -Infinity);
    dfs(row, cols - 1, atlantic, -Infinity);
  }

  for (let col = 0; col < cols; col++) {
    dfs(0, col, pacific, -Infinity);
    dfs(rows - 1, col, atlantic, -Infinity);
  }

  const result = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (pacific[row][col] && atlantic[row][col]) {
        result.push([row, col]);
      }
    }
  }

  return result;
}
