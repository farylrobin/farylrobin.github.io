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
    if(el.name==='weight') el.value='0.5';
  });
  clone.querySelectorAll('.drop-zone').forEach(dz=>{
    dz.innerHTML='<span class="drop-zone__prompt">Drop file or click</span><input type="file" accept="image/*" class="drop-zone__input">';
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

// -------- submit --------
document.getElementById('promptForm').addEventListener('submit', async e => {
  e.preventDefault();
  submitBtn.classList.add('submitting');
  submitBtn.disabled = true;
  const rows = document.querySelectorAll('#promptTable tbody tr');
  const fd = new FormData();
  rows.forEach((tr, i) => {
    const img1 = tr.querySelector('input[name="img1"]').files[0];
    const img2 = tr.querySelector('input[name="img2"]').files[0];
    const weight = tr.querySelector('input[name="weight"]').value || '0.5';
    const prompt = tr.querySelector('textarea[name="prompt"]').value;
    if (!img1 && !img2 && !prompt.trim()) return; // skip blank rows
    if (img1) fd.append(`rows[${i}][img1]`, img1);
    if (img2) fd.append(`rows[${i}][img2]`, img2);
    fd.append(`rows[${i}][weight]`, weight);
    fd.append(`rows[${i}][prompt]`, prompt);
  });

  console.log('Submitting rows:', [...fd.entries()]);

  try {
    const res = await fetch('https://farylrobin.app.n8n.cloud/webhook/eef6e5ec-5eee-4e6c-96d5-88155999ee98', {
      method: 'POST',
      body: fd
    });
    if (res.ok) {
      const timestamp = new Date().toLocaleString();
      document.getElementById('result').textContent = `Workflow has started [${timestamp}]`;
    } else {
      const errorText = await res.text();
      document.getElementById('result').textContent = `Failed To Send: ${res.status} ${res.statusText} - ${errorText}`;
    }
  } catch (err) {
    document.getElementById('result').textContent = `Failed To Send: ${err}`;
    // keep button disabled until user edits the table
  }
});
