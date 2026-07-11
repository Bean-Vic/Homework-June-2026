// Upload page: submit the form, show real progress/errors, preview the
// classified result. DOM built with createElement/textContent (no innerHTML
// interpolation) — same XSS-safe pattern as app.js.
const form = document.getElementById("upload-form");
const statusEl = document.getElementById("upload-status");
const resultEl = document.getElementById("result");
const submitBtn = document.getElementById("submit-btn");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function setStatus(text, kind) {
  statusEl.hidden = !text;
  statusEl.textContent = text || "";
  statusEl.className = "status" + (kind ? " " + kind : "");
}

form.onsubmit = async (e) => {
  e.preventDefault();
  resultEl.hidden = true;
  resultEl.innerHTML = "";
  submitBtn.disabled = true;
  setStatus("Uploading & classifying… (this calls the AI model, ~5–15s)");

  try {
    // Don't send untouched fields — browsers include every input as "",
    // which the server would otherwise have to special-case.
    const data = new FormData(form);
    for (const [key, value] of [...data.entries()]) {
      if (typeof value === "string" && value.trim() === "") data.delete(key);
    }
    const res = await fetch("/images", { method: "POST", body: data });
    if (!res.ok) {
      // Surface the server's actual reason instead of a generic failure.
      let reason = `server returned ${res.status}`;
      try {
        const body = await res.json();
        if (body.detail) reason = typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail);
      } catch { /* non-JSON error body */ }
      setStatus(`Upload failed: ${reason}`, "error");
      return;
    }

    const img = await res.json();
    const a = img.attributes || {};
    setStatus("Done — classified successfully. Upload another, or go back to the library.", "ok");

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
    resultEl.appendChild(card);
    resultEl.hidden = false;
    form.reset();
  } catch (err) {
    setStatus(`Upload failed: ${err.message || "network error — is the server running?"}`, "error");
  } finally {
    submitBtn.disabled = false;
  }
};
