import path from 'path'
import child_process from 'child_process'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import log from 'electron-log/main'

const logSpawnedServer = (server, infoLogger, errorLogger) => {
  server.stdout.on('data', (data) => {
    data = data.toString().trim()
    infoLogger(`Python stdout: ${data}`)
  })

  server.stderr.on('data', (data) => {
    // NOTE: Flask logs end up here because Flask logs to stderr
    // Skip this log as we send it very frequently and reccuring
    if (data.includes('GET /settings/open_files')) return
    data = data.toString().trim()
    if (data.includes('HTTP')) {
      infoLogger(`Server: ${data}`)
    } else {
      errorLogger(`Python stderr: ${data}`)
    }
  })

  server.on('error', (error) => {
    error = error.toString().trim()
    errorLogger(`Error starting Python server: ${error}`)
  })
}

const launchPythonServer = () => {
  if (is.dev) {
    const pythonServer = child_process.spawn('python', ['python/server.py'])
    logSpawnedServer(pythonServer, console.log, console.error)
    return pythonServer
  }

  const installFolder = path.dirname(path.dirname(app.getAppPath()))
  const backend = path.join(installFolder, 'bin/server.exe')
  log.info(`Launching python server at: ${backend}`)
  const pythonServer = child_process.spawn(backend, { windowsHide: true })
  logSpawnedServer(pythonServer, log.info, log.error)

  return null
}

const killPythonServer = async (pythonServer) => {
  await fetch('http://127.0.0.1:5000/terminate').catch(() => null)
  if (is.dev) {
    pythonServer.kill('SIGKILL')
  } else {
    child_process.exec('taskkill /f /t /im server.exe')
  }
}

export { launchPythonServer, killPythonServer }
