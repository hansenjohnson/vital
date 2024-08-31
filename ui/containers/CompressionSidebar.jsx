import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import useJobStore from '../store/job'
import { leafPath } from '../utilities/paths'
import STATUSES from '../constants/statuses'
import { IMAGE_QUALITIES } from '../constants/fileTypes'

import Sidebar from '../components/Sidebar'
import SidebarHeader from '../components/SidebarHeader'
import StyledButton from '../components/StyledButton'

const CompressionOptionsSidebar = ({ status, actionName, canTrigger, onTriggerAction }) => {
  const sourceFolder = useJobStore((state) => state.sourceFolder)
  const compressionBuckets = useJobStore((state) => state.compressionBuckets)

  let smallChoice = IMAGE_QUALITIES[compressionBuckets.small?.selection]?.compressionAmount
  let mediumChoice = IMAGE_QUALITIES[compressionBuckets.medium?.selection]?.compressionAmount
  let largeChoice = IMAGE_QUALITIES[compressionBuckets.large?.selection]?.compressionAmount

  if (smallChoice === 'No') {
    smallChoice = 'None'
  }
  if (mediumChoice === 'No') {
    mediumChoice = 'None'
  }
  if (largeChoice === 'No') {
    largeChoice = 'None'
  }

  return (
    <Sidebar spacing={1}>
      <SidebarHeader
        title={leafPath(sourceFolder)}
        subtitle={`choosing compression settings for`}
      />
      {status === STATUSES.LOADING && (
        <Box
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <CircularProgress />
        </Box>
      )}
      {status === STATUSES.COMPLETED && (
        <>
          <Box>
            <Box sx={{ fontSize: '20px' }}>Small Images Bucket</Box>
            Compression choice: {smallChoice}
          </Box>
          <Box>
            <Box sx={{ fontSize: '20px' }}>Medium Images Bucket</Box>
            Compression choice: {mediumChoice}
          </Box>
          <Box>
            <Box sx={{ fontSize: '20px' }}>Large Images Bucket</Box>
            Compression choice: {largeChoice}
          </Box>
          <Box>
            <Box sx={{ fontSize: '20px' }}>Total Expected Savings</Box>
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

export default CompressionOptionsSidebar
