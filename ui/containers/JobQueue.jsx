import { useEffect } from 'react'
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
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import TocIcon from '@mui/icons-material/Toc'

import useStore from '../store'
import useQueueStore, { canStart } from '../store/queue'
import ingestAPI from '../api/ingest'
import queueAPI from '../api/queue'
import { TITLEBAR_HEIGHT } from '../constants/dimensions'
import { JOB_TYPES } from '../constants/routes'
import statuses from '../constants/statuses'
import { leafPath } from '../utilities/paths'
import { Tooltip } from '@mui/material'

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

  console.log('incompleteJobs', incompleteJobs)
  console.log('completeJobs', completeJobs)

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
                marginBottom: index !== incompleteJobs.length - 1 ? '2px' : 0,
              }}
            >
              <Box sx={(theme) => ({ fontFamily: theme.typography.monoFamily })}>
                {jobName} &mdash; ## {JOB_TYPES[type]}
                {status === statuses.QUEUED && (
                  <Box
                    sx={{
                      fontSize: '14px',
                      color: 'text.secondary',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    Queued
                  </Box>
                )}
                {status === statuses.INCOMPLETE && (
                  <Box sx={(theme) => ({ fontFamily: theme.typography.monoFamily })}>
                    ---------------- ??%
                  </Box>
                )}
              </Box>

              <Box sx={{ flexGrow: 1 }} />

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
        <Box>
          Fake Job 3 - Completed on Jul 17th @ 9pm <Button>View Report</Button>
        </Box>
        <Box>
          Fake Job 1 - Completed on Jul 17th @ 7pm <Button>View Report</Button>
        </Box>
        <Box sx={{ marginTop: 2 }} />
        <Button onClick={loadMoreCompletedJobs}>Load More</Button>
      </DialogContent>
    </Dialog>
  )
}

export default JobQueue
