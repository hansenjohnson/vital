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

window.api.onFileSelected((path) => {
  loadFile(path)
  document.getElementById('file_path').innerText = path
});

function loadFile(path) {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_path: path})
  };
  fetch('http://localhost:5000/excel/read_excel', requestOptions)
  .then(response => response.text())
  .then(data => {
    console.log(data);
    document.getElementById('excel_data').innerText = JSON.stringify(data, undefined, 2);
  });
}