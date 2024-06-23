import { ipcMain, dialog } from 'electron'

ipcMain.handle('open-file-dialog', async (event, type, filePath) => {
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

  const options = { properties, filters }
  if (filePath !== null) {
    options.defaultPath = filePath
  }

  const { canceled, filePaths } = await dialog.showOpenDialog(options)
  if (!canceled) {
    return filePaths[0]
  }
  return ''
})
