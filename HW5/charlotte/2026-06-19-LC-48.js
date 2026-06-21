function rotate(matrix) {
  const n = matrix.length;

  for (let row = 0; row < n; row++) {
    for (let col = row + 1; col < n; col++) {
      [matrix[row][col], matrix[col][row]] = [
        matrix[col][row],
        matrix[row][col],
      ];
    }
  }

  for (const row of matrix) {
    row.reverse();
  }
}
