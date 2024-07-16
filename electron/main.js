import path from 'path'
import { app, shell, BrowserWindow } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import log from 'electron-log/main'
import ElectronStore from 'electron-store'

import { launchPythonServer, killPythonServer } from './childProcesses'

log.initialize()
log.info(`App Launched at  ${new Date()}`)

const settings = new ElectronStore()

let pythonServer

function createWindow() {
  const { x, y, width, height, isMaximized } = settings.get('window') || {}
  const mainWindow = new BrowserWindow({
    x: x || undefined,
    y: y || undefined,
    width: width || 1200,
    height: height || 800,
    show: true,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#16A7B3',
      symbolColor: '#ffffff',
      height: 36,
    },
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      sandbox: false,
      contextIsolation: true,
    },
  })
  if (isMaximized) {
    mainWindow.maximize()
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (process.env.OPEN_DEVTOOLS === 'true' && is.dev) {
    mainWindow.webContents.openDevTools({ mode: 'right' })
  }

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('close', () => {
    const { x, y, width, height } = mainWindow.getBounds()
    const isMaximized = mainWindow.isMaximized()
    settings.set('window', { x, y, width, height, isMaximized })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.new-england-aquarium')

  // Open or close DevTools by F12 in development and ignore CommandOrControl + R in prod
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  pythonServer = launchPythonServer()

  createWindow()
})

app.on('before-quit', () => {
  killPythonServer(pythonServer)
})

// Quit when all windows are closed
app.on('window-all-closed', () => {
  app.quit()
})

// Import/instantiate app specific main process here
import './dialogs'
import './window'
