import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import FILE_TYPES from '../constants/fileTypes'
import SettingInput from '../components/SettingInput'
import FilePathSettingInput from '../components/FilePathSettingInput'

const SettingsContainer = ({ open, handleClose }) => {
  const [settings, setSettings] = useState({
    associationsFile: '',
    associationsSheet: '',
    sightingsFile: '',
    sightingsSheet: '',
    thumbnailsFolder: '',
    stillsFolder: '',
  })
  const setOneSetting = (key, value) => setSettings({ ...settings, [key]: value })
  const handleChangeFor = (settingName) => (event) => setOneSetting(settingName, event.target.value)

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ marginBottom: 1 }}>
          You must fill out these settings in order to use the Application.
        </Alert>

        <FilePathSettingInput
          label="Associations File"
          value={settings.associationsFile}
          onChange={handleChangeFor('associationsFile')}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.EXCEL)
            setOneSetting('associationsFile', filePath)
          }}
        />
        <SettingInput
          label="Associations Sheet Name"
          value={settings.associationsSheet}
          onChange={handleChangeFor('associationsSheet')}
        />

        <Box mb={1} />

        <FilePathSettingInput
          label="Sightings Data File"
          value={settings.sightingsFile}
          onChange={handleChangeFor('sightingsFile')}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.EXCEL)
            setOneSetting('sightingsFile', filePath)
          }}
        />
        <SettingInput
          label="Sightings Sheet Name"
          value={settings.sightingsSheet}
          onChange={handleChangeFor('sightingsSheet')}
        />

        <Box mb={1} />

        <FilePathSettingInput
          label="Internal Thumbnails Folder"
          value={settings.thumbnailsFolder}
          onChange={handleChangeFor('thumbnailsFolder')}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.FOLDER)
            setOneSetting('thumbnailsFolder', filePath)
          }}
        />

        <FilePathSettingInput
          label="Exported Still Frames Folder"
          value={settings.stillsFolder}
          onChange={handleChangeFor('stillsFolder')}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.FOLDER)
            setOneSetting('stillsFolder', filePath)
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsContainer
