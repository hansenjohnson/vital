/**
 * The preload script runs before `index.html` is loaded
 * in the renderer. It has access to web APIs as well as
 * Electron's renderer process modules and some polyfilled
 * Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'api', {
    selectFile: () => ipcRenderer.send('open-file-dialog'),
    onFileSelected: (callback) => {
      ipcRenderer.on('selected-file', (event, path) => callback(path));
    }
  }
);