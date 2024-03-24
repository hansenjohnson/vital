/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
document.getElementById('helloButton').addEventListener('click', () => {
  console.log('Hello button clicked');
  fetch('http://localhost:5000')
    .then(response => response.json())
    .then(data => alert(data.message));
});