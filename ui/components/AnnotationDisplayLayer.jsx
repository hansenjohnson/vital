import { useRef, useEffect } from 'react'
import Box from '@mui/material/Box'

import { DRAWING } from '../constants/tools'
import { drawArrow, drawEllipse } from '../utilities/drawing'

const DRAWING_ON_SCREEN_SECONDS = 1

const AnnotationDisplayLayer = ({ annotations, currentFrame, frameRate, disabled }) => {
  // Canvas Initialization
  const dpr = window.devicePixelRatio || 1
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const { width: canvasWidth, height: canvasHeight } =
    containerRef.current?.getBoundingClientRect() || { width: 0, height: 0 }

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

      if (type === DRAWING.ARROW) {
        drawArrow(ctx, { x: x1, y: y1 }, { x: x2, y: y2 })
      } else if (type === DRAWING.ELLIPSE) {
        drawEllipse(ctx, { x: x1, y: y1 }, { x: x2, y: y2 })
      }
    })
  }, [
    canvasWidth,
    canvasHeight,
    dpr,
    JSON.stringify(annotations),
    drawingOnScreenFrames,
    currentFrame,
  ])

  if (!annotations || !annotations.length || disabled) return null
  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
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
