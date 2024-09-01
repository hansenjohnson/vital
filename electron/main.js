import { writeFileSync } from 'node:fs'
import path from 'path'
import { app, shell, BrowserWindow, powerSaveBlocker, dialog } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import log from 'electron-log/main'
import ElectronStore from 'electron-store'

import { launchPythonServer, killPythonServer } from './childProcesses'

const logFilePath = log?.transports?.file?.getFile()?.path
writeFileSync(logFilePath, '')
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
    show: false,
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

  // Register event handlers before calling any actions in-line
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.show()
  })

  mainWindow.on('show', () => {
    // Apply the Maximize setting if it was saved this way
    // Only call this once the window is shown since this secrely shows the window if it is not already
    if (isMaximized) {
      mainWindow.maximize()
    }
  })

  let completlyReadyToQuit = false

  mainWindow.on('close', async (event) => {
    if (!completlyReadyToQuit) {
      event.preventDefault()

      let queueStatus = false
      try {
        const response = await fetch('http://127.0.0.1:5000/queue/status')
        queueStatus = await response.json()
      } catch (error) {
        log.error('Error fetching queue status:', error)
      }

      if (queueStatus.is_running) {
        const response = dialog.showMessageBoxSync(mainWindow, {
          type: 'warning',
          buttons: ['Cancel', 'Yes'],
          defaultId: 1,
          title: 'Confirm Quit',
          message: 'The Job Queue is currently running. Are you sure you want to quit?',
          noLink: true,
        })
        if (response === 0) {
          return
        }
      }

      completlyReadyToQuit = true
      app.quit()
      return
    }

    const bounds = mainWindow.getBounds()
    const newIsMaximized = mainWindow.isMaximized()
    if (newIsMaximized) {
      // use previously saved values so that unmaximizing restores the window to the correct size
      settings.set('window', { x, y, width, height, isMaximized: newIsMaximized })
    } else {
      settings.set('window', {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        isMaximized: newIsMaximized,
      })
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // --- Perform Window Actions Below this line ---

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // HMR from electron-vite in development
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    // pre-built local html file in production
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  if (process.env.OPEN_DEVTOOLS === 'true' && is.dev) {
    mainWindow.webContents.openDevTools({ mode: 'right' })
  }
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

  powerSaveBlocker.start('prevent-app-suspension')
})

// Quit when all windows are closed
app.on('window-all-closed', async () => {
  await killPythonServer(pythonServer)
  app.quit()
})

// Import/instantiate app specific main process here
import './dialogs'
import './window'
