import path from 'path'
import child_process from 'child_process'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import log from 'electron-log/main'

const popularHTTPLogs = [
  new RegExp('/queue/status'),
  new RegExp('/ingest/job/\\d+'),
  new RegExp('/ingest/job/\\d+/tasks'),
]
const TEN_MINUTES = 10 * 60 * 1000

const logSpawnedServer = (server, infoLogger, errorLogger) => {
  server.stdout.on('data', (data) => {
    data = data.toString().trim()
    infoLogger(`Python stdout: ${data}`)
  })

  const recentLines = {}
  server.stderr.on('data', (data) => {
    // NOTE: Flask logs end up here because Flask logs to stderr
    // Skip this log as we send it very frequently and reccuring
    if (data.includes('GET /settings/open_files')) return
    data = data.toString().trim()
    if (data.includes('HTTP')) {
      // Silence popular log lines for 10 minutes
      const popularRegex = popularHTTPLogs.find((regex) => regex.test(data))
      if (popularRegex) {
        if (popularRegex in recentLines) {
          const timeDiff = new Date() - recentLines[popularRegex]
          if (timeDiff < TEN_MINUTES) return
        }
        recentLines[popularRegex] = new Date()
      }

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
    child_process.execSync('taskkill /f /t /im server.exe')
  }
  return
}

export { launchPythonServer, killPythonServer }
