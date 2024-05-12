import { ipcMain } from 'electron'

ipcMain.on('reload-window', (event) => {
  const webContents = event.sender
  webContents.reload()
})
