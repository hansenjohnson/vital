import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'

import FILE_TYPES from '../constants/fileTypes'
import SETTING_KEYS from '../constants/settingKeys'
import { TITLEBAR_HEIGHT } from '../constants/dimensions'
import FilePathSettingInput from '../components/FilePathSettingInput'
import settingsAPI from '../api/settings'

const SettingsContainer = ({ open, handleClose, settingsInitialized, settings, setOneSetting }) => {
  const handleChangeFor = (settingName) => (event) => setOneSetting(settingName, event.target.value)

  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async () => {
    setSubmitting(true)
    const successful = await settingsAPI.save(settings)
    if (successful && settingsInitialized) {
      return window.api.reloadWindow()
    } else if (successful) {
      handleClose()
      setSubmitting(false)
    } else {
      setSubmitting(false)
      alert('Failed to save settings. Please adjust them and try again.')
    }
  }

  const _handleClose = (event, reason) => {
    if (!settingsInitialized && reason === 'backdropClick') return
    handleClose()
  }

  return (
    <Dialog
      open={open}
      onClose={_handleClose}
      fullWidth
      maxWidth="md"
      disablePortal
      disableEscapeKeyDown={!settingsInitialized}
      sx={{
        position: 'aboslute',
        top: `${TITLEBAR_HEIGHT}px`,
      }}
      slotProps={{
        backdrop: {
          sx: { top: `${TITLEBAR_HEIGHT}px` },
        },
      }}
    >
      <DialogTitle>Settings</DialogTitle>

      {settingsInitialized && (
        <IconButton
          onClick={handleClose}
          size="small"
          sx={(theme) => ({
            position: 'absolute',
            right: theme.spacing(1),
            top: theme.spacing(1),
          })}
        >
          <CloseIcon sx={{ fontSize: '30px' }} />
        </IconButton>
      )}

      <DialogContent>
        {!settingsInitialized && (
          <Alert severity="warning" sx={{ marginBottom: 1 }}>
            You must initially populate these settings in order to use the Application.
          </Alert>
        )}

        <FilePathSettingInput
          label="Catalog Folder - Data File"
          value={settings[SETTING_KEYS.CATALOG_FOLDER_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.CATALOG_FOLDER_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.EXCEL)
            if (!filePath) return
            setOneSetting(SETTING_KEYS.CATALOG_FOLDER_FILE_PATH, filePath)
          }}
        />

        <FilePathSettingInput
          label="Catalog Video - Data File"
          value={settings[SETTING_KEYS.CATALOG_VIDEO_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.CATALOG_VIDEO_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.EXCEL)
            if (!filePath) return
            setOneSetting(SETTING_KEYS.CATALOG_VIDEO_FILE_PATH, filePath)
          }}
        />

        <FilePathSettingInput
          label="Linkage - Data File"
          value={settings[SETTING_KEYS.LINKAGE_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.LINKAGE_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.EXCEL)
            if (!filePath) return
            setOneSetting(SETTING_KEYS.LINKAGE_FILE_PATH, filePath)
          }}
        />

        <FilePathSettingInput
          label="Sightings - Data File"
          value={settings[SETTING_KEYS.SIGHTING_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.SIGHTING_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.EXCEL)
            if (!filePath) return
            setOneSetting(SETTING_KEYS.SIGHTING_FILE_PATH, filePath)
          }}
        />

        <Box mb={1} />

        <FilePathSettingInput
          label="Base Folder of Videos"
          value={settings[SETTING_KEYS.BASE_FOLDER_OF_VIDEOS]}
          onChange={handleChangeFor(SETTING_KEYS.BASE_FOLDER_OF_VIDEOS)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.FOLDER)
            if (!filePath) return
            setOneSetting(SETTING_KEYS.BASE_FOLDER_OF_VIDEOS, filePath)
          }}
        />
        <FilePathSettingInput
          label="Thumbnails Folder"
          value={settings[SETTING_KEYS.THUMBNAIL_DIR_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.THUMBNAIL_DIR_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(FILE_TYPES.FOLDER)
            if (!filePath) return
            setOneSetting(SETTING_KEYS.THUMBNAIL_DIR_PATH, filePath)
          }}
        />
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleSubmit}
          disabled={!Object.values(settings).every((setting) => !!setting) || submitting}
          startIcon={
            submitting && <CircularProgress color="inherit" size={16} sx={{ marginRight: 1 }} />
          }
          sx={{ paddingLeft: 1.5, paddingRight: 1.5 }}
        >
          {settingsInitialized ? 'Save & Reload' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsContainer
