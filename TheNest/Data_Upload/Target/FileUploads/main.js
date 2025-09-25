// Log to confirm script is executing
console.log("Main.js loaded");
/* ------------ CONFIG ------------ */
const DROPZONE_IDENTIFIERS = [
  { label: "Sales Plan", id: "target_forecast" },
  { label: "Sales + Inventory", id: "target_sales" },
  { label: "VA Buy Plan", id: "target_soft_commits" },
  { label: "Hard Commit (PO Details)", id: "hard_commit_po_details" },
  { label: "Hard Commit (OTB Details)", id: "hard_commit_otb_details" }
];
const N8N_WEBHOOK_URL =
  "https://farylrobin.app.n8n.cloud/webhook/8ac32273-95ab-477f-a54f-eaff34d459da";
const N8N_WEBHOOK_URL_TARGET =
  "https://farylrobin.app.n8n.cloud/webhook/5220dc45-a9fe-4934-a5d8-d908a6024868";
const N8N_WEBHOOK_URL_SOFT_COMMITS =
  "https://farylrobin.app.n8n.cloud/webhook/b0bbab96-b2d2-4428-ba6c-8b06c0a27081";

const WEBHOOK_ROUTE = {
  hard_commit_po_details: N8N_WEBHOOK_URL,
  hard_commit_otb_details: N8N_WEBHOOK_URL,
  target_sales: N8N_WEBHOOK_URL_TARGET,
  target_soft_commits: N8N_WEBHOOK_URL_SOFT_COMMITS,
  target_forecast: N8N_WEBHOOK_URL_TARGET
};
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

  /* add files + metadata (grouped by webhook) */
  const groupsByWebhook = {};
  Object.entries(filesByDropzone).forEach(([identifier, files]) => {
    const webhook = WEBHOOK_ROUTE[identifier] || N8N_WEBHOOK_URL;
    if (!groupsByWebhook[webhook]) groupsByWebhook[webhook] = [];
    files.forEach((file, idx) => {
      groupsByWebhook[webhook].push({ identifier, file, index: idx });
    });
  });

  // For each webhook group, build a separate FormData and send it
  const webhooks = Object.keys(groupsByWebhook);
  for (const webhook of webhooks) {
    const formData = new FormData();
    formData.append("submissionTime", new Date().toISOString());

    const fileMetadata = [];
    groupsByWebhook[webhook].forEach(({ identifier, file, index }) => {
      const key = "files"; // keep a single field name so n8n captures files as files, files_2, etc.
      formData.append(key, file, file.name);
      // Attach the dropzone identifier alongside each file
      formData.append("dropzone_identifier", identifier);
      fileMetadata.push({
        formDataKey: key,
        originalName: file.name,
        size: file.size,
        type: file.type,
        dropzone_identifier: identifier,
        index
      });
    });
    formData.append("metadata", JSON.stringify(fileMetadata));

    await fetch(webhook, {
      method: "POST",
      mode: "no-cors", // avoid CORS pre-flight; fire-and-forget
      body: formData
    });
  }

  try {
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
  // no longer calling renderVersionTag()
}

// Create the drop‑zones immediately; they don't depend on seasons
DROPZONE_IDENTIFIERS.forEach((dz) => createDropzone(dz));

// Kick off the season-aware UI once the DOM is ready
window.addEventListener("DOMContentLoaded", init);