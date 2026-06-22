const first = [
  { uuid: 2, name: "test" },
  { uuid: 5, name: "test5" },
  { uuid: 3, name: "test3" },
];

const second = [
  { uuid: 6, role: "pm" },
  { uuid: 4, role: "engineer" },
  { uuid: 1, role: "manager" },
  { uuid: 2, role: "associate" },
];

const mergeAndSortArrays = (arr1, arr2) => {
  const mergedObj = [...arr1, ...arr2].reduce((acc, curr) => {
    const { uuid } = curr;
    if (!acc[uuid]) {
      acc[uuid] = { uuid, name: null, role: null };
    }

    acc[uuid] = { ...acc[uuid], ...curr };
    return acc;
  }, {});

  return Object.values(mergedObj).sort((a, b) => a.uuid - b.uuid);
};
