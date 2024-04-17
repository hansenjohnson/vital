import { useState, useEffect } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import FILE_TYPES from '../constants/fileTypes'
import SETTING_KEYS from '../constants/settingKeys'
import SettingInput from '../components/SettingInput'
import FilePathSettingInput from '../components/FilePathSettingInput'
import settingsAPI from '../api/settings'

const SettingsContainer = ({ open, handleClose }) => {
  const [settings, setSettings] = useState({
    [SETTING_KEYS.ASSOCIATION_FILE_PATH]: '',
    [SETTING_KEYS.ASSOCIATION_SHEET_NAME]: '',
    [SETTING_KEYS.SIGHTING_FILE_PATH]: '',
    [SETTING_KEYS.SIGHTING_SHEET_NAME]: '',
    // [SETTING_KEYS.THUMBNAIL_DIR_PATH]: '',
    // [SETTING_KEYS.STILLFRAME_DIR_NAME]: '',
  })

  const setOneSetting = (key, value) => {
    setSettings((existingSettings) => ({ ...existingSettings, [key]: value }))
  }
  const handleChangeFor = (settingName) => (event) => setOneSetting(settingName, event.target.value)

  const handleSubmit = async () => {
    const successful = await settingsAPI.save(settings)
    if (successful) {
      handleClose()
    }
  }

  // Load existing settings on mount
  useEffect(() => {
    settingsAPI.getList(Object.values(SETTING_KEYS)).then((settingsList) => {
      settingsList.forEach((settingData) => {
        const [key, value] = Object.entries(settingData)[0]
        if (value != null) {
          setOneSetting(key, value)
        }
      })
    })
  }, [])

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ marginBottom: 1 }}>
          You must populate these settings in order to use the Application.
        </Alert>

        <FilePathSettingInput
          label="Associations File"
          value={settings[SETTING_KEYS.ASSOCIATION_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.ASSOCIATION_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.EXCEL)
            setOneSetting(SETTING_KEYS.ASSOCIATION_FILE_PATH, filePath)
          }}
        />
        <SettingInput
          label="Associations Sheet Name"
          value={settings[SETTING_KEYS.ASSOCIATION_SHEET_NAME]}
          onChange={handleChangeFor(SETTING_KEYS.ASSOCIATION_SHEET_NAME)}
        />

        <Box mb={1} />

        <FilePathSettingInput
          label="Sightings Data File"
          value={settings[SETTING_KEYS.SIGHTING_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.SIGHTING_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.EXCEL)
            setOneSetting(SETTING_KEYS.SIGHTING_FILE_PATH, filePath)
          }}
        />
        <SettingInput
          label="Sightings Sheet Name"
          value={settings[SETTING_KEYS.SIGHTING_SHEET_NAME]}
          onChange={handleChangeFor(SETTING_KEYS.SIGHTING_SHEET_NAME)}
        />

        {/* TODO: include these in a future release */}
        {/* <Box mb={1} /> */}

        {/* <FilePathSettingInput
          label="Internal Thumbnails Folder"
          value={settings[SETTING_KEYS.THUMBNAIL_DIR_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.THUMBNAIL_DIR_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.FOLDER)
            setOneSetting(SETTING_KEYS.THUMBNAIL_DIR_PATH, filePath)
          }}
        /> */}

        {/* <FilePathSettingInput
          label="Exported Still Frames Folder"
          value={settings[SETTING_KEYS.STILLFRAME_DIR_NAME]}
          onChange={handleChangeFor(SETTING_KEYS.STILLFRAME_DIR_NAME)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.FOLDER)
            setOneSetting(SETTING_KEYS.STILLFRAME_DIR_NAME, filePath)
          }}
        /> */}
      </DialogContent>

      <DialogActions>
        <Button
          disabled={!Object.values(settings).every((setting) => !!setting)}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsContainer
