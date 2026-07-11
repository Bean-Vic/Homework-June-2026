const grid = document.getElementById("grid");
const filtersEl = document.getElementById("filters");
const searchEl = document.getElementById("search");
let activeFilters = {};

// All rendering builds the DOM with createElement + textContent rather than
// innerHTML string interpolation, so descriptions, annotations, filenames and
// filter values (which originate from the model output and user notes) can
// never be interpreted as HTML. This closes the obvious XSS hole.

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

async function loadFilters() {
  const vals = await (await fetch("/filters")).json();
  filtersEl.innerHTML = "";
  for (const [key, options] of Object.entries(vals)) {
    if (!options.length) continue;
    const sel = document.createElement("select");
    sel.appendChild(new Option(`${key}: any`, ""));
    for (const o of options) sel.appendChild(new Option(o, o));
    sel.onchange = () => {
      if (sel.value) activeFilters[key] = sel.value;
      else delete activeFilters[key];
      loadImages();
    };
    filtersEl.appendChild(sel);
  }
}

async function loadImages() {
  const params = new URLSearchParams(activeFilters);
  const data = await (await fetch("/images?" + params)).json();
  render(data.images);
}

async function runSearch() {
  const q = searchEl.value.trim();
  if (!q) return loadImages();
  const data = await (await fetch("/search?q=" + encodeURIComponent(q))).json();
  render(data.images);
}

function render(images) {
  grid.innerHTML = "";
  for (const img of images) {
    const a = img.attributes || {};
    const card = el("div", "card");

    const im = el("img");
    im.src = "/image/" + encodeURIComponent(img.filename || "");
    im.alt = a.garment_type || "garment";
    card.appendChild(im);

    card.appendChild(el("p", "desc", img.description || ""));
    card.appendChild(el("p", "attrs",
      `${a.garment_type || "?"} · ${a.material || "?"} · ${(a.color_palette || []).join(", ")}`));
    card.appendChild(el("p", "ctx",
      [img.city, img.country, img.year].filter(Boolean).join(", ")));

    const notes = el("ul", "notes");
    for (const n of img.annotations || []) notes.appendChild(el("li", null, `📝 ${n}`));
    card.appendChild(notes);

    const form = el("form", "ann");
    const input = el("input");
    input.placeholder = "add note…";
    const addBtn = el("button", null, "Add");
    form.append(input, addBtn);
    form.onsubmit = async (e) => {
      e.preventDefault();
      await fetch(`/images/${img.id}/annotations`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input.value }),
      });
      loadImages();
    };
    card.appendChild(form);

    grid.appendChild(card);
  }
}

document.getElementById("upload-form").onsubmit = async (e) => {
  e.preventDefault();
  const status = document.getElementById("upload-status");
  status.textContent = "Uploading & classifying…";
  const res = await fetch("/images", { method: "POST", body: new FormData(e.target) });
  status.textContent = res.ok ? "Done." : "Upload failed.";
  e.target.reset();
  await loadFilters();
  await loadImages();
};

document.getElementById("clear").onclick = () => {
  activeFilters = {}; searchEl.value = "";
  loadFilters(); loadImages();
};
searchEl.oninput = () => { if (!searchEl.value.trim()) loadImages(); };
searchEl.onchange = runSearch;

loadFilters();
loadImages();
