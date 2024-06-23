import { ipcMain, dialog } from 'electron'

ipcMain.handle('open-file-dialog', async (event, type, location = null) => {
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

  console.log('location', location)

  const { canceled, filePaths } = await dialog.showOpenDialog({ properties, filters, defaultPath: location })
  if (!canceled) {
    return filePaths[0]
  }
  return ''
})
