import Box from '@mui/material/Box'

import { baseURL } from '../api/config'
import { nameNoExt, leafPath } from '../utilities/paths'

const samplesThatMatchBucket = (sampleImages, bucketFilename) => {
  if (!bucketFilename) return []
  return sampleImages.filter((sample) => {
    const expectedSuffix = `_${sample.jpeg_quality}`
    const sampleBaseNameWithQuality = nameNoExt(sample.file_name)
    const sampleBaseName = sampleBaseNameWithQuality
      .split(expectedSuffix)
      .slice(0, -1)
      .join(expectedSuffix)
    const bucketBaseName = nameNoExt(leafPath(bucketFilename))
    return sampleBaseName === bucketBaseName
  })
}

const CompressionBucketsList = ({ compressionBuckets, sampleImages }) => {
  const { small, medium, large } = compressionBuckets
  const smallImages = samplesThatMatchBucket(sampleImages, small?.images?.[0])
  const mediumImages = samplesThatMatchBucket(sampleImages, medium?.images?.[0])
  const largeImages = samplesThatMatchBucket(sampleImages, large?.images?.[0])
  return (
    <Box>
      <Box sx={{ fontSize: '20px' }}>Small Images Bucket</Box>
      <Box>
        {smallImages.map((image) => (
          <img
            key={image}
            src={`${baseURL}/ingest/sample/${encodeURIComponent(image.file_name)}`}
            style={{ width: '200px', height: '200px' }}
          />
        ))}
      </Box>

      <Box sx={{ fontSize: '20px' }}>Medium Images Bucket</Box>
      <Box>
        {mediumImages.map((image) => (
          <img
            key={image}
            src={`${baseURL}/ingest/sample/${encodeURIComponent(image.file_name)}`}
            style={{ width: '200px', height: '200px' }}
          />
        ))}
      </Box>

      <Box sx={{ fontSize: '20px' }}>Large Images Bucket</Box>
      <Box>
        {largeImages.map((image) => (
          <img
            key={image}
            src={`${baseURL}/ingest/sample/${encodeURIComponent(image.file_name)}`}
            style={{ width: '200px', height: '200px' }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default CompressionBucketsList
