const mergeByUuid = (arr1, arr2) => {
  // 1. 两个数组分别转成 Map，key 是 uuid
  const map1 = new Map(arr1.map(item => [item.uuid, item]));
  const map2 = new Map(arr2.map(item => [item.uuid, item]));

  // 2. 收集所有出现过的 uuid（Set 自动去重）
  const allUuids = new Set([...map1.keys(), ...map2.keys()]);

  // 3. 对每个 uuid，从两个 Map 里取数据，缺失填 null
  const merged = [...allUuids].map(uuid => ({
    uuid,
    name: map1.get(uuid)?.name ?? null,
    role: map2.get(uuid)?.role ?? null,
  }));

  // 4. 按 uuid 升序排序
  return merged.sort((a, b) => a.uuid - b.uuid);
};

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

console.log(mergeByUuid(first, second));
