import Box from '@mui/material/Box'

import { baseURL } from '../api/config'
import { nameNoExt, leafPath } from '../utilities/paths'
import CompressionOption from './CompressionOption'

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

const qualityToCompressionName = {
  20: 'High',
  50: 'Medium',
  90: 'Low',
  100: 'No',
}
const qualityToSizeName = {
  20: 'Small',
  50: 'Medium',
  90: 'Large',
  100: 'Largest',
}

const CompressionBucketsList = ({ compressionBuckets, sampleImages }) => {
  const { small, medium, large } = compressionBuckets
  const smallImages = samplesThatMatchBucket(sampleImages, small?.images?.[0])
  const mediumImages = samplesThatMatchBucket(sampleImages, medium?.images?.[0])
  const largeImages = samplesThatMatchBucket(sampleImages, large?.images?.[0])

  const createListOfOptions = (images) => (
    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', padding: 1, paddingTop: 0 }}>
      {images.length === 0 && <Box sx={{ fontStyle: 'italic' }}>No images in this bucket</Box>}
      {images.map((image) => (
        <CompressionOption
          key={image}
          image={`${baseURL}/ingest/sample/${encodeURIComponent(image.file_name)}`}
          compression={qualityToCompressionName[image.jpeg_quality]}
          fileSize={qualityToSizeName[image.jpeg_quality]}
        />
      ))}
    </Box>
  )

  return (
    <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
      <Box sx={{ fontSize: '20px', marginLeft: 1 }}>Small Images Bucket</Box>
      {createListOfOptions(smallImages)}

      <Box sx={{ fontSize: '20px', marginLeft: 1, marginTop: 1 }}>Medium Images Bucket</Box>
      {createListOfOptions(mediumImages)}

      <Box sx={{ fontSize: '20px', marginLeft: 1, marginTop: 1 }}>Large Images Bucket</Box>
      {createListOfOptions(largeImages)}
    </Box>
  )
}

export default CompressionBucketsList
