// Log to confirm script is executing
console.log("Main.js loaded");
const APP_VERSION = "1.1.0";
console.log(`Main.js version: ${APP_VERSION}`);
/* ------------ CONFIG ------------ */
const DROPZONE_IDENTIFIERS = [
  "Target Sales RAW",
  "VA Buy Plan",
  "Target Sales Plan"
];
const N8N_WEBHOOK_URL =
  "https://farylrobin.app.n8n.cloud/webhook/93dae95b-c2ce-4b19-94a2-603469c84cb4";
const SEASON_JSON_URL = "./assets/SeasonDropdownList.json";
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

/* ------------ Season Controls ---------- */
// Container for all season‑related UI
const seasonControls = document.createElement("div");
seasonControls.id = "seasonControls";
seasonControls.className = "season-controls";

// Dropdown to choose whether we’re using an existing season or adding a new one
const seasonModeSelect = document.createElement("select");
seasonModeSelect.id = "seasonModeSelect";
["existing", "new"].forEach((val) => {
  const opt = document.createElement("option");
  opt.value = val;
  opt.textContent = val === "existing" ? "Existing" : "Add New Season";
  seasonModeSelect.appendChild(opt);
});

const modeLabel = document.createElement("label");
modeLabel.textContent = "Season Mode: ";
modeLabel.appendChild(seasonModeSelect);
seasonControls.appendChild(modeLabel);

// Dropdown for selecting an existing season (populated from JSON)
const seasonSelectLabel = document.createElement("label");
seasonSelectLabel.textContent = "Season: ";
// seasonSelectLabel.style.display = "none";

const seasonSelect = document.createElement("select");
seasonSelect.id = "seasonSelect";
seasonSelectLabel.appendChild(seasonSelect);
seasonControls.appendChild(seasonSelectLabel);

// UI for adding a brand‑new season
const newSeasonContainer = document.createElement("div");
newSeasonContainer.style.display = "none";

const newSeasonInput = document.createElement("input");
newSeasonInput.type = "text";
newSeasonInput.placeholder = "Enter new season";

const addSeasonBtn = document.createElement("button");
addSeasonBtn.type = "button";
addSeasonBtn.textContent = "Add to Season List";

newSeasonContainer.appendChild(newSeasonInput);
newSeasonContainer.appendChild(addSeasonBtn);
seasonControls.appendChild(newSeasonContainer);

// Mount seasonControls only after the DOM is ready *and* dropzoneGrid exists
function mountSeasonControls() {
  const liveGrid = document.getElementById("dropzoneGrid");
  if (liveGrid && liveGrid.parentNode) {
    console.log("✅ Inserting seasonControls before dropzoneGrid");
    liveGrid.parentNode.insertBefore(seasonControls, liveGrid);
  } else {
    console.warn("⚠️ dropzoneGrid not found yet, retrying in 100 ms…");
    setTimeout(mountSeasonControls, 100); // try again shortly
  }
}
/* --------------------------------------- */

let filesByDropzone = {};
let seasonsList = [];

/* ------ Season helpers ------ */
async function loadSeasons() {
  try {
    const res = await fetch(SEASON_JSON_URL);
    console.log("Fetched season list:", res);
    const data = await res.json();
    seasonsList = data.seasons || [];
    populateSeasonDropdown();
    // Ensure correct toggle state after seasons load
    seasonModeSelect.dispatchEvent(new Event("change"));
    console.log("Season list loaded:", seasonsList);
  } catch (err) {
    console.error("Failed to load season list", err);
  }
}

function populateSeasonDropdown() {
  seasonSelect.innerHTML = "";
  seasonsList.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    seasonSelect.appendChild(opt);
  });
}
/* ---------------------------- */

// Toggle UI between Existing and Add New Season modes
seasonModeSelect.addEventListener("change", () => {
  const isExisting = seasonModeSelect.value === "existing";
  seasonSelectLabel.style.display = isExisting ? "" : "none";
  newSeasonContainer.style.display = isExisting ? "none" : "";
});

// Handle adding a new season
addSeasonBtn.addEventListener("click", () => {
  const name = newSeasonInput.value.trim();
  if (!name) {
    alert("Please enter a season name first.");
    return;
  }
  const maxId = Math.max(0, ...seasonsList.map((s) => s.id));
  const newSeason = { id: maxId + 1, name };
  seasonsList.push(newSeason);
  populateSeasonDropdown();

  // Reset UI
  seasonModeSelect.value = "existing";
  seasonModeSelect.dispatchEvent(new Event("change"));
  newSeasonInput.value = "";

  // Notify backend so it can update SeasonDropdownList.json
  fetch(N8N_WEBHOOK_URL + "?action=addSeason", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSeason)
  }).catch(console.error);
});

/* --- create a single drop‑zone --- */
function createDropzone(identifier) {
  const container = document.createElement("div");
  container.className = "file-upload-container";

  const title = document.createElement("h3");
  title.className = "dropzone-title";
  title.textContent = identifier;

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

  filesByDropzone[identifier] = [];

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
    handleFiles(identifier, e.dataTransfer.files, fileList);
  });

  input.addEventListener("change", () =>
    handleFiles(identifier, input.files, fileList)
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
      formData.append('dropzoneIdentifier', identifier);
      fileMetadata.push({
        formDataKey: key,
        originalName: file.name,
        size: file.size,
        type: file.type,
        dropzoneIdentifier: identifier,
        index: idx
      });
    });
  });
  formData.append("metadata", JSON.stringify(fileMetadata));
  // Attach chosen season
  const chosenSeason =
    seasonModeSelect.value === "existing"
      ? seasonSelect.value
      : newSeasonInput.value.trim();
  formData.append("season", chosenSeason);

  try {
    await fetch(N8N_WEBHOOK_URL, { method: "POST", body: formData });

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
    DROPZONE_IDENTIFIERS.forEach(createDropzone);
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
  // Ensure the season list is fetched before rendering any controls
  await loadSeasons();
  mountSeasonControls();
}

// Create the drop‑zones immediately; they don't depend on seasons
DROPZONE_IDENTIFIERS.forEach(createDropzone);

// Kick off the season-aware UI once the DOM is ready
window.addEventListener("DOMContentLoaded", init);