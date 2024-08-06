import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import App from './App'
import theme from './theme'

import '@fontsource/ubuntu/300.css'
import '@fontsource/ubuntu/400.css'
import '@fontsource/ubuntu/500.css'
import '@fontsource/ubuntu/700.css'
import '@fontsource-variable/sometype-mono' // 400-700

import log from 'electron-log/renderer'
if (window.api.isPackaged()) {
  // Redirect log messages to electron-log in the packaged app (aka Production)
  window.console.log = log.info
  window.console.error = log.error
  window.console.warn = log.warn
  window.console.info = log.info
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
