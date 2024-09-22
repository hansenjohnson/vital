import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Pagination from '@mui/material/Pagination'

import { baseURL } from '../api/config'

const PAGE_SIZE = 16

const DarkSampleDialog = ({ open, onClose, images, selectedImages, setSelectedImages }) => {
  const [page, setPage] = useState(1)

  const imagesSlice = useMemo(() => {
    return images.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  }, [JSON.stringify(images), page, PAGE_SIZE])

  const handleClose = () => {
    onClose()
    // It's okay to run this on the next tick because we expect this component to stay mounted
    setTimeout(() => setPage(1))
  }

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { maxHeight: '85vh', height: images.length > PAGE_SIZE ? '85vh' : 'undefined' },
      }}
    >
      <DialogTitle>
        <Box>
          Select Images to Auto-Correct
          <Box component="span" sx={{ marginLeft: 2, color: 'secondary.main', fontSize: '16px' }}>
            {Object.keys(selectedImages).length} images selected
          </Box>
        </Box>
        <Box sx={{ fontSize: '12px', fontWeight: 300 }}>
          Below are the proofs of the dark images with auto-correct already applied
        </Box>
      </DialogTitle>

      <IconButton
        onClick={handleClose}
        size="small"
        sx={(theme) => ({
          position: 'absolute',
          right: theme.spacing(1),
          top: theme.spacing(1),
        })}
      >
        <CloseIcon sx={{ fontSize: '30px' }} />
      </IconButton>

      <DialogContent
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {imagesSlice.map((image) => (
          <Box key={image.file_name} sx={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              color="secondary"
              checked={image.file_name in selectedImages}
              onChange={(event, checked) => {
                if (checked) {
                  const newSelectedImages = { ...selectedImages, [image.file_name]: true }
                  setSelectedImages(newSelectedImages)
                } else {
                  const newSelectedImages = { ...selectedImages }
                  delete newSelectedImages[image.file_name]
                  setSelectedImages(newSelectedImages)
                }
              }}
            />
            <Box
              component="img"
              src={`${baseURL}/ingest/dark_sample/${encodeURIComponent(image.file_name)}`}
              sx={{ width: '200px', borderRadius: 0.5 }}
            />
          </Box>
        ))}
      </DialogContent>

      <DialogActions>
        <Pagination
          count={Math.ceil(images.length / PAGE_SIZE)}
          siblingCount={2}
          page={page}
          onChange={(event, newPage) => setPage(newPage)}
          shape="rounded"
        />
        <Button variant="text" color="secondary" onClick={handleClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DarkSampleDialog
