// v1.5 - Enter moves to next row (or creates one); Shift+Enter inserts newline. Single image input & prompt per row.
// -------- clear-image handler --------
document.body.addEventListener('click', e => {
  if (e.target.classList.contains('clear-image')) {
    const dz = e.target.closest('.drop-zone');
    const input = dz.querySelector('.drop-zone__input');
    input.value = '';
    const thumb = dz.querySelector('.drop-zone__thumb');
    if (thumb) thumb.remove();
    e.target.remove();
    const promptEl = document.createElement('span');
    promptEl.className = 'drop-zone__prompt';
    promptEl.textContent = 'Drop file or click';
    dz.appendChild(promptEl);
    resetSubmitBtn();
  }
});

// -------- fetch with timeout helper --------
async function fetchWithTimeout(resource, options = {}, timeout = 30000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(resource, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}


// -------- drop‑zone helpers --------
document.querySelectorAll('.drop-zone__input').forEach(inputElement=>{
  const dz=inputElement.closest('.drop-zone');
  dz.onclick=()=>inputElement.click();

  inputElement.addEventListener('change',()=>{
    if(inputElement.files.length){
      updateThumbnail(dz,inputElement.files[0]);
    }
  });

  dz.addEventListener('dragover',e=>{
    e.preventDefault();
    dz.classList.add('drop-zone--over');
  });

  ['dragleave','dragend'].forEach(type=>{
    dz.addEventListener(type,()=>dz.classList.remove('drop-zone--over'));
  });

  dz.addEventListener('drop',e=>{
    e.preventDefault();
    if(e.dataTransfer.files.length){
      inputElement.files=e.dataTransfer.files;
      updateThumbnail(dz,e.dataTransfer.files[0]);
    }
    dz.classList.remove('drop-zone--over');
  });
});

function updateThumbnail(dz,file){
  let thumb=dz.querySelector('.drop-zone__thumb');
  if(!thumb){
    thumb=document.createElement('div');
    thumb.className='drop-zone__thumb';
    dz.appendChild(thumb);
    dz.querySelector('.drop-zone__prompt').remove();

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'clear-image';
    clearBtn.textContent = '×';
    dz.appendChild(clearBtn);
  }
  thumb.dataset.label=file.name;
  const reader=new FileReader();
  reader.readAsDataURL(file);
  reader.onload=()=>thumb.style.backgroundImage=`url('${reader.result}')`;
}

// -------- dynamic rows --------
const tableBody=document.querySelector('#promptTable tbody');
const addRowBtn=document.getElementById('addRowBtn');
const submitBtn = document.getElementById('submitBtn');
const userHandleInput = document.getElementById('userHandle');
if (userHandleInput) {
  userHandleInput.addEventListener('input', resetSubmitBtn);
}
function resetSubmitBtn() {
  submitBtn.classList.remove('submitting');
  submitBtn.disabled = false;
}

addRowBtn.onclick=()=>addRow();

tableBody.addEventListener('click',e=>{
  if(e.target.classList.contains('removeBtn')){
    e.target.closest('tr').remove();
    reindex();
  }
});

function addRow(){
  const tpl=document.querySelector('.promptRow');
  const clone=tpl.cloneNode(true);
  clone.querySelectorAll('input,textarea').forEach(el=>{
    if(el.type!=='checkbox') el.value='';
    if(el.type==='file') el.value='';
  });
  clone.querySelectorAll('.drop-zone').forEach((dz) => {
    dz.innerHTML =
      '<span class="drop-zone__prompt">Drop file or click</span>' +
      `<input type="file" name="img1" accept="image/*" class="drop-zone__input">`;
  });
  tableBody.appendChild(clone);
  initDropZones(clone);
  reindex();
  // Clear previous status when a new row is added
  document.getElementById('result').textContent = '';
  resetSubmitBtn();
}
function reindex(){
  document.querySelectorAll('.rowIdx').forEach((td,i)=>td.textContent=i+1);
}
// Reset button when any field changes
document.getElementById('promptTable').addEventListener('input', resetSubmitBtn);
document.getElementById('promptTable').addEventListener('change', resetSubmitBtn);

function initDropZones(scope){
  scope.querySelectorAll('.drop-zone__input').forEach(inputElement=>{
    const dz=inputElement.closest('.drop-zone');
    dz.onclick=()=>inputElement.click();
    inputElement.addEventListener('change',()=>{
      if(inputElement.files.length){
        updateThumbnail(dz,inputElement.files[0]);
      }
    });
    dz.addEventListener('dragover',e=>{
      e.preventDefault();dz.classList.add('drop-zone--over');
    });
    ['dragleave','dragend'].forEach(t=>dz.addEventListener(t,()=>dz.classList.remove('drop-zone--over')));
    dz.addEventListener('drop',e=>{
      e.preventDefault();
      if(e.dataTransfer.files.length){
        inputElement.files=e.dataTransfer.files;updateThumbnail(dz,e.dataTransfer.files[0]);
      }
      dz.classList.remove('drop-zone--over');
    });
  });
}

// -------- prompt textarea navigation (Enter vs Shift+Enter) --------
document.addEventListener('keydown', function (e) {
  // Only act on prompt textareas
  if (e.target.matches('textarea[name="prompt"]')) {
    const isEnter   = (e.key === 'Enter' || e.keyCode === 13);
    const isShift   = e.shiftKey;
    if (isEnter && !isShift) {
      // Plain Enter -> move to next prompt
      e.preventDefault();
      e.stopPropagation();

      const currentRow = e.target.closest('tr');
      let nextRow = currentRow.nextElementSibling;
      // If there isn't a next row, create one
      if (!nextRow) {
        addRow();
        nextRow = tableBody.lastElementChild;
      }
      const nextPrompt = nextRow.querySelector('textarea[name="prompt"]');
      if (nextPrompt) {
        nextPrompt.focus();
      }
    }
    // Shift+Enter => do nothing, native newline
  }
});

// -------- submit --------
document.getElementById('promptForm').addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.classList.add('submitting');
  submitBtn.disabled = true;
  const rows = document.querySelectorAll('#promptTable tbody tr');
  const fd = new FormData();
  const userHandle = userHandleInput ? userHandleInput.value.trim() : '';
  if (userHandle) {
    fd.append('userEmail', `${userHandle}@farylrobin.com`);
  }
  let appendedRows = 0;
  rows.forEach((tr, i) => {
    const img1Input = tr.querySelector('input[name="img1"]');
    const img1 = img1Input && img1Input.files[0];
    const prompt = tr.querySelector('textarea[name="prompt"]').value;
    if (!img1 && !prompt.trim()) return; // skip blank rows
    appendedRows++;
    if (img1) fd.append(`rows[${i}][img1]`, img1);
    fd.append(`rows[${i}][prompt]`, prompt);
  });
  if (appendedRows === 0) {
    document.getElementById('result').textContent = 'No data to send';
    resetSubmitBtn();
    return;
  }
  // Guard: if FormData is empty, nothing to send
  if (!fd.has('rows[0][img1]') && !fd.has('rows[0][prompt]')) {
    resetSubmitBtn();
    return;
  }

  console.log('Submitting rows:', [...fd.entries()]);

  try {
    const res = await fetchWithTimeout('https://farylrobin.app.n8n.cloud/webhook/eef6e5ec-5eee-4e6c-96d5-88155999ee98', {
      method: 'POST',
      body: fd
    });
    if (res.ok) {
      const timestamp = new Date().toLocaleString();
      document.getElementById('result').textContent = `Workflow has started [${timestamp}]`;
    } else {
      const errorText = await res.text();
      document.getElementById('result').textContent = `Failed To Send: ${res.status} ${res.statusText} - ${errorText}`;
      console.error('Error response:', errorText);
    }
  } catch (err) {
    document.getElementById('result').textContent = `Failed To Send: ${err}`;
    console.error('Fetch error:', err);
    resetSubmitBtn();
    // keep button disabled until user edits the table
  }
});
