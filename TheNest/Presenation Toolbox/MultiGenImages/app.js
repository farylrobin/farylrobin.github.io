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
  }
  thumb.dataset.label=file.name;
  const reader=new FileReader();
  reader.readAsDataURL(file);
  reader.onload=()=>thumb.style.backgroundImage=`url('${reader.result}')`;
}

// -------- dynamic rows --------
const tableBody=document.querySelector('#promptTable tbody');
const addRowBtn=document.getElementById('addRowBtn');

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
}
function reindex(){
  document.querySelectorAll('.rowIdx').forEach((td,i)=>td.textContent=i+1);
}

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
document.getElementById('promptForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const rows=document.querySelectorAll('#promptTable tbody tr');
  const fd=new FormData();
  rows.forEach((tr,i)=>{
    const img1=tr.querySelector('input[name="img1"]').files[0];
    const img2=tr.querySelector('input[name="img2"]').files[0];
    const weight=tr.querySelector('input[name="weight"]').value||'0.5';
    const prompt=tr.querySelector('textarea[name="prompt"]').value;
    const multigen=tr.querySelector('input[name="multigen"]').checked;
    if(img1) fd.append(`rows[${i}][img1]`,img1);
    if(img2) fd.append(`rows[${i}][img2]`,img2);
    fd.append(`rows[${i}][weight]`,weight);
    fd.append(`rows[${i}][prompt]`,prompt);
    fd.append(`rows[${i}][multigen]`,multigen);
  });

  try{
    const res=await fetch('https://n8n.example.com/webhook/multi-image',{method:'POST',body:fd});
    const data=await res.json();
    document.getElementById('result').textContent=JSON.stringify(data,null,2);
  }catch(err){
    document.getElementById('result').textContent='Error: '+err;
  }
});
