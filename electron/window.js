import { ipcMain, BrowserWindow } from 'electron'

ipcMain.on('set-title', (event, title) => {
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win.setTitle(title)
})
