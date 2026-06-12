const tableInfo = {
  tableHeader: ["Student Name", "Age", "Phone", "Address"],

  tableContent: [
    {
      "Student Name": "John",
      Age: 19,
      Phone: "455-983-0903",
      Address: "123 Ave, San Francisco, CA, 94011",
    },
    {
      "Student Name": "Alex",
      Age: 21,
      Phone: "455-983-0912",
      Address: "456 Rd, San Francisco, CA, 94012",
    },
    {
      "Student Name": "Josh",
      Age: 22,
      Phone: "455-345-0912",
      Address: "789 Dr, Newark, CA, 94016",
    },
    {
      "Student Name": "Matt",
      Age: 23,
      Phone: "321-345-0912",
      Address: "223 Dr, Sunnyvale, CA, 94016",
    },
  ],
};
const table = document.getElementById("student-table");
const headerHTML = tableInfo.tableHeader
  .map((header) => `<th>${header}</th>`)
  .join("");
const contentHTML = tableInfo.tableContent
  .map((student) => {
    return `
      <tr>
        <td>${student["Student Name"]}</td>
        <td>${student.Age}</td>
        <td>${student.Phone}</td>
        <td>${student.Address}</td>
      </tr>
    `;
  })
  .join("");
table.innerHTML = `
  <thead>
    <tr>
      ${headerHTML}
    </tr>
  </thead>

  <tbody>
    ${contentHTML}
  </tbody>
`;