const softerRed = 'rgba(240, 10, 10, 0.9)'
const lineWidth = 4

export const drawArrow = (ctx, point1, point2) => {
  ctx.strokeStyle = softerRed
  ctx.lineWidth = lineWidth
  ctx.beginPath()
  ctx.moveTo(point1.x, point1.y)
  ctx.lineTo(point2.x, point2.y)
  ctx.stroke()

  // Drawing the arrowhead looks weird if the line is too short
  const currentLineLength = Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  )
  if (currentLineLength < 30) return

  // Draw Arrowhead
  const arrowHeadLength = 20
  const arrowAngle = Math.atan2(point2.y - point1.y, point2.x - point1.x)
  const arrowAngleLess30 = arrowAngle - Math.PI / 6
  const arrowAnglePlus30 = arrowAngle + Math.PI / 6
  ctx.beginPath()
  ctx.moveTo(
    point2.x - arrowHeadLength * Math.cos(arrowAngleLess30),
    point2.y - arrowHeadLength * Math.sin(arrowAngleLess30)
  )
  ctx.lineTo(point2.x, point2.y)
  ctx.lineTo(
    point2.x - arrowHeadLength * Math.cos(arrowAnglePlus30),
    point2.y - arrowHeadLength * Math.sin(arrowAnglePlus30)
  )
  ctx.stroke()
}

export const drawEllipse = (ctx, point1, point2) => {
  const radiusX = Math.abs(point2.x - point1.x) / 2
  const radiusY = Math.abs(point2.y - point1.y) / 2
  const x = Math.min(point1.x, point2.x) + radiusX
  const y = Math.min(point1.y, point2.y) + radiusY

  ctx.strokeStyle = softerRed
  ctx.lineWidth = lineWidth
  ctx.beginPath()
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2)
  ctx.stroke()
}

export const absolutePointToRelative = (absolutePoint, rect) => ({
  x: absolutePoint.x / rect.width,
  y: absolutePoint.y / rect.height,
})

export const relativePointToAbsolute = (relativePoint, rect) => ({
  x: relativePoint.x * rect.width,
  y: relativePoint.y * rect.height,
})

export const NORMALIZED_PRECISION = 4 // number of decimal places to keep when normalizing
