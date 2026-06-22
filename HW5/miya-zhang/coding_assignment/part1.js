document
  .getElementById("load-users-btn")
  .addEventListener("click", async () => {
    const tbody = document.getElementById("table-body");
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users",
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const users = await response.json();

      let rowsHTML = "";
      users.forEach((user) => {
        rowsHTML += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.address.city}</td>
                </tr>
            `;
      });

      tbody.innerHTML = rowsHTML;
    } catch (error) {
      tbody.innerHTML = `<tr><td colspan="4" style="color:red;">Error: ${error.message}</td></tr>`;
    }
  });
