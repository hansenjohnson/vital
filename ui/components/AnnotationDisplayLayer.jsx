import { useRef, useEffect } from 'react'
import Box from '@mui/material/Box'

import { DRAWING } from '../constants/tools'
import { DRAWING_ON_SCREEN_SECONDS } from '../constants/times'
import { drawArrow, drawEllipse, relativePointToAbsolute } from '../utilities/drawing'

const AnnotationDisplayLayer = ({ rect, annotations, currentFrame, frameRate }) => {
  // Canvas Initialization
  const dpr = window.devicePixelRatio || 1
  const canvasRef = useRef(null)
  const { width: canvasWidth, height: canvasHeight } = rect || { width: 0, height: 0 }

  const drawingOnScreenFrames = DRAWING_ON_SCREEN_SECONDS * frameRate

  // Main Drawing Loop
  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    annotations.forEach((annotation) => {
      const { frame, type, x1, y1, x2, y2 } = annotation

      // Draw the annotation graphic on the frame whence it was drawn
      // and then keep it on the screen for a bit, so the flash isn't so quick
      if (currentFrame < frame || currentFrame > frame + drawingOnScreenFrames) return

      const absolutePoint1 = relativePointToAbsolute({ x: parseFloat(x1), y: parseFloat(y1) }, rect)
      const absolutePoint2 = relativePointToAbsolute({ x: parseFloat(x2), y: parseFloat(y2) }, rect)

      if (type === DRAWING.ARROW) {
        drawArrow(ctx, absolutePoint1, absolutePoint2)
      } else if (type === DRAWING.ELLIPSE) {
        drawEllipse(ctx, absolutePoint1, absolutePoint2)
      }
    })
  }, [dpr, JSON.stringify(rect), JSON.stringify(annotations), drawingOnScreenFrames, currentFrame])

  if (!annotations || !annotations.length || !rect) return null
  return (
    <Box
      sx={{
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        zIndex: 3,
        userSelect: 'none',
        // useful for debugging
        // backgroundColor: 'rgba(255, 0, 0, 0.3)',
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth * dpr}
        height={canvasHeight * dpr}
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
      />
    </Box>
  )
}

export default AnnotationDisplayLayer
