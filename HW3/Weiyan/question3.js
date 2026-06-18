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

function mergeAndSortData(arr1, arr2) {
  const mergedMap = new Map();

  for (let i = 0; i < arr1.length; i++) {
    let item = arr1[i];
    mergedMap.set(item.uuid, { 
      uuid: item.uuid, 
      name: item.name, 
      role: null 
    });
  }

  for (let i = 0; i < arr2.length; i++) {
    let item = arr2[i];

    if (mergedMap.has(item.uuid)) {
      let existingData = mergedMap.get(item.uuid);
      existingData.role = item.role; 
      
    } else {
      mergedMap.set(item.uuid, { 
        uuid: item.uuid, 
        name: null, 
        role: item.role 
      });
    }
  }

  const finalArray = Array.from(mergedMap.values());
  finalArray.sort(function(a, b) {
    return a.uuid - b.uuid;
  });

  return finalArray;
}

console.log(mergeAndSortData(first, second));