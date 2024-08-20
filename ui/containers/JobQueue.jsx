import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'

import useStore from '../store'
import { TITLEBAR_HEIGHT } from '../constants/dimensions'

const SettingsContainer = () => {
  const jobQueueOpen = useStore((state) => state.jobQueueOpen)
  const setJobQueueOpen = useStore((state) => state.setJobQueueOpen)
  const closeDialog = () => setJobQueueOpen(false)

  return (
    <Dialog
      open={jobQueueOpen}
      onClose={closeDialog}
      fullWidth
      maxWidth="md"
      disablePortal
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
      <DialogTitle>Job Queue</DialogTitle>

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

      <DialogContent>
        <Box>Fake Job 1</Box>
        <Box>Fake Job 2</Box>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsContainer
