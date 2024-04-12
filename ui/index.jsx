import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import '@fontsource/ubuntu/300.css'
import '@fontsource/ubuntu/400.css'
import '@fontsource/ubuntu/500.css'
import '@fontsource/ubuntu/700.css'
import '@fontsource-variable/sometype-mono' // 400-700

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
