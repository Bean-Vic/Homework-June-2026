//```jsx
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
//```;

// Implement a function to merge two arrays of objects on uuid, but first has uuid and name, second has uuid and role. With the not existing property, fill with null. Sort according to uuid after merge.

//1. get unique uuids from both arrays, use set to remove redundant uuids
const uuid = [
  ...new Set([
    ...first.map((item) => item.uuid),
    ...second.map((item) => item.uuid),
  ]),
];

//2. find same uuid items in both arrays, return an object for every uuid containing name and role (if not found, use null)
const merged = uuid.map((uuid) => {
  const itemName = first.find((ele) => ele.uuid === uuid);
  const itemRole = second.find((ele) => ele.uuid === uuid);
  return {
    uuid,
    name: itemName ? itemName.name : null,
    role: itemRole ? itemRole.role : null,
  };
});

//3. use sort to sort from smaller uuid to larger, sort does not return a new object, it changes original merged.
merged.sort((a, b) => a.uuid - b.uuid);
