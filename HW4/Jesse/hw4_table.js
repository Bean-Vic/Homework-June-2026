const tableInfo = {
  tableHeader: ["Student Name", "Age", "Phone", "Address"],
  tableContent: [
    {
      "Student Name": "John",
      Age: 19,
      Phone: "455 - 983 - 0903",
      Address: "123 Ave, San Francisco, CA, 94011",
    },
    {
      "Student Name": "Alex",
      Age: 21,
      Phone: "455 - 983 - 0912",
      Address: "456 Rd, San Francisco, CA, 94012",
    },
    {
      "Student Name": "Josh",
      Age: 22,
      Phone: "455 - 345 - 0912",
      Address: "789 Dr, Newark, CA, 94016",
    },
    {
      "Student Name": "Matt",
      Age: 23,
      Phone: "321 - 345 - 0912",
      Address: "223 Dr, Sunnyvale, CA, 94016",
    },
  ],
};

const table = document.createElement("table");

const headerRow = document.createElement("tr");

tableInfo.tableHeader.forEach((header) => {
  const th = document.createElement("th");
  th.textContent = header;
  headerRow.appendChild(th);
});

table.appendChild(headerRow);

tableInfo.tableContent.forEach((student) => {
  const row = document.createElement("tr");

  tableInfo.tableHeader.forEach((header) => {
    const td = document.createElement("td");
    td.textContent = String(student[header]).replaceAll(" - ", "-");
    row.appendChild(td);
  });

  table.appendChild(row);
});

document.querySelector("#table-container").appendChild(table);
