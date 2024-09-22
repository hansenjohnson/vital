import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'

import { baseURL } from '../api/config'
import { IMAGE_QUALITIES } from '../constants/fileTypes'
import CompressionOption from './CompressionOption'

const CompressionBucketsList = ({
  compressionBuckets,
  setCompressionSelection,
  sampleImages,
  onImagesLoaded,
}) => {
  const { small, medium, large } = compressionBuckets
  const smallImages = sampleImages.filter((sample) => sample.bucket_name === 'small')
  const mediumImages = sampleImages.filter((sample) => sample.bucket_name === 'medium')
  const largeImages = sampleImages.filter((sample) => sample.bucket_name === 'large')

  const [imagesToLoad, setImagesToLoad] = useState({})
  useEffect(() => {
    setImagesToLoad({
      ...Object.fromEntries(smallImages.map((image) => [image.file_name, false])),
      ...Object.fromEntries(mediumImages.map((image) => [image.file_name, false])),
      ...Object.fromEntries(largeImages.map((image) => [image.file_name, false])),
    })
  }, [JSON.stringify(sampleImages)])

  useEffect(() => {
    if (
      Object.values(imagesToLoad).length > 0 &&
      Object.values(imagesToLoad).every((loaded) => loaded === true)
    ) {
      onImagesLoaded()
    }
  }, [JSON.stringify(imagesToLoad)])

  const setSmallSelection = (newValue) => setCompressionSelection('small', newValue)
  const setMediumSelection = (newValue) => setCompressionSelection('medium', newValue)
  const setLargeSelection = (newValue) => setCompressionSelection('large', newValue)

  /* Rendering Sections */
  const createListOfOptions = (images, selection, setter, size = 0) => (
    <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', padding: 1, paddingTop: 0 }}>
      {images.length === 0 && (
        <Box sx={{ fontStyle: 'italic', color: 'text.disabled' }}>No images in this bucket</Box>
      )}
      {images.map((image) => (
        <CompressionOption
          key={image.file_name}
          image={`${baseURL}/ingest/sample/${encodeURIComponent(image.file_name)}`}
          compression={IMAGE_QUALITIES[image.jpeg_quality].compressionAmount}
          fileSize={IMAGE_QUALITIES[image.jpeg_quality].fileSize}
          savings={size - size * IMAGE_QUALITIES[image.jpeg_quality].compressionRatio}
          imageLoaded={() => {
            setImagesToLoad((prev) => ({ ...prev, [image.file_name]: true }))
          }}
          selected={image.jpeg_quality === selection}
          onClick={() => setter(image.jpeg_quality)}
        />
      ))}
    </Box>
  )

  return (
    <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
      <Box sx={{ fontSize: '20px', marginLeft: 1 }}>Small Images Bucket</Box>
      {createListOfOptions(smallImages, small?.selection, setSmallSelection, small?.size)}

      <Box sx={{ fontSize: '20px', marginLeft: 1, marginTop: 1 }}>Medium Images Bucket</Box>
      {createListOfOptions(mediumImages, medium?.selection, setMediumSelection, medium?.size)}

      <Box sx={{ fontSize: '20px', marginLeft: 1, marginTop: 1 }}>Large Images Bucket</Box>
      {createListOfOptions(largeImages, large?.selection, setLargeSelection, large?.size)}
    </Box>
  )
}

export default CompressionBucketsList
