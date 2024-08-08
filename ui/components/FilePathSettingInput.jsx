import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

const FilePathSettingInput = ({ label, value, onChange, onFolderClick, error, errorMessage }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      margin="dense"
      InputLabelProps={{
        sx: { fontFamily: "'Sometype Mono Variable', monopace" },
      }}
      InputProps={{
        sx: { fontFamily: "'Sometype Mono Variable', monopace" },
        endAdornment: (
          <InputAdornment position="end">
            <IconButton size="small" edge="end" onClick={onFolderClick}>
              <FolderOpenIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ),
      }}
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      helperText={error ? errorMessage : ''}
    />
  )
}

export default FilePathSettingInput
