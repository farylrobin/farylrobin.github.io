// Log to confirm script is executing
console.log("Main.js loaded");
let FORM_VERSION = "";
window.FORM_VERSION = FORM_VERSION;

function renderVersionTag() {
  const tag = document.getElementById("versionTag");
  if (tag) tag.textContent = `v ${FORM_VERSION}`;
}

(async () => {
  try {
    const res = await fetch('/package.json');
    if (!res.ok) throw new Error(`Failed to fetch package.json: ${res.status}`);
    const pkg = await res.json();
    FORM_VERSION = pkg.version;
  } catch (err) {
    console.error("Failed to load package version:", err);
    FORM_VERSION = "unknown";
  }
  window.FORM_VERSION = FORM_VERSION;
  renderVersionTag();
  console.log(`Main.js version: ${FORM_VERSION}`);
})();
/* ------------ CONFIG ------------ */
const DROPZONE_IDENTIFIERS = [
  { label: "Hard Commit (PO Details)", id: "hard_commit_po_details" },
  { label: "Hard Commit (OTB Details)", id: "hard_commit_otb_details" }
];
const N8N_WEBHOOK_URL =
  "https://farylrobin.app.n8n.cloud/webhook/8ac32273-95ab-477f-a54f-eaff34d459da";
/* -------------------------------- */

/* ------------ DOM refs ---------- */
let dropzoneGrid = document.getElementById("dropzoneGrid");
/* If the grid element is missing, create it dynamically */
if (!dropzoneGrid) {
  dropzoneGrid = document.createElement("div");
  dropzoneGrid.id = "dropzoneGrid";
  dropzoneGrid.className = "dropzone-grid";

  // Insert into <main> if present, otherwise append to body
  const fallbackTarget = document.querySelector("main") || document.body;
  fallbackTarget.appendChild(dropzoneGrid);
}

const submitButton = document.getElementById("submitButton");
const errorBox = document.getElementById("errorBox");
const successBox = document.getElementById("successBox");
const loadingBox = document.getElementById("loadingBox");
/* -------------------------------- */

let filesByDropzone = {};

/* --- create a single drop‑zone --- */
function createDropzone(identifier) {
  const container = document.createElement("div");
  container.className = "file-upload-container";

  const title = document.createElement("h3");
  title.className = "dropzone-title";
  title.textContent = identifier.label;

  const dropzone = document.createElement("div");
  dropzone.className = "dropzone";
  dropzone.innerHTML =
    "<p>Upload Here</p><p>(Drag 'n' drop files, or click)</p>";

  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.hidden = true;

  const fileList = document.createElement("aside");
  fileList.className = "staged-files";
  fileList.innerHTML = "<h4>Staged Files:</h4><ul></ul>";

  filesByDropzone[identifier.id] = [];

  /* --- events --- */
  dropzone.addEventListener("click", () => input.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("active");
  });

  dropzone.addEventListener("dragleave", () =>
    dropzone.classList.remove("active")
  );

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("active");
    handleFiles(identifier.id, e.dataTransfer.files, fileList);
  });

  input.addEventListener("change", () =>
    handleFiles(identifier.id, input.files, fileList)
  );

  /* --- assemble --- */
  container.appendChild(title);
  container.appendChild(dropzone);
  container.appendChild(input);
  container.appendChild(fileList);
  dropzoneGrid.appendChild(container);
}

/* --- handle files added --- */
function handleFiles(identifier, files, fileDisplayElement) {
  const list = fileDisplayElement.querySelector("ul");

  Array.from(files).forEach((file) => {
    filesByDropzone[identifier].push(file);

    const li = document.createElement("li");
    li.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
    list.appendChild(li);
  });

  submitButton.disabled = !Object.values(filesByDropzone).some(
    (arr) => arr.length > 0
  );
  errorBox.style.display = "none";
  successBox.style.display = "none";
}

/* ------------ Submit ------------- */
submitButton.addEventListener("click", async () => {
  const allFiles = Object.values(filesByDropzone).flat();
  if (allFiles.length === 0) {
    errorBox.textContent = "No files selected to upload.";
    errorBox.style.display = "block";
    return;
  }

  loadingBox.style.display = "block";
  errorBox.style.display = "none";
  successBox.style.display = "none";

  const formData = new FormData();
  formData.append("submissionTime", new Date().toISOString());

  /* add files + metadata */
  // All files use the single field name "files" so n8n can capture them under item.binary.filesX
  const fileMetadata = [];
  Object.entries(filesByDropzone).forEach(([identifier, files]) => {
    files.forEach((file, idx) => {
      const key = 'files';
      formData.append(key, file, file.name);
      // Attach the dropzone identifier as a JSON attribute for each file
      formData.append('dropzone_identifier', identifier);
      fileMetadata.push({
        formDataKey: key,
        originalName: file.name,
        size: file.size,
        type: file.type,
        dropzone_identifier: identifier,
        index: idx
      });
    });
  });
  formData.append("metadata", JSON.stringify(fileMetadata));

  try {
    await fetch(N8N_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors", // avoid CORS pre‑flight; fire‑and‑forget
      body: formData
    });

    const timestamp = new Date().toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit"
    });

    successBox.textContent = `Files uploaded ${timestamp}`;
    successBox.style.display = "block";

    /* reset UI */
    dropzoneGrid.innerHTML = "";
    filesByDropzone = {};
    DROPZONE_IDENTIFIERS.forEach((dz) => createDropzone(dz));
    submitButton.disabled = true;
  } catch (err) {
    errorBox.textContent = "Upload failed";
    errorBox.style.display = "block";
  } finally {
    loadingBox.style.display = "none";
  }
});

/* ---------- init ---------- */
async function init() {
  renderVersionTag();
}

// Create the drop‑zones immediately; they don't depend on seasons
DROPZONE_IDENTIFIERS.forEach((dz) => createDropzone(dz));

// Kick off the season-aware UI once the DOM is ready
window.addEventListener("DOMContentLoaded", init);