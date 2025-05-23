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

  // --- build one upload per file ---
  const filesToUpload = [];
  if (soFile)            filesToUpload.push({ identifier: 'SOFile',        file: soFile });
  if (devCatalogFile)    filesToUpload.push({ identifier: 'DevCatOther',   file: devCatalogFile });
  if (amazonCatalogFile) filesToUpload.push({ identifier: 'DevCatAmazon',  file: amazonCatalogFile });

  if (!filesToUpload.length){
    showResult('Please upload at least one file.');
    resetBtn();
    return;
  }

  const userHandle = userHandleInput.value.trim();

  try {
    const results = await Promise.all(
      filesToUpload.map(async ({ identifier, file }) => {
        const fd = new FormData();
        fd.append('account',   account);
        fd.append('season',    season);
        fd.append('accountSO', accountSO);
        fd.append('dropzoneIdentifier', identifier);
        fd.append('file', file); // binary payload

        if (userHandle){
          fd.append('userEmail', `${userHandle}@farylrobin.com`);
        }

        const res = await fetchWithTimeout(
          'https://farylrobin.app.n8n.cloud/webhook/c211c489-2386-4e77-b01d-1aab679365ab',
          { method: 'POST', body: fd }
        );

        if (res.ok){
          return `✅ ${file.name}`;
        } else {
          const txt = await res.text();
          return `❌ ${file.name}: ${res.status} ${res.statusText} – ${txt}`;
        }
      })
    );

    showResult(`Uploads finished:\n${results.join('\n')}`);
  } catch (err){
    console.error(err);
    showResult(`Failed To Send: ${err}`);
  } finally {
    resetBtn();
  }
});
