import Box from '@mui/material/Box'

import useJobStore from '../store/job'
import { leafPath } from '../utilities/paths'
import Sidebar from '../components/Sidebar'
import SidebarHeader from '../components/SidebarHeader'

const IngestParseSidebar = () => {
  const sourceFolder = useJobStore((state) => state.sourceFolder)

  return (
    <Sidebar spacing={1}>
      <SidebarHeader title={leafPath(sourceFolder)} subtitle="video metadata for" />
      <Box>more details here</Box>
    </Sidebar>
  )
}

export default IngestParseSidebar
