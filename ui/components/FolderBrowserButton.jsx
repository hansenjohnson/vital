import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

const FolderBrowserButton = ({ selected, onClick, children }) => (
  <ListItem disablePadding sx={{ borderRadius: 1, backgroundColor: selected && 'secondary.main' }}>
    <ListItemButton onClick={onClick} sx={{ borderRadius: 1 }}>
      <ListItemText
        primary={children}
        primaryTypographyProps={{ sx: (theme) => ({ fontFamily: theme.typography.monoFamily }) }}
      />
    </ListItemButton>
  </ListItem>
)

export default FolderBrowserButton
