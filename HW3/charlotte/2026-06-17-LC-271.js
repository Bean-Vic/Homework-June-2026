function encode(strs) {
  return strs.map((str) => `${str.length}#${str}`).join('');
}

function decode(s) {
  const result = [];
  let i = 0;

  while (i < s.length) {
    let delimiter = i;

    while (s[delimiter] !== '#') {
      delimiter++;
    }

    const length = Number(s.slice(i, delimiter));
    const start = delimiter + 1;
    const end = start + length;

    result.push(s.slice(start, end));
    i = end;
  }

  return result;
}
