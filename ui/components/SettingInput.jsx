import TextField from '@mui/material/TextField'

const SettingInput = ({ label, value, onChange, endAdornment }) => {
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
        endAdornment,
      }}
      label={label}
      value={value}
      onChange={onChange}
    />
  )
}

export default SettingInput
