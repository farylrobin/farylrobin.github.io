// Log to confirm script is executing
console.log("Main.js loaded");
/* ------------ CONFIG ------------ */
const ACCOUNT_LIST_PATH = "assets/AccountDropdownList.txt";

const DROPZONE_IDENTIFIERS = [{ label: "Sales Order Upload", id: "hard_commit_files" }];

const N8N_WEBHOOK_URL =
  "https://farylrobin.app.n8n.cloud/webhook/f5ed22f0-f5d6-494a-a8e1-e9d26285cc55";

const WEBHOOK_ROUTE = {
  hard_commit_files: N8N_WEBHOOK_URL
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

let accountSelect = document.getElementById("accountSelect");

/* If the select is missing, create it dynamically (failsafe) */
if (!accountSelect) {
  const controls = document.createElement("div");
  controls.className = "season-controls";
  controls.id = "accountControls";

  const label = document.createElement("label");
  label.htmlFor = "accountSelect";
  label.textContent = "Account:";

  accountSelect = document.createElement("select");
  accountSelect.id = "accountSelect";
  accountSelect.innerHTML = `<option value="">Select an account…</option>`;

  controls.appendChild(label);
  controls.appendChild(accountSelect);

  const app = document.querySelector(".app-container") || document.body;
  app.insertBefore(controls, dropzoneGrid);
}
/* -------------------------------- */

let filesByDropzone = {};

function updateSubmitEnabled() {
  const anyFiles = Object.values(filesByDropzone).some((arr) => Array.isArray(arr) && arr.length > 0);
  const hasAccount = !!(accountSelect && accountSelect.value && accountSelect.value.trim());
  submitButton.disabled = !(anyFiles && hasAccount);
}

accountSelect.addEventListener("change", () => {
  // Hide any prior messages when changing account
  errorBox.style.display = "none";
  successBox.style.display = "none";
  updateSubmitEnabled();
});

/* --- create a single drop-zone --- */
function createDropzone(identifier) {
  const container = document.createElement("div");
  container.className = "file-upload-container";

  const title = document.createElement("h3");
  title.className = "dropzone-title";
  title.textContent = identifier.label;

  const dropzone = document.createElement("div");
  dropzone.className = "dropzone";
  dropzone.innerHTML = "<p>Upload Here</p><p>(Drag 'n' drop files, or click)</p>";

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

  dropzone.addEventListener("dragleave", () => dropzone.classList.remove("active"));

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("active");
    handleFiles(identifier.id, e.dataTransfer.files, fileList);
  });

  input.addEventListener("change", () => handleFiles(identifier.id, input.files, fileList));

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

      // Update submit button enabled state (requires account + at least one file)
      updateSubmitEnabled();

      // Hide any prior messages when changing staged files
      errorBox.style.display = "none";
      successBox.style.display = "none";
    });

    li.appendChild(removeBtn);
    list.appendChild(li);
  });

  updateSubmitEnabled();
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

  const selectedAccount = (accountSelect?.value || "").trim();
  if (!selectedAccount) {
    errorBox.textContent = "Please select an account before uploading.";
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
    if (!webhook) {
      console.warn(`No webhook route for ${identifier}; skipping files for safety.`);
      return;
    }
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
    const mapping = {}; // file_N => dropzone_identifier (NOW: selected account)
    let fileIndex = 0;

    groupsByWebhook[webhook].forEach(({ identifier, file, index }) => {
      const key = `file_${fileIndex++}`;
      formData.append(key, file, file.name);

      // Send selected account as dropzone_identifier
      mapping[key] = selectedAccount;

      fileMetadata.push({
        formDataKey: key,
        originalName: file.name,
        size: file.size,
        type: file.type,
        dropzone_identifier: selectedAccount,
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

    // After reset: enable only if user has account selected and files exist (none exist now)
    updateSubmitEnabled();
  } catch (err) {
    errorBox.textContent = "Upload failed";
    errorBox.style.display = "block";
  } finally {
    loadingBox.style.display = "none";
  }
});

async function loadAccounts() {
  try {
    const res = await fetch(ACCOUNT_LIST_PATH, { cache: "no-store" });
    const text = await res.text();

    const accounts = text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    // Keep the placeholder; replace any existing options after it
    accountSelect.innerHTML = `<option value="">Select an account…</option>`;

    accounts.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      accountSelect.appendChild(opt);
    });

    updateSubmitEnabled();
  } catch (e) {
    console.warn("Failed to load account list:", e);
    updateSubmitEnabled();
  }
}

/* ---------- init ---------- */
async function init() {
  // Load accounts from text file
  await loadAccounts();

  // Ensure initial submit state is correct
  updateSubmitEnabled();
}

// Create the drop-zones immediately; they don't depend on seasons
DROPZONE_IDENTIFIERS.forEach((dz) => createDropzone(dz));

// Kick off the UI once the DOM is ready
window.addEventListener("DOMContentLoaded", init);