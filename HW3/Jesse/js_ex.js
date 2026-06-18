'use strict';

// 1:

const itemsObject = [
  { quantity: 1, price: 200 },
  { quantity: 3, price: 350 },
  { quantity: 5, price: 400 },
];



const doubleItems = (items) =>
  items.map((item) => ({
    quantity: item.quantity * 2,
    price: item.price * 2,
  }));



const filterItems = (items) =>
  items.filter((item) => item.quantity > 2 && item.price > 300);


const getTotalValue = (items) =>
  items.reduce((total, item) => total + item.quantity * item.price, 0);

// 2.

const string =
  ' Perhaps The Easiest-to-understand Case For Reduce Is To Return The Sum Of All The Elements In An Array ';

const cleanString = (value) =>
  value
    .replace(/[^a-zA-Z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

// 3:

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

const mergeByUuid = (firstItems, secondItems) => {
  const namesByUuid = new Map(firstItems.map((item) => [item.uuid, item.name]));
  const rolesByUuid = new Map(secondItems.map((item) => [item.uuid, item.role]));
  const uuids = new Set(
    [...firstItems, ...secondItems].map((item) => item.uuid),
  );

  return [...uuids]
    .sort((firstUuid, secondUuid) => firstUuid - secondUuid)
    .map((uuid) => ({
      uuid,
      name: namesByUuid.get(uuid) ?? null,
      role: rolesByUuid.get(uuid) ?? null,
    }));
};


