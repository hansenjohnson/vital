import { createTheme } from '@mui/material/styles'

const defaultTheme = createTheme()

const theme = createTheme({
  palette: {
    mode: 'dark',

    background: {
      default: '#1E1E1E',
      paper: '#1E1E1E',
    },

    primary: {
      dark: '#16A7B3',
      main: '#51CCD3',
      light: '#B2EAEB',
      contrastText: '#fff',
    },

    secondary: {
      dark: '#107BD5',
      main: '#00AFFF',
      light: '#B4E7FF',
    },

    // augmentColor is a step that Material-UI automatically does for the standard palette colors.
    tertiary: defaultTheme.palette.augmentColor({
      color: {
        dark: '#16B36F',
        main: '#6DCA9A',
        light: '#C1E7D2',
      },
      name: 'tertiary',
    }),
  },

  spacing: 12,
  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: "'Ubuntu', sans-serif",
  },
})

export default theme
