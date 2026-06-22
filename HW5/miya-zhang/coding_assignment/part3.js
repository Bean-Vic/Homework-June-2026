// part3.js

async function delayedRequest(
  url = "https://jsonplaceholder.typicode.com/users/1",
) {
  const msgSpan = document.getElementById("part3-msg");

  msgSpan.textContent = "Waiting ...";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Fetch failed");
    const data = await response.json();

    msgSpan.textContent = "Check console for the data";

    setTimeout(() => {
      console.log(JSON.stringify(data, null, 2));
    }, 2000);
  } catch (error) {
    msgSpan.textContent = "Error fetching data.";
  }
}

document.getElementById("delayed-req-btn").addEventListener("click", () => {
  delayedRequest();
});
