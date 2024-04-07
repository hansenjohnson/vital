/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

document.getElementById('readExcelBtn').addEventListener('click', () => {
  window.api.selectFile();
});

window.api.onFileSelected((path, sheet_name) => {
  console.log(path, sheet_name)
  saveFilePath(path, sheet_name)
  loadFile()
  document.getElementById('file_path').innerText = path
});


saveFilePath = (file_path, sheet_name) => {
  const data = {
    file_path: file_path,
    sheet_name: sheet_name
  }
  payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  fetch('http://localhost:5000/settings/association-file', payload)
  .then(response => response.text())
  .then(data => {
    document.getElementById('excel_data').innerText = JSON.stringify(data, undefined, 2);
  });
}

loadFile = () =>{
  fetch('http://localhost:5000/association/')
  .then(response => response.json())
  .then(data => {
    document.getElementById('excel_data').innerText = JSON.stringify(data, undefined, 2);
  });
}

loadFile()