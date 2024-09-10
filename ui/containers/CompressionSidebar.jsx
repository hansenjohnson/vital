import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import useJobStore from '../store/job'
import { leafPath } from '../utilities/paths'
import { bytesToSize } from '../utilities/strings'
import STATUSES from '../constants/statuses'
import { IMAGE_QUALITIES, BUCKET_THRESHOLDS } from '../constants/fileTypes'

import Sidebar from '../components/Sidebar'
import SidebarHeader from '../components/SidebarHeader'
import StyledButton from '../components/StyledButton'

const CompressionOptionsSidebar = ({
  status,
  darkNumStatus,
  darkNum,
  darkNumProgress,
  actionName,
  canTrigger,
  onTriggerAction,
}) => {
  const buckets = ['small', 'medium', 'large']
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

  let totalSavings = 0
  buckets.forEach((bucket) => {
    const savingsForBucket =
      compressionBuckets[bucket].size -
      compressionBuckets[bucket].size *
        IMAGE_QUALITIES[compressionBuckets[bucket]?.selection]?.compressionRatio
    totalSavings += savingsForBucket || 0
  })

  let totalImages = 0
  totalImages += compressionBuckets.small?.images?.length || 0
  totalImages += compressionBuckets.medium?.images?.length || 0
  totalImages += compressionBuckets.large?.images?.length || 0

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
            <Box
              component="span"
              sx={{ color: smallChoice === 'None' ? 'text.primary' : 'primary.main' }}
            >
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
            <Box
              component="span"
              sx={{ color: mediumChoice === 'None' ? 'text.primary' : 'primary.main' }}
            >
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
            <Box
              component="span"
              sx={{ color: largeChoice === 'None' ? 'text.primary' : 'primary.main' }}
            >
              {largeChoice}
            </Box>
          </Box>
          <Box>
            <Box sx={{ fontSize: '20px' }}>Total Expected Savings</Box>
            <Box sx={{ color: totalSavings === 0 ? 'text.primary' : 'secondary.main' }}>
              {totalSavings === 0 ? '' : '~'}
              {bytesToSize(totalSavings)}
            </Box>
          </Box>

          <Box>
            <Box sx={{ fontSize: '20px' }}>Dark Image Correction</Box>
            <Box
              sx={{
                fontSize: '14px',
                lineHeight: '14px',
                fontWeight: 300,
                color: 'text.secondary',
              }}
            >
              {darkNumStatus === STATUSES.COMPLETED ? (
                <>
                  Found{' '}
                  <Box component="span" sx={{ color: 'text.primary' }}>
                    {darkNum} dark images
                  </Box>
                </>
              ) : (
                <Box component="span" sx={{ fontStyle: 'italic' }}>
                  Identifying dark images...
                </Box>
              )}
              {darkNumStatus !== STATUSES.COMPLETED && (
                <Box sx={{ marginTop: '2px' }}>
                  checked {darkNumProgress} of {totalImages} images
                </Box>
              )}
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

export default CompressionOptionsSidebar
