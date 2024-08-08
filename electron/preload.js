import { contextBridge, ipcRenderer } from 'electron'
import packageJson from '../package.json'

// Custom APIs for renderer
const api = {
  reloadWindow: () => ipcRenderer.send('reload-window'),
  selectFile: (type, filePath) => ipcRenderer.invoke('open-file-dialog', type, filePath),
  showFileInFolder: (filePath) => ipcRenderer.send('show-file-in-folder', filePath),
  getVersion: () => packageJson.version,
  isPackaged: () => `${process.execPath}`.includes('electron.exe') === false,
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.api = api
}
