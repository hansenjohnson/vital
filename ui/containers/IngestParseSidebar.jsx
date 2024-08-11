import { useMemo } from 'react'
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
  oneFileName,
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

  const batchRenameRules = useJobStore((state) => state.batchRenameRules)
  const setOneBatchRenameRule = useJobStore((state) => state.setOneBatchRenameRule)
  const applyBatchRenameRules = useJobStore((state) => state.applyBatchRenameRules)
  const processBatchRenameOnString = useJobStore((state) => state.processBatchRenameOnString)
  const oneNewName = useMemo(() => {
    return processBatchRenameOnString(oneFileName)
  }, [oneFileName, JSON.stringify(batchRenameRules)])

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

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1 }}>
            <Box sx={{ fontSize: '20px' }}>
              Batch Rename Files
              <Box sx={(theme) => ({ fontFamily: theme.typography.monoFamily, fontSize: '12px' })}>
                Example:
                <br />
                <Box component="span" sx={{ color: 'text.disabled' }}>
                  {oneFileName}
                </Box>
                &nbsp;&nbsp;→
                <br />
                {oneNewName}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Trim Start"
                type="number"
                size="small"
                value={batchRenameRules.trimStart}
                onChange={(event) => setOneBatchRenameRule('trimStart', event.target.value)}
              />
              <TextField
                label="Trim End"
                type="number"
                size="small"
                value={batchRenameRules.trimEnd}
                onChange={(event) => setOneBatchRenameRule('trimEnd', event.target.value)}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Add Prefix"
                size="small"
                value={batchRenameRules.prefix}
                onChange={(event) => setOneBatchRenameRule('prefix', event.target.value)}
              />
              <TextField
                label="Add Suffix"
                size="small"
                value={batchRenameRules.suffix}
                onChange={(event) => setOneBatchRenameRule('suffix', event.target.value)}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Insert Text"
                size="small"
                value={batchRenameRules.insertText}
                onChange={(event) => setOneBatchRenameRule('insertText', event.target.value)}
              />
              <TextField
                label="Insert At"
                type="number"
                size="small"
                value={batchRenameRules.insertAt}
                onChange={(event) => setOneBatchRenameRule('insertAt', event.target.value)}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="Find"
                size="small"
                value={batchRenameRules.findString}
                onChange={(event) => setOneBatchRenameRule('findString', event.target.value)}
              />
              <TextField
                label="Replace With"
                size="small"
                value={batchRenameRules.replaceString}
                onChange={(event) => setOneBatchRenameRule('replaceString', event.target.value)}
              />
            </Box>
            <Button
              variant="contained"
              color="secondary"
              sx={{ alignSelf: 'flex-end' }}
              disableElevation
              onClick={applyBatchRenameRules}
              disabled={batchRenameRules.applied}
            >
              {batchRenameRules.applied ? 'Rules Applied' : 'Apply Rules'}
            </Button>
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
