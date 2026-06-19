const first = [
  { uuid: 2, name: 'test' },
  { uuid: 5, name: 'test5' },
  { uuid: 3, name: 'test3' },
];

const second = [
  { uuid: 6, role: 'pm' },
  { uuid: 4, role: 'engineer' },
  { uuid: 1, role: 'manager' },
  { uuid: 2, role: 'associate' },
];

const firstMap = new Map(first.map((item) => [item.uuid, item]));
const secondMap = new Map(second.map((item) => [item.uuid, item]));

const mergedItems = Array.from(
  new Set([...firstMap.keys(), ...secondMap.keys()]),
)
  .map((uuid) => ({
    uuid,
    name: firstMap.get(uuid)?.name ?? null,
    role: secondMap.get(uuid)?.role ?? null,
  }))
  .sort((a, b) => a.uuid - b.uuid);

console.log(mergedItems);
