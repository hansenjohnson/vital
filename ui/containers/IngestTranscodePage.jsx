import Box from '@mui/material/Box'

import useJobStore from '../store/job'
import IngestParseSidebar from './IngestParseSidebar'
import BlankSlate from '../components/BlankSlate'
import { JOB_PHASES } from '../constants/routes'

const LinkageAnnotationPage = () => {
  const phase = useJobStore((state) => state.phase)

  /* Phase Handling Returns */
  if (phase === JOB_PHASES.PARSING) {
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        <IngestParseSidebar />
        <Box>
          <BlankSlate message="not implemented yet" />
        </Box>
      </Box>
    )
  }

  return <BlankSlate message={`Unknown Phase: ${phase}`} />
}

export default LinkageAnnotationPage
