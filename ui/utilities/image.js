const thumbnailFromAgnosticImage = (
  someImageSource,
  outputWidth,
  outputHeight,
  outputHeightWithProperAspectRatio
) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    canvas.width = outputWidth
    canvas.height = outputHeight

    const ctx = canvas.getContext('2d')
    ctx.drawImage(someImageSource, 0, 0, outputWidth, outputHeightWithProperAspectRatio)
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      'image/jpeg',
      0.8
    )
  })

export const thumbnailFromVideoElement = (videoElement, outputWidth, outputHeight = null) => {
  const { videoWidth, videoHeight } = videoElement
  const outputHeightWithProperAspectRatio = outputWidth * (videoHeight / videoWidth)
  return thumbnailFromAgnosticImage(
    videoElement,
    outputWidth,
    outputHeight || outputHeightWithProperAspectRatio,
    outputHeightWithProperAspectRatio
  )
}

export const thumbnailFromBitmap = (bitmap, outputWidth, outputHeight = null) => {
  const { width: inputWidth, height: inputHeight } = bitmap
  const outputHeightWithProperAspectRatio = outputWidth * (inputHeight / inputWidth)
  return thumbnailFromAgnosticImage(
    bitmap,
    outputWidth,
    outputHeight || outputHeightWithProperAspectRatio,
    outputHeightWithProperAspectRatio
  )
}
