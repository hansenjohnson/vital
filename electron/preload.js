import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  reloadWindow: () => ipcRenderer.send('reload-window'),
  selectFile: (type) => ipcRenderer.invoke('open-file-dialog', type),
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
