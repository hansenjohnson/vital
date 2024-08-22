import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ScheduleIcon from '@mui/icons-material/Schedule'

import useStore from '../store'
import ingestAPI from '../api/ingest'
import { TITLEBAR_HEIGHT } from '../constants/dimensions'

const JobQueue = () => {
  const jobQueueOpen = useStore((state) => state.jobQueueOpen)
  const setJobQueueOpen = useStore((state) => state.setJobQueueOpen)
  const closeDialog = () => setJobQueueOpen(false)

  const [incompleteJobs, setIncompleteJobs] = useState([])
  const [completeJobs, setCompleteJobs] = useState([])
  const nextPage = useRef(2)
  useEffect(() => {
    ingestAPI.getIncompleteJobs().then((jobs) => setIncompleteJobs(jobs))
    ingestAPI.getCompleteJobs(1).then((jobs) => setCompleteJobs(jobs))
  }, [])

  const loadMoreCompletedJobs = () => {
    ingestAPI.getCompleteJobs(nextPage.current).then((jobs) => {
      setCompleteJobs((prevJobs) => [...prevJobs, ...jobs])
      nextPage.current += 1
    })
  }

  const canStart = incompleteJobs.length > 0

  return (
    <Dialog
      open={jobQueueOpen}
      onClose={closeDialog}
      fullWidth
      maxWidth="sm"
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
        <Button color="tertiary" disabled={!canStart}>
          Start Now <PlayArrowIcon sx={{ fontSize: '20px' }} />
        </Button>
        <Button color="secondary" disabled={!canStart}>
          Schedule <ScheduleIcon sx={{ marginLeft: 0.5, fontSize: '20px' }} />
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

export default JobQueue
