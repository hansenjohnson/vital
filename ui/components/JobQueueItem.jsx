import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import ToolTip from '@mui/material/ToolTip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import TocIcon from '@mui/icons-material/Toc'

import STATUSES, { ERRORS } from '../constants/statuses'
import { completionTimeString } from '../utilities/strings'
import { leafPath } from '../utilities/paths'

const JobQueueItem = ({
  id,
  status,
  numTasks,
  info = {},
  actions = {},
  queueRunning = false,
  firstItem = false,
  lastItem = false,
  errorMessage = null,
}) => {
  const theme = useTheme()
  const { data, completedDate, progress } = info
  const { deleteJob } = actions

  const type = data.media_type
  const name = leafPath(data.source_dir)
  const hasVisibleJobError = queueRunning && firstItem && ERRORS.has(errorMessage)

  let itemOutline = 'none'
  if (hasVisibleJobError) {
    itemOutline = `1px solid ${theme.palette.error.main}`
  } else if (status !== STATUSES.COMPLETED && queueRunning && firstItem) {
    itemOutline = `1px solid ${theme.palette.secondary.main}`
  }

  let secondarySection = null
  if (status === STATUSES.COMPLETED) {
    secondarySection = (
      <Box
        sx={{
          fontSize: '14px',
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        Completed on {completionTimeString(completedDate)}
      </Box>
    )
  } else {
    if (status === STATUSES.QUEUED) {
      secondarySection = (
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
      )
    } else if (status === STATUSES.INCOMPLETE) {
      secondarySection = (
        <Box sx={(theme) => ({ fontFamily: theme.typography.monoFamily })}>
          <LinearProgress
            color={queueRunning ? 'secondary' : 'inherit'}
            variant="determinate"
            value={progress}
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
      )
    }
  }

  let actionNodes = null
  if (status === STATUSES.COMPLETED) {
    actionNodes = (
      <>
        <Button disabled>View Report</Button>
      </>
    )
  } else {
    actionNodes = (
      <>
        <ToolTip title="See Tasks" placement="top" arrow>
          <IconButton size="small">
            <TocIcon />
          </IconButton>
        </ToolTip>

        <ToolTip
          title="Delete Job"
          placement="top"
          arrow
          componentsProps={{
            tooltip: {
              sx: { backgroundColor: theme.palette.error.dark },
            },
            arrow: {
              sx: { color: theme.palette.error.dark },
            },
          }}
        >
          <IconButton size="small" color="error" onClick={() => deleteJob(id)}>
            <DeleteForeverIcon />
          </IconButton>
        </ToolTip>
      </>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 0.5,
        paddingBottom: 0.5,
        borderRadius: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        marginTop: firstItem ? 0.5 : 0,
        marginBottom: !lastItem ? '2px' : 0,
        outline: itemOutline,
      }}
    >
      <Box sx={{ fontFamily: theme.typography.monoFamily }}>
        {name} &mdash; {numTasks} {type}
        {numTasks > 1 ? 's' : ''}
        {secondarySection}
        {hasVisibleJobError && (
          <Box sx={{ fontSize: '12px', lineHeight: '14px', color: 'error.main' }}>
            {ERRORS.get(errorMessage)?.summary}
          </Box>
        )}
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {status === STATUSES.INCOMPLETE && (
        <Box sx={{ marginRight: 1, color: queueRunning ? undefined : 'action.disabled' }}>
          {Math.floor(progress)}%
        </Box>
      )}

      {actionNodes}
    </Box>
  )
}

export default JobQueueItem
