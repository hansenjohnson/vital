import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FilePathSettingInput from '../components/FilePathSettingInput'

const SettingsContainer = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Alert severity="warning">
          You must fill out these settings in order to use the Application.
        </Alert>

        <FilePathSettingInput
          label="Associations File"
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
