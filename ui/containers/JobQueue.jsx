import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'

import CloseIcon from '@mui/icons-material/Close'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ScheduleIcon from '@mui/icons-material/Schedule'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import TocIcon from '@mui/icons-material/Toc'

import useStore from '../store'
import useQueueStore, { canStart } from '../store/queue'
import ingestAPI from '../api/ingest'
import queueAPI from '../api/queue'
import { TITLEBAR_HEIGHT } from '../constants/dimensions'
import { JOB_TYPES } from '../constants/routes'
import STATUSES from '../constants/statuses'
import { leafPath } from '../utilities/paths'
import { completionTimeString } from '../utilities/strings'

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

  const canQueueStart = useQueueStore(canStart)
  const canLoadMore = completeJobs.length !== 0 && completeJobs.length % 10 === 0
  const queueRunning = true

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

        <Button color="tertiary" disabled={!canQueueStart} onClick={() => queueAPI.executeNow()}>
          Start Now <PlayArrowIcon sx={{ fontSize: '20px' }} />
        </Button>

        <Button color="secondary" disabled={!canQueueStart}>
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

      <DialogContent sx={{ paddingTop: 0 }}>
        <Typography variant="h6">Incomplete Jobs</Typography>

        {incompleteJobs.length === 0 && <Box sx={{ fontStyle: 'italic' }}>None</Box>}

        {incompleteJobs.map((job, index) => {
          const { id, type, status, data } = job
          const dataObj = JSON.parse(data)
          const jobName = leafPath(dataObj.source_dir)
          const jobCompletion = job.tasks.reduce(
            (acc, task) => acc + task.size * (task.progress / 100),
            0
          )
          const jobCompletionPercent = (jobCompletion / job.size) * 100
          return (
            <Box
              key={id}
              sx={(theme) => ({
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 1,
                paddingRight: 1,
                paddingTop: 0.5,
                paddingBottom: 0.5,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                marginBottom: index !== incompleteJobs.length - 1 ? '2px' : 0,
                outline:
                  queueRunning && index === 0
                    ? `1px solid ${theme.palette.secondary.main}`
                    : 'none',
              })}
            >
              <Box sx={(theme) => ({ fontFamily: theme.typography.monoFamily })}>
                {jobName} &mdash; {job.tasks.length} {JOB_TYPES[type]}
                {status === STATUSES.QUEUED && (
                  <Box
                    sx={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    Queued
                  </Box>
                )}
                {status === STATUSES.INCOMPLETE && (
                  <Box sx={(theme) => ({ fontFamily: theme.typography.monoFamily })}>
                    <LinearProgress
                      color={queueRunning ? 'secondary' : 'inherit'}
                      variant="determinate"
                      value={jobCompletionPercent}
                      sx={{
                        width: '350px',
                        borderRadius: 1,
                        // This spacing is meant to align with the text above
                        height: '8px',
                        marginTop: '6px',
                        marginBottom: '6px',
                        color: queueRunning ? undefined : 'action.disabled',
                      }}
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Box sx={{ marginRight: 1, color: queueRunning ? undefined : 'action.disabled' }}>
                {parseInt(jobCompletionPercent, 10)}%
              </Box>

              <Tooltip title="See Tasks" placement="top" arrow>
                <IconButton size="small">
                  <TocIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title="Delete Job"
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: (theme) => ({ backgroundColor: theme.palette.error.dark }),
                  },
                  arrow: {
                    sx: (theme) => ({ color: theme.palette.error.dark }),
                  },
                }}
              >
                <IconButton size="small" color="error" onClick={() => deleteJob(id)}>
                  <DeleteForeverIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )
        })}

        <Typography variant="h6" mt={2}>
          Complete Jobs
        </Typography>

        {completeJobs.length === 0 && <Box sx={{ fontStyle: 'italic' }}>None</Box>}

        {completeJobs.map((job, index) => {
          const { id, type, completed_date, data } = job
          const dataObj = JSON.parse(data)
          const jobName = leafPath(dataObj.source_dir)
          return (
            <Box
              key={id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 1,
                paddingRight: 1,
                paddingTop: 0.5,
                paddingBottom: 0.5,
                borderRadius: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                marginBottom: index !== completeJobs.length - 1 ? '2px' : 0,
              }}
            >
              <Box sx={(theme) => ({ fontFamily: theme.typography.monoFamily })}>
                {jobName} &mdash; {job.tasks.length} {JOB_TYPES[type]}
                <Box
                  sx={{
                    fontSize: '14px',
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Completed on {completionTimeString(completed_date)}
                </Box>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Button disabled>View Report</Button>
            </Box>
          )
        })}

        <Box sx={{ marginTop: 2 }} />
        <Button onClick={loadMoreCompletedJobs} disabled={!canLoadMore}>
          Load More
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default JobQueue
