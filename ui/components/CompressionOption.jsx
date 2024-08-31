import Box from '@mui/material/Box'
import Radio from '@mui/material/Radio'

import { bytesToSize } from '../utilities/strings'

const CompressionOption = ({
  image,
  compression,
  fileSize,
  savings,
  selected,
  onClick,
  imageLoaded,
}) => {
  const savingsBytes = savings || 0
  return (
    <Box
      sx={{
        padding: 0.5,
        borderRadius: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '200px',
          overflow: 'hidden',
          '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 'calc(100% - 6px)',
            borderRadius: 0.5,

            cursor: 'pointer',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
            opacity: 0,
            transition: 'opacity 0.15s',

            content: '"click to enlarge"',
            filter: `drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.8))`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '&:hover': {
            '&::after': {
              opacity: 1,
            },
          },
        }}
      >
        <Box
          component="img"
          src={image}
          onLoad={imageLoaded}
          sx={{ width: '200px', borderRadius: 0.5 }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
        <Radio
          size="small"
          checked={selected}
          onChange={(event) => onClick(event.target.checked)}
        />
        <Box sx={{ fontSize: '14px' }}>
          <Box sx={{ lineHeight: '16px' }}>{compression} compression</Box>
          <Box sx={{ lineHeight: '16px' }}>{fileSize} file size</Box>
          <Box sx={{ lineHeight: '16px' }}>
            Savings: {savingsBytes === 0 ? '' : '~'}
            {bytesToSize(savingsBytes)}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CompressionOption
