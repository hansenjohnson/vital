import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import RefreshIcon from '@mui/icons-material/Refresh'
import TextField from '@mui/material/TextField'

import useJobStore from '../store/job'
import { leafPath } from '../utilities/paths'
import { bytesToSize } from '../utilities/strings'
import STATUSES, { ERRORS, WARNINGS } from '../constants/statuses'
import Sidebar from '../components/Sidebar'
import SidebarHeader from '../components/SidebarHeader'
import IssueSummaryControls from '../components/IssueSummaryControls'
import StyledButton from '../components/StyledButton'

const IngestParseSidebar = ({
  status,
  totalSize,
  allWarnings,
  allErrors,
  actionName,
  canTrigger,
  onTriggerAction,
}) => {
  const jobMode = useJobStore((state) => state.jobMode)
  const sourceFolder = useJobStore((state) => state.sourceFolder)
  const triggerParse = useJobStore((state) => state.triggerParse)

  const metadataFilter = useJobStore((state) => state.metadataFilter)
  const setMetadataFilter = useJobStore((state) => state.setMetadataFilter)
  const issueIgnoreList = useJobStore((state) => state.issueIgnoreList)
  const addToIgnoreList = useJobStore((state) => state.addToIgnoreList)
  const removeFromIgnoreList = useJobStore((state) => state.removeFromIgnoreList)

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
            metadataFilter={metadataFilter}
            setMetadataFilter={setMetadataFilter}
            issueIgnoreList={issueIgnoreList}
            addToIgnoreList={addToIgnoreList}
            removeFromIgnoreList={removeFromIgnoreList}
          />
          <IssueSummaryControls
            title="Errors"
            orderedIssuesWithCounts={[...allErrors.entries()]}
            issueConstants={ERRORS}
            metadataFilter={metadataFilter}
            setMetadataFilter={setMetadataFilter}
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ fontSize: '20px' }}>Batch Rename Files</Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField label="Trim Start" type="number" size="small" />
              <TextField label="Trim End" type="number" size="small" />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField label="Add Prefix" size="small" />
              <TextField label="Add Suffix" size="small" />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField label="Insert String" size="small" />
              <TextField label="Insert At" type="number" size="small" />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField label="Find" size="small" />
              <TextField label="Replace With" size="small" />
            </Box>
          </Box>

          <Box sx={{ flexGrow: 1 }} />
          <StyledButton
            variant="outlined"
            fullWidth
            disabled={!canTrigger}
            onClick={onTriggerAction}
          >
            {actionName}
          </StyledButton>
        </>
      )}
    </Sidebar>
  )
}

export default IngestParseSidebar
