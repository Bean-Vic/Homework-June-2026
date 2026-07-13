const uploadForm = document.getElementById("uploadForm");
const imageInput = document.getElementById("imageInput");
const searchInput = document.getElementById("searchInput");
const garmentTypeFilter = document.getElementById("garmentTypeFilter");
const styleFilter = document.getElementById("styleFilter");
const materialFilter = document.getElementById("materialFilter");
const seasonFilter = document.getElementById("seasonFilter");
const occasionFilter = document.getElementById("occasionFilter");
const clearFilters = document.getElementById("clearFilters");
const imageGrid = document.getElementById("imageGrid");
const countText = document.getElementById("countText");

const filterMap = {
  garmentType: garmentTypeFilter,
  style: styleFilter,
  material: materialFilter,
  season: seasonFilter,
  occasion: occasionFilter
};

async function fetchImages() {
  const params = new URLSearchParams();

  if (searchInput.value.trim()) params.set("search", searchInput.value.trim());
  if (garmentTypeFilter.value) params.set("garmentType", garmentTypeFilter.value);
  if (styleFilter.value) params.set("style", styleFilter.value);
  if (materialFilter.value) params.set("material", materialFilter.value);
  if (seasonFilter.value) params.set("season", seasonFilter.value);
  if (occasionFilter.value) params.set("occasion", occasionFilter.value);

  const response = await fetch(`/api/images?${params.toString()}`);
  const images = await response.json();

  renderImages(images);
}

async function fetchFilterOptions() {
  const response = await fetch("/api/filters");
  const options = await response.json();

  Object.entries(filterMap).forEach(([field, select]) => {
    const currentValue = select.value;
    const label = select.options[0].textContent;

    select.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = label;
    select.appendChild(defaultOption);

    (options[field] || []).forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });

    select.value = currentValue;
  });
}

function renderImages(images) {
  countText.textContent = `${images.length} image${images.length === 1 ? "" : "s"}`;

  if (images.length === 0) {
    imageGrid.innerHTML = `<p class="empty">No matching images yet. Upload one to start.</p>`;
    return;
  }

  imageGrid.innerHTML = images.map((item) => {
    const meta = item.metadata || {};
    const colors = (meta.colorPalette || []).join(", ");
    const tags = (item.tags || []).join(", ");

    return `
      <article class="card">
        <img src="${item.imageUrl}" alt="${item.originalName}" />
        <div class="card-body">
          <h3>${item.originalName}</h3>
          <p class="description">${meta.description || ""}</p>

          <div class="meta">
            <span>Type: ${meta.garmentType || "-"}</span>
            <span>Style: ${meta.style || "-"}</span>
            <span>Material: ${meta.material || "-"}</span>
            <span>Colors: ${colors || "-"}</span>
            <span>Pattern: ${meta.pattern || "-"}</span>
            <span>Season: ${meta.season || "-"}</span>
            <span>Occasion: ${meta.occasion || "-"}</span>
            <span>Location: ${meta.locationContext || "-"}</span>
          </div>

          <p><strong>Trend notes:</strong> ${meta.trendNotes || ""}</p>
          <p><strong>Designer notes:</strong> ${item.notes || "No notes yet."}</p>
          <p><strong>Tags:</strong> ${tags || "No tags yet."}</p>

          <div class="annotation">
            <textarea id="notes-${item.id}" placeholder="Add designer notes">${item.notes || ""}</textarea>
            <input id="tags-${item.id}" type="text" placeholder="tags, separated, by comma" value="${tags}" />
            <button onclick="saveAnnotation('${item.id}')">Save Notes</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

async function saveAnnotation(id) {
  const notes = document.getElementById(`notes-${id}`).value;
  const tags = document.getElementById(`tags-${id}`).value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  await fetch(`/api/images/${id}/annotations`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ notes, tags })
  });

  await fetchFilterOptions();
  await fetchImages();
}

uploadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const file = imageInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  await fetch("/api/images", {
    method: "POST",
    body: formData
  });

  imageInput.value = "";
  await fetchFilterOptions();
  await fetchImages();
});

[searchInput, garmentTypeFilter, styleFilter, materialFilter, seasonFilter, occasionFilter].forEach((element) => {
  element.addEventListener("input", fetchImages);
  element.addEventListener("change", fetchImages);
});

clearFilters.addEventListener("click", () => {
  searchInput.value = "";
  garmentTypeFilter.value = "";
  styleFilter.value = "";
  materialFilter.value = "";
  seasonFilter.value = "";
  occasionFilter.value = "";
  fetchImages();
});

fetchFilterOptions();
fetchImages();
