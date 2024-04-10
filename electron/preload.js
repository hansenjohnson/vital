import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  selectFile: () => ipcRenderer.send('open-file-dialog')
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
