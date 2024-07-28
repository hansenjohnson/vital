import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import RefreshIcon from '@mui/icons-material/Refresh'

import useJobStore from '../store/job'
import { leafPath } from '../utilities/paths'
import { bytesToSize } from '../utilities/strings'
import STATUSES from '../constants/statuses'
import Sidebar from '../components/Sidebar'
import SidebarHeader from '../components/SidebarHeader'

const IngestParseSidebar = ({ status, data }) => {
  const jobMode = useJobStore((state) => state.jobMode)
  const sourceFolder = useJobStore((state) => state.sourceFolder)
  const triggerParse = useJobStore((state) => state.triggerParse)

  const totalSize = data.reduce((acc, { size }) => acc + size, 0)
  const totalWarnings = data.reduce((acc, { warnings }) => acc + warnings.length, 0)
  const totalErrors = data.reduce((acc, { errors }) => acc + errors.length, 0)

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
      {status === STATUSES.COMPLETE && (
        <>
          <Box sx={{ fontSize: '20px' }}>
            Ingesting {bytesToSize(totalSize)} of {jobMode}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Box sx={{ fontSize: '20px' }}>{totalWarnings} Warnings</Box>
              <Box sx={{ fontSize: '20px' }}>{totalErrors} Errors</Box>
            </Box>
            <Box>
              <Button sx={{ paddingLeft: 1, paddingRight: 1 }} onClick={triggerParse}>
                Re-Parse <RefreshIcon fontSize="small" sx={{ marginLeft: 0.5 }} />
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Sidebar>
  )
}

export default IngestParseSidebar
