import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'

import { DRAWING } from '../constants/tools'
import { drawArrow, drawEllipse } from '../utilities/drawing'
import DrawingConfirmationChip from './DrawingConfirmationChip'

const AnnotationDrawingLayer = ({ tool, addAnnotation }) => {
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
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const { width: canvasWidth, height: canvasHeight } =
    containerRef.current?.getBoundingClientRect() || { width: 0, height: 0 }

  // Pointer Events
  const [drawing, setDrawing] = useState(false)
  const [dragStart, setDragStart] = useState(null)
  const [pointerPosition, setPointerPosition] = useState(null)
  const handlePointerDown = (event) => {
    if (confirming) return
    setDrawing(true)
    setDragStart({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY })
    setPointerPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY })
  }

  const handlePointerMove = (event) => {
    if (!dragStart || !drawing || confirming) return
    setPointerPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY })
  }

  const handlePointerUp = () => {
    setDrawing(false)
    setConfirming(true)
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

    if (tool === DRAWING.ARROW) {
      drawArrow(ctx, dragStart, pointerPosition)
    } else if (tool === DRAWING.ELLIPSE) {
      drawEllipse(ctx, dragStart, pointerPosition)
    }
  }, [tool, JSON.stringify(dragStart), JSON.stringify(pointerPosition)])

  // Completion Events
  const [confirming, setConfirming] = useState(false)
  const onKeep = () => {
    addAnnotation({
      type: tool,
      x1: parseInt(dragStart.x, 10),
      y1: parseInt(dragStart.y, 10),
      x2: parseInt(pointerPosition.x, 10),
      y2: parseInt(pointerPosition.y, 10),
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

    const allowanceNeeded = 100 + 12 // 12 for margin between buttons and graphic
    const { width } = containerRef.current.getBoundingClientRect()
    const leftEdge = Math.min(dragStart.x, pointerPosition.x)
    const rightEdgeFromLeft = Math.max(dragStart.x, pointerPosition.x)
    const rightEdge = width - rightEdgeFromLeft
    const topEdge = Math.min(dragStart.y, pointerPosition.y)
    const bottomEdge = Math.max(dragStart.y, pointerPosition.y)
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
      ref={containerRef}
      sx={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        userSelect: 'none',
        zIndex: 8,
        // useful for debugging
        // backgroundColor: 'rgba(255, 0, 0, 0.3)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
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
    </Box>
  )
}

export default AnnotationDrawingLayer
