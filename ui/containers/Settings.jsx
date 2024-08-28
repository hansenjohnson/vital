import { useState, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import useStore from '../store'
import useSettingsStore from '../store/settings'
import FILE_TYPES from '../constants/fileTypes'
import SETTING_KEYS, { SETTING_TYPE_FOR_KEY } from '../constants/settingKeys'
import { TITLEBAR_HEIGHT } from '../constants/dimensions'
import FilePathSettingInput from '../components/FilePathSettingInput'
import settingsAPI from '../api/settings'

const SettingsContainer = () => {
  const [loading, initialized, setInitialized] = useSettingsStore(
    useShallow((state) => [state.loading, state.initialized, state.setInitialized])
  )
  const [open, openDialog, closeDialog] = useSettingsStore(
    useShallow((state) => [state.open, state.openDialog, state.closeDialog])
  )
  const [settings, setOneSetting, loadSettings] = useSettingsStore(
    useShallow((state) => [state.settings, state.setOneSetting, state.loadSettings])
  )

  const [errors, setErrors] = useState({})

  const version = window.api.getVersion()

  // Determine if settings are initialized, open the dialog otherwise
  // as the app is unusable without them
  useEffect(() => {
    if (loading) return
    const areSettingsInitialized = Object.values(settings).every(
      (value) => value !== null && value !== ''
    )

    // This captures the case where they are all initialized on app launch
    // or become initialized on the first closing of the Settings dialog
    if (open === false && areSettingsInitialized) {
      setInitialized(true)
      return
    }

    openDialog()
  }, [loading, open])

  // Once the settings are initialized, perform a followup check for any open files
  // Then proceed to check again every 10 seconds in case the user opens a file later
  const makeAlert = useStore((state) => state.makeAlert)
  const alertDialogOpen = useStore((state) => state.alertDialogOpen)
  const alertDialogProps = useStore((state) => state.alertDialogProps)
  const closeAlert = useStore((state) => state.closeAlert)
  useEffect(() => {
    if (!initialized) return

    const checkThenAlert = async () => {
      const anyOpen = await settingsAPI.checkForOpenFiles()

      // If no files are open, but the alert is open from a previous warning of this type, close it
      if (!anyOpen) {
        if (alertDialogOpen && alertDialogProps?.id === 'open-files-warning') {
          closeAlert()
        }
        return
      }

      makeAlert(
        'It appears that you have some of the data files open (Excel).\nPlease close them before proceeding.',
        'warning',
        'open-files-warning'
      )
    }

    checkThenAlert()
    const intervalId = setInterval(checkThenAlert, 10_000)
    return () => clearInterval(intervalId)
  }, [initialized, alertDialogOpen, alertDialogProps])

  const handleChangeFor = (settingName) => (event) => setOneSetting(settingName, event.target.value)

  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async () => {
    setSubmitting(true)
    setErrors({})

    const settingsKeysBeingSubmitted = Object.keys(settings)
    const responses = await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        settingsAPI.save(key, value, SETTING_TYPE_FOR_KEY[key])
      )
    )
    const successful = responses.every((response) => response.status === 200)

    if (successful && initialized) {
      return window.api.reloadWindow()
    } else if (successful) {
      await loadSettings()
      closeDialog()
      setSubmitting(false)
    } else {
      setSubmitting(false)
      const errorMessages = {}
      responses.forEach((response, index) => {
        if (response.status === 200) return
        const errorOnKey = settingsKeysBeingSubmitted[index]
        errorMessages[errorOnKey] = response.data.message
      })
      setErrors(errorMessages)
    }
  }

  const _handleMuiClose = (event, reason) => {
    if (!initialized && reason === 'backdropClick') return
    closeDialog()
  }

  return (
    <Dialog
      open={open}
      onClose={_handleMuiClose}
      fullWidth
      maxWidth="md"
      disablePortal
      disableEscapeKeyDown={!initialized}
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

      {initialized && (
        <IconButton
          onClick={closeDialog}
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
        {!initialized && (
          <Alert severity="warning" sx={{ marginBottom: 1 }}>
            You must initially populate these settings in order to use the Application.
            <br />
            Please close these Excel files if you have them open.
          </Alert>
        )}

        <FilePathSettingInput
          label="Catalog Folder - Data File"
          value={settings[SETTING_KEYS.CATALOG_FOLDER_FILE_PATH]}
          error={SETTING_KEYS.CATALOG_FOLDER_FILE_PATH in errors}
          errorMessage={errors[SETTING_KEYS.CATALOG_FOLDER_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.CATALOG_FOLDER_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.EXCEL,
              settings[SETTING_KEYS.CATALOG_FOLDER_FILE_PATH]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.CATALOG_FOLDER_FILE_PATH, filePath)
          }}
        />

        <FilePathSettingInput
          label="Catalog Video - Data File"
          value={settings[SETTING_KEYS.CATALOG_VIDEO_FILE_PATH]}
          error={SETTING_KEYS.CATALOG_VIDEO_FILE_PATH in errors}
          errorMessage={errors[SETTING_KEYS.CATALOG_VIDEO_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.CATALOG_VIDEO_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.EXCEL,
              settings[SETTING_KEYS.CATALOG_VIDEO_FILE_PATH]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.CATALOG_VIDEO_FILE_PATH, filePath)
          }}
        />

        <FilePathSettingInput
          label="Linkage - Data File"
          value={settings[SETTING_KEYS.LINKAGE_FILE_PATH]}
          error={SETTING_KEYS.LINKAGE_FILE_PATH in errors}
          errorMessage={errors[SETTING_KEYS.LINKAGE_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.LINKAGE_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.EXCEL,
              settings[SETTING_KEYS.LINKAGE_FILE_PATH]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.LINKAGE_FILE_PATH, filePath)
          }}
        />

        <FilePathSettingInput
          label="Sightings - Data File"
          value={settings[SETTING_KEYS.SIGHTING_FILE_PATH]}
          error={SETTING_KEYS.SIGHTING_FILE_PATH in errors}
          errorMessage={errors[SETTING_KEYS.SIGHTING_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.SIGHTING_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.EXCEL,
              settings[SETTING_KEYS.SIGHTING_FILE_PATH]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.SIGHTING_FILE_PATH, filePath)
          }}
        />

        <FilePathSettingInput
          label="Still Exports - Data File"
          value={settings[SETTING_KEYS.STILL_EXPORT_FILE_PATH]}
          error={SETTING_KEYS.STILL_EXPORT_FILE_PATH in errors}
          errorMessage={errors[SETTING_KEYS.STILL_EXPORT_FILE_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.STILL_EXPORT_FILE_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.EXCEL,
              settings[SETTING_KEYS.STILL_EXPORT_FILE_PATH]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.STILL_EXPORT_FILE_PATH, filePath)
          }}
        />

        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />

        <FilePathSettingInput
          label="Base Folder of Optimized Videos"
          value={settings[SETTING_KEYS.BASE_FOLDER_OF_VIDEOS]}
          error={SETTING_KEYS.BASE_FOLDER_OF_VIDEOS in errors}
          errorMessage={errors[SETTING_KEYS.BASE_FOLDER_OF_VIDEOS]}
          onChange={handleChangeFor(SETTING_KEYS.BASE_FOLDER_OF_VIDEOS)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.FOLDER,
              settings[SETTING_KEYS.BASE_FOLDER_OF_VIDEOS]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.BASE_FOLDER_OF_VIDEOS, filePath)
          }}
        />
        <FilePathSettingInput
          label="Base Folder of Original Videos"
          value={settings[SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_VIDEOS]}
          error={SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_VIDEOS in errors}
          errorMessage={errors[SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_VIDEOS]}
          onChange={handleChangeFor(SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_VIDEOS)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.FOLDER,
              settings[SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_VIDEOS]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_VIDEOS, filePath)
          }}
        />
        <FilePathSettingInput
          label="Base Folder of Optimized Images"
          value={settings[SETTING_KEYS.BASE_FOLDER_OF_OPTIMIZED_IMAGES]}
          error={SETTING_KEYS.BASE_FOLDER_OF_OPTIMIZED_IMAGES in errors}
          errorMessage={errors[SETTING_KEYS.BASE_FOLDER_OF_OPTIMIZED_IMAGES]}
          onChange={handleChangeFor(SETTING_KEYS.BASE_FOLDER_OF_OPTIMIZED_IMAGES)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.FOLDER,
              settings[SETTING_KEYS.BASE_FOLDER_OF_OPTIMIZED_IMAGES]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.BASE_FOLDER_OF_OPTIMIZED_IMAGES, filePath)
          }}
        />
        <FilePathSettingInput
          label="Base Folder of Original Images"
          value={settings[SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_IMAGES]}
          error={SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_IMAGES in errors}
          errorMessage={errors[SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_IMAGES]}
          onChange={handleChangeFor(SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_IMAGES)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.FOLDER,
              settings[SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_IMAGES]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.BASE_FOLDER_OF_ORIGINAL_IMAGES, filePath)
          }}
        />

        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />

        <FilePathSettingInput
          label="Thumbnails Folder"
          value={settings[SETTING_KEYS.THUMBNAIL_DIR_PATH]}
          error={SETTING_KEYS.THUMBNAIL_DIR_PATH in errors}
          errorMessage={errors[SETTING_KEYS.THUMBNAIL_DIR_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.THUMBNAIL_DIR_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.FOLDER,
              settings[SETTING_KEYS.THUMBNAIL_DIR_PATH]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.THUMBNAIL_DIR_PATH, filePath)
          }}
        />
        <FilePathSettingInput
          label="Still Exports Folder"
          value={settings[SETTING_KEYS.STILLEXPORT_DIR_PATH]}
          error={SETTING_KEYS.STILLEXPORT_DIR_PATH in errors}
          errorMessage={errors[SETTING_KEYS.STILLEXPORT_DIR_PATH]}
          onChange={handleChangeFor(SETTING_KEYS.STILLEXPORT_DIR_PATH)}
          onFolderClick={async () => {
            const filePath = await window.api.selectFile(
              FILE_TYPES.FOLDER,
              settings[SETTING_KEYS.STILLEXPORT_DIR_PATH]
            )
            if (!filePath) return
            setOneSetting(SETTING_KEYS.STILLEXPORT_DIR_PATH, filePath)
          }}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 1.5 }}>
          Software Version: {version}
        </Typography>
        <Button
          onClick={handleSubmit}
          disabled={!Object.values(settings).every((setting) => !!setting) || submitting}
          startIcon={
            submitting && <CircularProgress color="inherit" size={16} sx={{ marginRight: 1 }} />
          }
          sx={{ paddingLeft: 1.5, paddingRight: 1.5 }}
        >
          {initialized ? 'Save & Reload' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsContainer
