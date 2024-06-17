import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'

import { DRAWING } from '../constants/tools'
import {
  drawArrow,
  drawEllipse,
  absolutePointToRelative,
  relativePointToAbsolute,
  NORMALIZED_PRECISION,
} from '../utilities/drawing'
import DrawingConfirmationChip from './DrawingConfirmationChip'

const AnnotationDrawingLayer = ({ rect, tool, addAnnotation, disabled = false }) => {
  // any reset needs
  useEffect(() => {
    if (tool === DRAWING.POINTER) {
      setDragStart(null)
      setPointerPosition(null)
      setConfirming(false)
    }
  }, [tool])

  // Canvas Initialization
  const dpr = window.devicePixelRatio || 1
  const canvasRef = useRef(null)
  const { width: canvasWidth, height: canvasHeight } = rect || { width: 0, height: 0 }

  // Pointer Events
  const [drawing, setDrawing] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [pointerPosition, setPointerPosition] = useState(null)
  const [disabledPosition, setDisabledPosition] = useState(null)
  const handlePointerDown = (event) => {
    if (confirming) return
    setDrawing(true)
    const relativePoint = absolutePointToRelative(
      { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY },
      rect
    )
    setDragStart(relativePoint)
    setPointerPosition(relativePoint)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (event) => {
    if (disabled) {
      setDisabledPosition({ x: event.clientX, y: event.clientY })
    }
    if (!dragStart || !drawing || confirming) return
    const relativePoint = absolutePointToRelative(
      { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY },
      rect
    )
    setPointerPosition(relativePoint)
  }

  const handlePointerUp = () => {
    setDrawing(false)
    setConfirming(true)
    window.removeEventListener('pointerup', handlePointerUp)
  }

  const handlePointerOut = () => {
    setDisabledPosition(null)
  }

  // Main Drawing Loop
  useEffect(() => {
    if (!canvasRef.current) return
    if (tool === DRAWING.POINTER) return
    const canvas = canvasRef.current

    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!dragStart) return

    const absolutePoint1 = relativePointToAbsolute(dragStart, rect)
    const absolutePoint2 = relativePointToAbsolute(pointerPosition, rect)

    if (tool === DRAWING.ARROW) {
      drawArrow(ctx, absolutePoint1, absolutePoint2)
    } else if (tool === DRAWING.ELLIPSE) {
      drawEllipse(ctx, absolutePoint1, absolutePoint2)
    }
  }, [tool, dpr, JSON.stringify(rect), JSON.stringify(dragStart), JSON.stringify(pointerPosition)])

  // Completion Events
  const [confirming, setConfirming] = useState(false)
  const onKeep = () => {
    addAnnotation({
      type: tool,
      x1: dragStart.x.toFixed(NORMALIZED_PRECISION),
      y1: dragStart.y.toFixed(NORMALIZED_PRECISION),
      x2: pointerPosition.x.toFixed(NORMALIZED_PRECISION),
      y2: pointerPosition.y.toFixed(NORMALIZED_PRECISION),
    })
    onDelete()
  }
  const onDelete = () => {
    setConfirming(false)
    setDragStart(null)
    setPointerPosition(null)
  }
  const confirmationDialogPosition = (() => {
    const positionObject = { side: 'right', left: 20, top: 20 }
    if (!confirming) return positionObject
    if (tool === DRAWING.POINTER) return positionObject

    const { x: x1, y: y1 } = relativePointToAbsolute(dragStart, rect)
    const { x: x2, y: y2 } = relativePointToAbsolute(pointerPosition, rect)

    const allowanceNeeded = 100 + 12 // 12 for margin between buttons and graphic
    const leftEdge = Math.min(x1, x2)
    const rightEdgeFromLeft = Math.max(x1, x2)
    const rightEdge = canvasWidth - rightEdgeFromLeft
    const topEdge = Math.min(y1, y2)
    const bottomEdge = Math.max(y1, y2)
    const middle = (bottomEdge - topEdge) / 2 + topEdge

    positionObject.top = middle - 30
    if (rightEdge > allowanceNeeded) {
      positionObject.side = 'right'
      positionObject.left = rightEdgeFromLeft
    } else if (leftEdge > allowanceNeeded) {
      positionObject.side = 'left'
      positionObject.left = leftEdge - 100
    }

    return positionObject
  })()

  if (tool === DRAWING.POINTER) return null
  return (
    <Box
      sx={{
        position: 'fixed',
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        userSelect: 'none',
        cursor: disabled ? 'not-allowed' : 'crosshair',
        zIndex: 8,
        // useful for debugging
        // backgroundColor: 'rgba(255, 0, 0, 0.3)',
      }}
      onPointerDown={disabled ? undefined : handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <canvas
        ref={canvasRef}
        width={canvasWidth * dpr}
        height={canvasHeight * dpr}
        style={{ width: `${canvasWidth}px`, height: `${canvasHeight}px` }}
      />

      {confirming && (
        <Box
          sx={{
            position: 'absolute',
            top: confirmationDialogPosition.top,
            left: confirmationDialogPosition.left,
            width: '100px',
            marginLeft: confirmationDialogPosition.side === 'right' ? 1 : -1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: confirmationDialogPosition.side === 'right' ? 'flex-start' : 'flex-end',
            gap: 0.5,
          }}
        >
          <DrawingConfirmationChip
            label="Keep"
            icon={<CheckIcon sx={{ fontSize: 'inherit', color: 'success.main' }} />}
            onClick={onKeep}
          />
          <DrawingConfirmationChip
            label="Delete"
            icon={<ClearIcon sx={{ fontSize: 'inherit', color: 'error.main' }} />}
            onClick={onDelete}
          />
        </Box>
      )}

      {disabled && disabledPosition && (
        <Box
          sx={(theme) => ({
            position: 'fixed',
            top: `calc(${disabledPosition.y}px + ${theme.spacing(1)})`,
            left: `calc(${disabledPosition.x}px + ${theme.spacing(1)})`,
          })}
        >
          <DrawingConfirmationChip
            label={
              <Box sx={{ marginRight: 0.5, color: 'error.main' }}>Outside of Video Region</Box>
            }
          />
        </Box>
      )}
    </Box>
  )
}

export default AnnotationDrawingLayer
