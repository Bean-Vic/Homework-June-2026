const tabButtons = document.querySelector(".tab-buttons");
const buttons = document.querySelectorAll("button");
const contents = document.querySelectorAll(".tab-content");

function showCity(cityName) {
  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.city === cityName);
  });

  contents.forEach((content) => {
    content.style.display = content.id === cityName ? "block" : "none";
  });
}

showCity("London");

tabButtons.addEventListener("click", (event) => {
  if (event.target.tagName !== "BUTTON") return;

  showCity(event.target.dataset.city);
});
