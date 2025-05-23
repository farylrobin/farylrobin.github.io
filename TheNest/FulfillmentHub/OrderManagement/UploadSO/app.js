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
