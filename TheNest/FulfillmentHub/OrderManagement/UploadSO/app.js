// v2.2 – Account / Season / SO uploader  (single-request, JSON array per file)

/* ---------- helper: fetch with timeout ---------- */
async function fetchWithTimeout(resource, options = {}, timeout = 30000){
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try{
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  }catch(err){
    clearTimeout(id);
    throw err;
  }
}

/* ---------- element references ---------- */
const accountSelect   = document.getElementById('accountSelect');
const seasonSelect    = document.getElementById('seasonSelect');
const soSelect        = document.getElementById('soSelect');
const submitBtn       = document.getElementById('submitBtn');
const userHandleInput = document.getElementById('userHandle');
const form            = document.getElementById('soForm');
let   accountsData    = [];

/* ---------- load JSON, populate Account dropdown ---------- */
fetch('assets/AccountSeasonsSO.json')
  .then(r => r.json())
  .then(data => {
    accountsData = data.Accounts || [];
    accountsData.forEach(acc => {
      const opt = document.createElement('option');
      opt.value = acc.Account;
      opt.textContent = acc.Account;
      accountSelect.appendChild(opt);
    });
  })
  .catch(err => console.error('Failed to load AccountSeasonsSO.json', err));

/* ---------- chaining: Account → Season + SO ---------- */
accountSelect.addEventListener('change', () => {
  const accName = accountSelect.value;
  const accObj  = accountsData.find(a => a.Account === accName);

  // reset child dropdowns
  seasonSelect.innerHTML = '<option value="" disabled selected>Select Season…</option>';
  soSelect.innerHTML     = '<option value="" disabled selected>Select Account SO…</option>';
  seasonSelect.disabled  = true;
  soSelect.disabled      = true;

  if (!accObj) return;

  // Seasons
  accObj.Seasons.forEach(season => {
    const opt = document.createElement('option');
    opt.value = season;
    opt.textContent = season;
    seasonSelect.appendChild(opt);
  });
  seasonSelect.disabled = false;

  // Account SOs (flat list)
  accObj.SalesOrders.forEach(so => {
    so.AccountSO.forEach(aso => {
      const opt = document.createElement('option');
      opt.value = aso.AccountSO;
      opt.textContent = aso.AccountSO;
      soSelect.appendChild(opt);
    });
  });
  soSelect.disabled = false;
});

/* ---------- drop-zone helpers (single-file) ---------- */
document.querySelectorAll('.drop-zone__input').forEach(initDropZone);

function initDropZone(inputElement){
  const dz = inputElement.closest('.drop-zone');
  dz.onclick = () => inputElement.click();

  inputElement.addEventListener('change', () => {
    if (inputElement.files.length){
      updateThumbnail(dz, inputElement.files[0]);
    }
  });

  dz.addEventListener('dragover', e => {
    e.preventDefault();
    dz.classList.add('drop-zone--over');
  });
  ['dragleave','dragend'].forEach(type => {
    dz.addEventListener(type, () => dz.classList.remove('drop-zone--over'));
  });
  dz.addEventListener('drop', e => {
    e.preventDefault();
    if (e.dataTransfer.files.length){
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dz, e.dataTransfer.files[0]);
    }
    dz.classList.remove('drop-zone--over');
  });
}

function updateThumbnail(dz, file){
  let thumb = dz.querySelector('.drop-zone__thumb');
  if (!thumb){
    thumb = document.createElement('div');
    thumb.className = 'drop-zone__thumb';
    dz.appendChild(thumb);

    const prompt = dz.querySelector('.drop-zone__prompt');
    if (prompt) prompt.remove();

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'clear-image';
    clearBtn.textContent = '×';
    dz.appendChild(clearBtn);

    clearBtn.addEventListener('click', () => {
      const input = dz.querySelector('.drop-zone__input');
      input.value = '';
      clearBtn.remove();
      thumb.remove();
      const newPrompt = document.createElement('span');
      newPrompt.className = 'drop-zone__prompt';
      newPrompt.textContent = 'Drop file or click';
      dz.appendChild(newPrompt);
    });
  }
  thumb.dataset.label = file.name;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => { thumb.style.backgroundImage = `url('${reader.result}')`; };
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.classList.add('submitting');
  submitBtn.disabled = true;

  const account   = accountSelect.value.trim();
  const season    = seasonSelect.value.trim();
  const accountSO = soSelect.value.trim();

  if (!account || !season || !accountSO){
    showResult('Please select Account, Season and Sales Order.');
    resetBtn();
    return;
  }

  const soFile            = form.querySelector('input[name="soFile"]').files[0];
  const devCatalogFile    = form.querySelector('input[name="devCatalog"]').files[0];
  const amazonCatalogFile = form.querySelector('input[name="amazonDevCatalog"]').files[0];

  // --- single request with JSON array per file ---
  const fileInfo = [];
  const fd = new FormData();

  if (soFile){
    fd.append('soFile', soFile);
    fileInfo.push({ account, season, accountSO, dropzoneIdentifier: 'SOFile' });
  }
  if (devCatalogFile){
    fd.append('devCatalog', devCatalogFile);
    fileInfo.push({ account, season, accountSO, dropzoneIdentifier: 'DevCatOther' });
  }
  if (amazonCatalogFile){
    fd.append('amazonDevCatalog', amazonCatalogFile);
    fileInfo.push({ account, season, accountSO, dropzoneIdentifier: 'DevCatAmazon' });
  }

  if (!fileInfo.length){
    showResult('Please upload at least one file.');
    resetBtn();
    return;
  }

  fd.append('fileInfo', JSON.stringify(fileInfo));

  const userHandle = userHandleInput.value.trim();
  if (userHandle){
    fd.append('userEmail', `${userHandle}@farylrobin.com`);
  }

  try {
    const res = await fetchWithTimeout(
      'https://farylrobin.app.n8n.cloud/webhook/c211c489-2386-4e77-b01d-1aab679365ab',
      { method: 'POST', body: fd }
    );

    if (res.ok){
      showResult(`Workflow started – ${new Date().toLocaleString()}`);
    } else {
      const txt = await res.text();
      showResult(`Failed: ${res.status} ${res.statusText} – ${txt}`);
    }
  } catch(err){
    console.error(err);
    showResult(`Failed: ${err}`);
  } finally {
    resetBtn();
  }
});
