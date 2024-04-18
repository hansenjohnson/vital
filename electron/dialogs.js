import { ipcMain, dialog } from 'electron'

ipcMain.handle('open-file-dialog', async (event, type) => {
  let properties = []
  if (type === 'folder') {
    properties = ['openDirectory']
  } else {
    properties = ['openFile']
  }

  let filters = []
  if (type === 'excel') {
    filters = [{ name: 'Excel', extensions: ['xlsx', 'xls', 'csv'] }]
  }

  const { canceled, filePaths } = await dialog.showOpenDialog({ properties, filters })
  if (!canceled) {
    return filePaths[0]
  }
  return ''
})
