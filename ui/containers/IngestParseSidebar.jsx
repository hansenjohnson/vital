import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import RefreshIcon from '@mui/icons-material/Refresh'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

import useJobStore from '../store/job'
import { leafPath } from '../utilities/paths'
import { bytesToSize } from '../utilities/strings'
import STATUSES, { WARNINGS } from '../constants/statuses'
import Sidebar from '../components/Sidebar'
import SidebarHeader from '../components/SidebarHeader'

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
              Ingesting {bytesToSize(totalSize)} of {jobMode}
            </Box>
            <Box>
              <Button sx={{ paddingLeft: 1, paddingRight: 1 }} onClick={triggerParse}>
                Re-Parse <RefreshIcon fontSize="small" sx={{ marginLeft: 0.5 }} />
              </Button>
            </Box>
          </Box>
          <Box>
            <Box
              sx={(theme) => ({
                borderBottom: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'flex-end',
              })}
            >
              <Box sx={{ fontSize: '20px' }}>Warnings</Box>
              <Box sx={{ flexGrow: 1 }} />
              <Box sx={{ width: '48px', fontSize: '12px', textAlign: 'center' }}>Count</Box>
              <Box sx={{ width: '48px', fontSize: '12px', textAlign: 'center' }}>Show Only</Box>
              <Box sx={{ width: '48px', fontSize: '12px', textAlign: 'center' }}>
                Accept & Ignore
              </Box>
            </Box>

            {[...allWarnings.entries()].map(([warning, count]) => (
              <Box key={warning} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box>{WARNINGS.get(warning).summary}</Box>
                <Box sx={{ flexGrow: 1 }} />
                <Box
                  sx={(theme) => ({
                    width: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: theme.typography.monoFamily,
                  })}
                >
                  {count}
                </Box>
                <Box
                  sx={{
                    width: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconButton size="small">
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    width: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Switch size="small" />
                </Box>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Sidebar>
  )
}

export default IngestParseSidebar
