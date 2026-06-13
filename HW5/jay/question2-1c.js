const DEFAULT_URL = "https://jsonplaceholder.typicode.com/users/1";
const DELAY_MS = 2000;

const button = document.getElementById("request-button");
const messageBox = document.getElementById("message");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

// Fetches the url and logs the JSON string to the console after 2 seconds.
// The fetch and the timer run concurrently, so the log happens at the
// 2-second mark (or when the fetch finishes, whichever is later).
async function delayedRequest(url = DEFAULT_URL) {
  const [data] = await Promise.all([fetchJson(url), delay(DELAY_MS)]);
  console.log(JSON.stringify(data));
  return data;
}

function showMessage(text, isError = false) {
  messageBox.textContent = text;
  messageBox.className = isError ? "error" : "status";
}

button.addEventListener("click", async () => {
  button.disabled = true;
  showMessage("Waiting ...");

  try {
    await delayedRequest();
    showMessage("Check console for the data");
  } catch (error) {
    showMessage(`Something went wrong: ${error.message}`, true);
  } finally {
    button.disabled = false;
  }
});
