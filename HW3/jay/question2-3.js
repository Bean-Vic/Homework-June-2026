


const first = [
  { uuid: 2, name: "test" },
  { uuid: 5, name: "test5" },
  { uuid: 3, name: "test3" }
];

const second = [
  { uuid: 6, role: "pm" },
  { uuid: 4, role: "engineer" },
  { uuid: 1, role: "manager" },
  { uuid: 2, role: "associate" }
];

function mergeArrays(first, second) {
  const map = new Map();

  // Add first array
  first.forEach(item => {
    map.set(item.uuid, {
      uuid: item.uuid,
      name: item.name,
      role: null
    });
  });

  // Merge second array
  second.forEach(item => {
    if (map.has(item.uuid)) {
      map.get(item.uuid).role = item.role;
    } else {
      map.set(item.uuid, {
        uuid: item.uuid,
        name: null,
        role: item.role
      });
    }
  });

  return [...map.values()].sort((a, b) => a.uuid - b.uuid);
}

const result = mergeArrays(first, second);

console.log(result);


