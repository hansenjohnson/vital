import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import RefreshIcon from '@mui/icons-material/Refresh'

import useJobStore from '../store/job'
import { leafPath } from '../utilities/paths'
import { bytesToSize } from '../utilities/strings'
import STATUSES, { ERRORS, WARNINGS } from '../constants/statuses'
import Sidebar from '../components/Sidebar'
import SidebarHeader from '../components/SidebarHeader'
import IssueSummaryControls from '../components/IssueSummaryControls'

const IngestParseSidebar = ({ status, totalSize, allWarnings, allErrors }) => {
  const jobMode = useJobStore((state) => state.jobMode)
  const sourceFolder = useJobStore((state) => state.sourceFolder)
  const triggerParse = useJobStore((state) => state.triggerParse)

  return (
    <Sidebar spacing={1}>
      <SidebarHeader title={leafPath(sourceFolder)} subtitle={`${jobMode} metadata for`} />
      {status === STATUSES.LOADING && (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <CircularProgress />
        </Box>
      )}
      {status === STATUSES.COMPLETED && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ fontSize: '20px' }}>
              Ingesting {bytesToSize(totalSize, 2)} of {jobMode}
            </Box>
            <Box>
              <Button
                sx={(theme) => ({
                  paddingLeft: 1,
                  // This 4px is the gap between the icon and it's "container"
                  paddingRight: `calc(${theme.spacing(1)} - 4px)`,
                  marginRight: `calc(${theme.spacing(-1)} + 4px)`,
                })}
                onClick={triggerParse}
              >
                Re-Parse
                <RefreshIcon fontSize="small" sx={{ marginLeft: 0.5 }} />
              </Button>
            </Box>
          </Box>
          <IssueSummaryControls
            title="Warnings"
            orderedIssuesWithCounts={[...allWarnings.entries()]}
            issueConstants={WARNINGS}
            ignorable
          />
          <IssueSummaryControls
            title="Errors"
            orderedIssuesWithCounts={[...allErrors.entries()]}
            issueConstants={ERRORS}
          />
        </>
      )}
    </Sidebar>
  )
}

export default IngestParseSidebar
