import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import { bytesToSize, completionTimeString } from '../utilities/strings'

const TEN_DAYS = 10 * 24 * 60 * 60 * 1000

const monoStyle = (theme) => ({
  fontFamily: theme.typography.monoFamily,
  fontSize: '14px',
})

const JobReportPad = ({ open, onClose, parent, jobName, completedAt, data, onExport }) => {
  const [top, setTop] = useState(0)
  const [maxHeight, setMaxHeight] = useState(0)
  const [delayedSlide, setDelayedSlide] = useState(false)

  useEffect(() => {
    if (open) {
      const parentDialogBox = parent.getBoundingClientRect()
      setTop(parentDialogBox.top)
      setMaxHeight(parentDialogBox.height)
      setTimeout(() => setDelayedSlide(true), 0)
    } else {
      setDelayedSlide(false)
    }
  }, [open])

  const handleClose = () => {
    setDelayedSlide(false)
    setTimeout(onClose, 0)
  }

  const olderThan10Days = new Date() - new Date(completedAt) > TEN_DAYS

  const [exporting, setExporting] = useState(false)
  const [exportSucccess, setExportSuccess] = useState(false)
  const triggerExport = async () => {
    setExporting(true)
    const result = await onExport()
    setExporting(false)
    setExportSuccess(result)
  }
  useEffect(() => {
    setExportSuccess(false)
  }, [JSON.stringify(data)])

  let exportText = 'Export CSV of Re-names'
  if (olderThan10Days) {
    exportText = 'Export Not Available'
  } else if (exporting) {
    exportText = 'Exporting...'
  } else if (exportSucccess) {
    exportText = 'Exported Successfully!'
  }

  return (
    <Dialog
      open={open}
      disablePortal
      hideBackdrop
      PaperProps={{
        sx: {
          position: 'fixed',
          padding: 2,
          width: '450px',
          maxHeight: maxHeight ? `${maxHeight}px` : undefined,
          marginTop: 0,
          top: `${top}px`,
          left: delayedSlide ? 'calc(50% + 48px)' : 'calc(50% + 48px + 450px)',
          transition: 'left 0.3s ease',

          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 1,
        },
      }}
      slotProps={{
        root: { sx: { width: 0 } },
      }}
    >
      <IconButton
        onClick={handleClose}
        size="small"
        sx={(theme) => ({
          position: 'absolute',
          right: theme.spacing(1),
          top: theme.spacing(1.7),
        })}
      >
        <CloseIcon sx={{ fontSize: '24px' }} />
      </IconButton>

      <Box
        sx={(theme) => ({
          width: '90%',
          fontFamily: theme.typography.monoFamily,
        })}
      >
        <Box component="span" sx={{ color: 'primary.main' }}>
          Job Report
        </Box>
        <br />
        {jobName}
        <br />
        <Box component="span" sx={{ fontSize: '14px', color: 'text.secondary' }}>
          Completed on {completionTimeString(completedAt)}
        </Box>
      </Box>

      <Box>
        <Box sx={{ color: 'text.secondary' }}>Source Folder</Box>
        <Box sx={monoStyle}>{data.source_folder_path}</Box>
        <Box sx={monoStyle}>Total Size: {bytesToSize(data.source_folder_size)}</Box>
        <Box sx={monoStyle}>{data.source_folder_media_count} files</Box>
      </Box>

      <Box>
        <Box sx={{ color: 'text.secondary' }}>Originals Output</Box>
        <Box sx={monoStyle}>{data.original_folder_path}</Box>
        <Box sx={monoStyle}>Total Size: {bytesToSize(data.original_folder_size)}</Box>
        <Box sx={monoStyle}>{data.original_folder_media_count} files</Box>
      </Box>

      <Box>
        <Box sx={{ color: 'text.secondary' }}>Optimized Output</Box>
        <Box sx={monoStyle}>{data.optimized_folder_path}</Box>
        <Box sx={monoStyle}>Total Size: {bytesToSize(data.optimized_folder_size)}</Box>
        <Box sx={monoStyle}>{data.optimized_folder_media_count} files</Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={triggerExport}
          sx={{ textTransform: 'none' }}
          disabled={exporting || exportSucccess || olderThan10Days}
        >
          {exportText}
        </Button>
        <Box sx={{ color: 'text.secondary', fontSize: '14px', lineHeight: '14px' }}>
          Only available for 10 days
        </Box>
      </Box>
    </Dialog>
  )
}

export default JobReportPad
