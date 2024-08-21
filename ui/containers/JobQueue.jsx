import Box from '@mui/material/Box'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ScheduleIcon from '@mui/icons-material/Schedule'

import useStore from '../store'
import { TITLEBAR_HEIGHT } from '../constants/dimensions'
import { Typography } from '@mui/material'

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginRight: 6 }}>
        <DialogTitle>Job Queue</DialogTitle>
        <Box sx={{ flexGrow: 1 }} />
        <Button>
          Start Now <PlayArrowIcon />
        </Button>
        <Button>
          Schedule <ScheduleIcon />
        </Button>
      </Box>
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
        <Typography variant="h6">Incomplete Jobs</Typography>
        <Box>
          Fake Job 2 - Incomplete - 76% <Button>See Tasks</Button>
          <Button>Delete Job</Button>
        </Box>
        <Box>
          Fake Job 4 - Queued <Button>See Tasks</Button>
          <Button>Delete Job</Button>
        </Box>
        <Box sx={{ marginTop: 2 }} />

        <Typography variant="h6">Complete Jobs</Typography>
        <Box>
          Fake Job 3 - Completed on Jul 17th @ 9pm <Button>View Report</Button>
        </Box>
        <Box>
          Fake Job 1 - Completed on Jul 17th @ 7pm <Button>View Report</Button>
        </Box>
        <Box sx={{ marginTop: 2 }} />
        <Button>Load More</Button>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsContainer
