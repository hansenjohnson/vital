import { useEffect, useRef, useState } from 'react'
import { TransitionGroup } from 'react-transition-group'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/Close'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ScheduleIcon from '@mui/icons-material/Schedule'

import useStore from '../store'
import useQueueStore, { canStart } from '../store/queue'
import ingestAPI from '../api/ingest'
import queueAPI from '../api/queue'
import { scheduleTimeString } from '../utilities/strings'
import STATUSES from '../constants/statuses'
import { TITLEBAR_HEIGHT } from '../constants/dimensions'

import JobQueueItem from '../components/JobQueueItem'
import SchedulePad from '../components/SchedulePad'
import TinyTextButton from '../components/TinyTextButton'

const JobQueue = () => {
  const jobQueueOpen = useStore((state) => state.jobQueueOpen)
  const setJobQueueOpen = useStore((state) => state.setJobQueueOpen)
  const closeDialog = () => setJobQueueOpen(false)

  const incompleteJobs = useQueueStore((state) => state.incompleteJobs)
  const completeJobs = useQueueStore((state) => state.completeJobs)
  const fetchJobsData = useQueueStore((state) => state.fetchJobsData)
  const loadMoreCompletedJobs = useQueueStore((state) => state.loadMoreCompletedJobs)
  useEffect(() => {
    fetchJobsData()
  }, [])

  const deleteJob = async (jobId) => {
    await ingestAPI.deleteJob(jobId)
    await fetchJobsData()
  }

  const queueRunning = useQueueStore((state) => state.isRunning)
  const startRunningChecker = useQueueStore((state) => state.startRunningChecker)
  const startQueue = () => {
    queueAPI.executeNow()
    startRunningChecker()
  }

  const queueDialogRef = useRef(null)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const toggleSchedule = () => {
    setScheduleOpen(!scheduleOpen)
  }

  const fetchSchedule = useQueueStore((state) => state.fetchSchedule)
  const commitSchedule = async (timeString) => {
    const todayDate = new Date().toISOString().split('T')[0]
    const [hh, mm, period] = timeString.split(':')
    const hh24 = period === 'PM' ? parseInt(hh) + 12 : parseInt(hh)
    const timestamp = new Date(`${todayDate}T${hh24}:${mm}:00`)
    await queueAPI.setSchedule(timestamp)
    await fetchSchedule()
    setScheduleOpen(false)
  }
  const deleteSchedule = async () => {
    await queueAPI.deleteSchedule()
    await fetchSchedule()
  }

  const schedule = useQueueStore((state) => state.schedule)
  const scheduleTime = scheduleTimeString(schedule)

  const canQueueStart = useQueueStore(canStart)
  const canLoadMore = completeJobs.length !== 0 && completeJobs.length % 10 === 0

  let topActionSection = null
  if (queueRunning) {
    topActionSection = <Box sx={{ color: 'secondary.main' }}>Running</Box>
  } else if (schedule != null) {
    topActionSection = (
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Box component="span" sx={{ color: 'text.secondary' }}>
          Scheduled Run
        </Box>
        <Box component="span" sx={{ fontWeight: 500 }}>
          Today @ {scheduleTime}
        </Box>
        <Box sx={{ marginLeft: 0 }}>
          <TinyTextButton onClick={deleteSchedule}>clear</TinyTextButton>
        </Box>
      </Box>
    )
  } else {
    topActionSection = (
      <>
        <Button color="tertiary" disabled={!canQueueStart || scheduleOpen} onClick={startQueue}>
          Start Now <PlayArrowIcon sx={{ fontSize: '20px' }} />
        </Button>

        <Button
          color="secondary"
          disabled={!canQueueStart}
          onClick={toggleSchedule}
          variant={scheduleOpen ? 'contained' : 'text'}
          sx={{ color: scheduleOpen ? 'white' : undefined }}
          disableElevation
        >
          Schedule <ScheduleIcon sx={{ marginLeft: 0.5, fontSize: '20px' }} />
        </Button>
        <SchedulePad
          open={scheduleOpen}
          onClose={() => setScheduleOpen(false)}
          parent={queueDialogRef.current}
          onCommit={commitSchedule}
        />
      </>
    )
  }

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
      PaperProps={{
        ref: queueDialogRef,
        sx: {
          right: scheduleOpen ? '250px' : '0px',
          transition: 'right 0.3s ease',
          position: 'relative',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginRight: 6 }}>
        <DialogTitle>Job Queue</DialogTitle>
        <Box sx={{ flexGrow: 1 }} />
        {topActionSection}
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

      <DialogContent sx={{ paddingTop: 0 }}>
        <Typography variant="h6">Incomplete Jobs</Typography>
        {incompleteJobs.length === 0 && <Box sx={{ fontStyle: 'italic' }}>None</Box>}
        {incompleteJobs.map((job, index) => {
          const { id, type, status, data } = job
          const jobCompletion = job.tasks.reduce((acc, task) => {
            let taskProgress = task.progress
            if (task.status === STATUSES.COMPLETED) {
              taskProgress = 100
            } else if (task.status === STATUSES.ERROR) {
              taskProgress = 0
            }
            return acc + task.size * (taskProgress / 100)
          }, 0)
          const jobCompletionPercent = (jobCompletion / job.size) * 100
          return (
            <JobQueueItem
              key={id}
              id={id}
              type={type}
              status={status}
              numTasks={job.tasks.length}
              info={{
                data: JSON.parse(data),
                progress: jobCompletionPercent,
              }}
              actions={{
                deleteJob,
              }}
              queueRunning={queueRunning}
              firstItem={index === 0}
              lastItem={index === incompleteJobs.length - 1}
            />
          )
        })}

        <Typography variant="h6" mt={2}>
          Complete Jobs
        </Typography>
        {completeJobs.length === 0 && <Box sx={{ fontStyle: 'italic' }}>None</Box>}

        <TransitionGroup>
          {completeJobs.map((job, index) => {
            const { id, type, status, completed_date, data } = job
            return (
              <Collapse key={id}>
                <JobQueueItem
                  id={id}
                  type={type}
                  status={status}
                  numTasks={job.tasks.length}
                  info={{
                    data: JSON.parse(data),
                    completedDate: completed_date,
                  }}
                  queueRunning={queueRunning}
                  firstItem={index === 0}
                  lastItem={index === completeJobs.length - 1}
                />
              </Collapse>
            )
          })}
        </TransitionGroup>

        <Box sx={{ marginTop: 2 }} />
        <Button onClick={loadMoreCompletedJobs} disabled={!canLoadMore}>
          Load More
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default JobQueue
