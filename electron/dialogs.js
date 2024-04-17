import { ipcMain, dialog } from 'electron'

ipcMain.on('open-file-dialog', (event) => {
  dialog
    .showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Excel', extensions: ['xlsx', 'xls', 'csv'] }],
    })
    .then((file) => {
      if (!file.canceled) {
        // worksheet will need to input from the client
        event.reply('selected-file', file.filePaths[0])
      }
    })
})
