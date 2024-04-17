import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import SettingInput from '../components/SettingInput'
import FilePathSettingInput from '../components/FilePathSettingInput'

const SettingsContainer = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Alert severity="warning" sx={{ marginBottom: 1 }}>
          You must fill out these settings in order to use the Application.
        </Alert>

        <FilePathSettingInput
          label="Associations File"
          value=""
          onChange={() => {}}
          onFolderClick={() => window.api.selectFile()}
        />
        <SettingInput label="Associations Sheet Name" value="" onChange={() => {}} />

        <Box mb={1} />

        <FilePathSettingInput
          label="Sightings Data File"
          value=""
          onChange={() => {}}
          onFolderClick={() => window.api.selectFile()}
        />
        <SettingInput label="Sightings Sheet Name" value="" onChange={() => {}} />

        <Box mb={1} />

        <FilePathSettingInput
          label="Internal Thumbnails Folder"
          value=""
          onChange={() => {}}
          onFolderClick={() => window.api.selectFile()}
        />

        <FilePathSettingInput
          label="Exported Still Frames Folder"
          value=""
          onChange={() => {}}
          onFolderClick={() => window.api.selectFile()}
        />
      </DialogContent>
      <DialogActions>
        <Button>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SettingsContainer
