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
import { Skeleton } from '@mui/material'

const VISIBLE_SETTINGS = [
  SETTING_KEYS.ASSOCIATION_FILE_PATH,
  SETTING_KEYS.ASSOCIATION_SHEET_NAME,
  SETTING_KEYS.SIGHTING_FILE_PATH,
  SETTING_KEYS.SIGHTING_SHEET_NAME,
]

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
    } else {
      alert('Failed to save settings. Please adjust them and try again.')
    }
  }

  // Load existing settings on mount
  const [initialLoading, setInitialLoading] = useState(true)
  useEffect(() => {
    settingsAPI.getList(Object.values(VISIBLE_SETTINGS)).then((settingsList) => {
      settingsList.forEach((settingData) => {
        const [key, value] = Object.entries(settingData)[0]
        if (value != null) {
          setOneSetting(key, value)
        }
      })
      setInitialLoading(false)
    })
  }, [])

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ marginBottom: 1 }}>
          You must populate these settings in order to use the Application.
        </Alert>

        {initialLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Skeleton variant="rounded" animation="wave" height={40} />
            <Skeleton variant="rounded" animation="wave" height={40} />
            <Box mb={1} />
            <Skeleton variant="rounded" animation="wave" height={40} />
            <Skeleton variant="rounded" animation="wave" height={40} />
          </Box>
        ) : (
          <>
            <FilePathSettingInput
              label="Associations File"
              value={settings[SETTING_KEYS.ASSOCIATION_FILE_PATH]}
              onChange={handleChangeFor(SETTING_KEYS.ASSOCIATION_FILE_PATH)}
              onFolderClick={async () => {
                const filePath = await window.api.selectFile(FILE_TYPES.EXCEL)
                if (!filePath) return
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
                if (!filePath) return
                setOneSetting(SETTING_KEYS.SIGHTING_FILE_PATH, filePath)
              }}
            />
            <SettingInput
              label="Sightings Sheet Name"
              value={settings[SETTING_KEYS.SIGHTING_SHEET_NAME]}
              onChange={handleChangeFor(SETTING_KEYS.SIGHTING_SHEET_NAME)}
            />
          </>
        )}
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
