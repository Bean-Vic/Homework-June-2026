const tableInfo = {
  tableHeader: ['Student Name', 'Age', 'Phone', 'Address'],
  tableContent: [
    {
      'Student Name': 'John',
      Age: 19,
      Phone: '455 - 983 - 0903',
      Address: '123 Ave, San Francisco, CA, 94011',
    },
    {
      'Student Name': 'Alex',
      Age: 21,
      Phone: '455 - 983 - 0912',
      Address: '456 Rd, San Francisco, CA, 94012',
    },
    {
      'Student Name': 'Josh',
      Age: 22,
      Phone: '455 - 345 - 0912',
      Address: '789 Dr, Newark, CA, 94016',
    },
    {
      'Student Name': 'Matt',
      Age: 23,
      Phone: '321 - 345 - 0912',
      Address: '223 Dr, Sunnyvale, CA, 94016',
    },
  ],
};

const table = document.createElement('table');
table.style.borderCollapse = 'collapse';
table.style.width = '100%';

const thead = document.createElement('thead');
const headerRow = document.createElement('tr');

tableInfo.tableHeader.forEach((header) => {
  const th = document.createElement('th');
  th.textContent = header;
  th.style.border = '1px solid #cccccc';
  th.style.padding = '8px';
  th.style.backgroundColor = '#f2f2f2';
  th.style.textAlign = 'left';
  headerRow.appendChild(th);
});

thead.appendChild(headerRow);
table.appendChild(thead);

const tbody = document.createElement('tbody');

tableInfo.tableContent.forEach((student) => {
  const row = document.createElement('tr');

  tableInfo.tableHeader.forEach((header) => {
    const td = document.createElement('td');
    td.textContent = student[header];
    td.style.border = '1px solid #cccccc';
    td.style.padding = '8px';
    row.appendChild(td);
  });

  tbody.appendChild(row);
});

table.appendChild(tbody);
document.body.appendChild(table);
