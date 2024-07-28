import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import useJobStore from '../store/job'
import { leafPath } from '../utilities/paths'
import STATUSES from '../constants/statuses'
import Sidebar from '../components/Sidebar'
import SidebarHeader from '../components/SidebarHeader'

const IngestParseSidebar = ({ status }) => {
  const sourceFolder = useJobStore((state) => state.sourceFolder)

  return (
    <Sidebar spacing={1}>
      <SidebarHeader title={leafPath(sourceFolder)} subtitle="video metadata for" />
      {status === STATUSES.LOADING && (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <CircularProgress />
        </Box>
      )}
    </Sidebar>
  )
}

export default IngestParseSidebar
