import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import useJobStore from '../store/job'
import { leafPath } from '../utilities/paths'
import STATUSES from '../constants/statuses'
import { IMAGE_QUALITIES, BUCKET_THRESHOLDS } from '../constants/fileTypes'

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
            <Box
              sx={{
                fontSize: '14px',
                lineHeight: '14px',
                fontWeight: 300,
                color: 'text.secondary',
              }}
            >
              <Box component="span" sx={{ color: 'text.primary' }}>
                {compressionBuckets.small?.images?.length} images
              </Box>{' '}
              each smaller than {BUCKET_THRESHOLDS.medium / 1_000_000} megapixels
            </Box>
            <Box component="span" sx={{ color: 'text.secondary' }}>
              Compression choice:
            </Box>{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              {smallChoice}
            </Box>
          </Box>
          <Box>
            <Box sx={{ fontSize: '20px' }}>Medium Images Bucket</Box>
            <Box
              sx={{
                fontSize: '14px',
                lineHeight: '14px',
                fontWeight: 300,
                color: 'text.secondary',
              }}
            >
              <Box component="span" sx={{ color: 'text.primary' }}>
                {compressionBuckets.medium?.images?.length} images
              </Box>{' '}
              each between {BUCKET_THRESHOLDS.medium / 1_000_000} and{' '}
              {BUCKET_THRESHOLDS.large / 1_000_000} megapixels
            </Box>
            <Box component="span" sx={{ color: 'text.secondary' }}>
              Compression choice:
            </Box>{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              {mediumChoice}
            </Box>
          </Box>
          <Box>
            <Box sx={{ fontSize: '20px' }}>Large Images Bucket</Box>
            <Box
              sx={{
                fontSize: '14px',
                lineHeight: '14px',
                fontWeight: 300,
                color: 'text.secondary',
              }}
            >
              <Box component="span" sx={{ color: 'text.primary' }}>
                {compressionBuckets.large?.images?.length} images
              </Box>{' '}
              each larger than {BUCKET_THRESHOLDS.large / 1_000_000} megapixels
            </Box>
            <Box component="span" sx={{ color: 'text.secondary' }}>
              Compression choice:
            </Box>{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              {largeChoice}
            </Box>
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
