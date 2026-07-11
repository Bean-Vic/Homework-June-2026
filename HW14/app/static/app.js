// Gallery page: sticky filter bar + card grid. All DOM built with
// createElement/textContent (never innerHTML interpolation) so model output
// and user notes can't be interpreted as HTML.
const grid = document.getElementById("grid");
const filtersEl = document.getElementById("filters");
const searchEl = document.getElementById("search");
const emptyHint = document.getElementById("empty-hint");
let activeFilters = {};

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
    sel.title = key;
    sel.appendChild(new Option(`${key.replaceAll("_", " ")}: any`, ""));
    for (const o of options) sel.appendChild(new Option(o, o));
    if (activeFilters[key]) sel.value = activeFilters[key];
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
  emptyHint.hidden = images.length > 0;
  for (const img of images) {
    const a = img.attributes || {};
    const card = el("div", "card");

    const im = el("img");
    im.src = "/image/" + encodeURIComponent(img.filename || "");
    im.alt = a.garment_type || "garment";
    im.loading = "lazy";
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
    const addBtn = el("button", "btn", "Add");
    form.append(input, addBtn);
    form.onsubmit = async (e) => {
      e.preventDefault();
      if (!input.value.trim()) return;
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

document.getElementById("clear").onclick = () => {
  activeFilters = {}; searchEl.value = "";
  loadFilters(); loadImages();
};
searchEl.oninput = () => { if (!searchEl.value.trim()) loadImages(); };
searchEl.onchange = runSearch;

loadFilters();
loadImages();
