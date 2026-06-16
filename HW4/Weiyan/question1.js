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

function renderTable(data) {

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');

    data.tableHeader.forEach(ele => {
        const th = document.createElement('th');
        th.textContent = ele;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    data.tableContent.forEach(student => {
        const bodyRow = document.createElement('tr');

        data.tableHeader.forEach(key => {
            const td = document.createElement('td');
            td.textContent = student[key];
            bodyRow.appendChild(td);
        });
        
        tbody.appendChild(bodyRow);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    document.getElementById('table-container').appendChild(table);
}

renderTable(tableInfo);