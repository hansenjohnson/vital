// Windows OS adds a 1px border around the control buttons, so we account for that
export const TITLEBAR_HEIGHT = 36 + 0.5

export const SIDEBAR_WIDTH = 400

// Generate the closest whole-pixel value to 16-by-9 at a small width
export const THUMBNAIL_WIDTH = 200
export const THUMBNAIL_HEIGHT = 112 // result of: Math.floor((200 * 9) / 16)
export const THUMBNAIL_CHOICE_WIDTH = THUMBNAIL_WIDTH * 2
export const THUMBNAIL_CHOICE_HEIGHT = THUMBNAIL_HEIGHT * 2

export const STILL_FRAME_PREVIEW_WIDTH = 800

// Metadata Table Dimensions
export const TABLE_HEADER_INNER_HEIGHT = 24
export const TABLE_HEADER_VERT_PAD = 6
export const TABLE_HEADER_BOT_BORDER = 1
export const TABLE_HEADER_HEIGHT =
  TABLE_HEADER_INNER_HEIGHT + TABLE_HEADER_VERT_PAD * 2 + TABLE_HEADER_BOT_BORDER
export const TABLE_ROW_INNER_HEIGHT = 24
export const TABLE_ROW_VERT_PAD = 2
export const TABLE_ROW_BOT_BORDER = 1
export const TABLE_ROW_HEIGHT =
  TABLE_HEADER_INNER_HEIGHT + TABLE_HEADER_VERT_PAD * 2 + TABLE_HEADER_BOT_BORDER
