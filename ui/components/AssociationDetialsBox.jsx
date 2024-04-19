import Box from '@mui/material/Box'

const AssociationsDetailsBox = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={(theme) => ({
          height: `calc(100% - ${theme.spacing(2)})`,
          margin: 1,
          padding: 1.5,
          paddingTop: 1,
          borderRadius: 1,
          backgroundColor: 'background.paper',
        })}
      >
        <Box>
          Region
          <br />
          some region
        </Box>
        <Box>
          Sighting
          <br />
          some sighting
        </Box>
        <Box>
          Annotations
          <br />
          some annotation
        </Box>
      </Box>
    </Box>
  )
}

export default AssociationsDetailsBox
