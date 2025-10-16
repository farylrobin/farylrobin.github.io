// Log to confirm script is executing
console.log("Main.js loaded");
/* ------------ CONFIG ------------ */
const DROPZONE_IDENTIFIERS = [
  { label: "Commit Header", id: "commit_header" },
  { label: "Commit Items", id: "commit_items" },
  { label: "PO Details", id: "po_details" },
  { label: "OTB Details", id: "otb_details" },
  { label: "Assortment Details", id: "assortment_details" }
];
const N8N_WEBHOOK_URL =
  "https://farylrobin.app.n8n.cloud/webhook/8ac32273-95ab-477f-a54f-eaff34d459da";
const WEBHOOK_ROUTE = {
  commit_header: N8N_WEBHOOK_URL,
  commit_items: N8N_WEBHOOK_URL,
  po_details: N8N_WEBHOOK_URL,
  otb_details: N8N_WEBHOOK_URL,
  assortment_details: N8N_WEBHOOK_URL
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
    // Track the file in memory for this dropzone
    filesByDropzone[identifier].push(file);

    // Create list item container
    const li = document.createElement("li");
    li.style.position = "relative";
    li.style.paddingRight = "1.75rem"; // space for the X button

    // Filename + size label
    const label = document.createElement("span");
    label.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
    li.appendChild(label);

    // Removable X button (top-right)
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✕";
    removeBtn.setAttribute("aria-label", "Remove file");
    removeBtn.title = "Remove file";
    removeBtn.style.position = "absolute";
    removeBtn.style.top = "0";
    removeBtn.style.right = "0";
    removeBtn.style.border = "none";
    removeBtn.style.background = "transparent";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.fontSize = "1rem";
    removeBtn.style.lineHeight = "1";
    removeBtn.style.padding = "0.25rem 0.4rem";

    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Remove this specific File object from the staged array
      const arr = filesByDropzone[identifier];
      const idx = arr.indexOf(file);
      if (idx !== -1) arr.splice(idx, 1);

      // Remove from UI
      li.remove();

      // Update submit button enabled state
      submitButton.disabled = !Object.values(filesByDropzone).some(
        (arr) => arr.length > 0
      );

      // Hide any prior messages when changing staged files
      errorBox.style.display = "none";
      successBox.style.display = "none";
    });

    li.appendChild(removeBtn);
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
    if (!files || files.length === 0) return; // skip empty dropzones
    const webhook = WEBHOOK_ROUTE[identifier];
    if (!webhook) { console.warn(`No webhook route for ${identifier}; skipping files for safety.`); return; }
    if (!groupsByWebhook[webhook]) groupsByWebhook[webhook] = [];
    files.forEach((file, idx) => {
      groupsByWebhook[webhook].push({ identifier, file, index: idx });
    });
  });

  // For each webhook group with files, build a separate FormData and send it
  const webhooks = Object.keys(groupsByWebhook).filter(
    (w) => Array.isArray(groupsByWebhook[w]) && groupsByWebhook[w].length > 0
  );
  for (const webhook of webhooks) {
    const formData = new FormData();
    formData.append("submissionTime", new Date().toISOString());
  
    const fileMetadata = [];
    const mapping = {}; // file_N => dropzone_identifier
    let fileIndex = 0;
  
    groupsByWebhook[webhook].forEach(({ identifier, file, index }) => {
      const key = `file_${fileIndex++}`;
      formData.append(key, file, file.name);
      mapping[key] = identifier;
      fileMetadata.push({
        formDataKey: key,
        originalName: file.name,
        size: file.size,
        type: file.type,
        dropzone_identifier: identifier,
        originalIndex: index
      });
    });
  
    // Only send if we actually appended files
    if (fileMetadata.length > 0) {
      formData.append("mapping", JSON.stringify(mapping));
      formData.append("metadata", JSON.stringify(fileMetadata));
  
      // Light diagnostics without exposing file contents
      console.log(
        `[upload] POST -> ${webhook} | files: ${fileMetadata.length} | keys: ${Object.keys(mapping).join(", ")}`
      );
  
      await fetch(webhook, {
        method: "POST",
        mode: "no-cors", // avoid CORS pre-flight; fire-and-forget
        body: formData
      });
    } else {
      console.log(`[upload] Skipped ${webhook}: no files to send`);
    }
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