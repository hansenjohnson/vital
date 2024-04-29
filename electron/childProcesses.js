import path from 'path'
import child_process from 'child_process'
import { app } from 'electron'
import { is } from '@electron-toolkit/utils'
import log from 'electron-log/main'

const launchPythonServer = () => {
  if (is.dev) {
    const pythonServer = child_process.spawn('python', ['python/server.py'])

    pythonServer.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`)
    })
    pythonServer.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`)
    })
    pythonServer.on('error', (error) => {
      console.error(`Error starting Python server: ${error}`)
    })

    return pythonServer
  }

  const processCallback = (err, stdout, stderr) => {
    if (err) {
      log.error(err)
    }
    if (stdout) {
      log.info(stdout)
    }
    if (stderr) {
      log.error(stderr)
    }
  }

  const installFolder = path.dirname(path.dirname(app.getAppPath()))
  const backend = path.join(installFolder, 'bin/server.exe')
  log.info(`Launching python server at: ${backend}`)
  child_process.execFile(backend, { windowsHide: true }, processCallback)
  return null
}

const killPythonServer = (pythonServer) => {
  if (is.dev) {
    log.info('Killing python server')
    pythonServer.kill('SIGINT')
    pythonServer.kill('SIGKILL')
  } else {
    child_process.exec('taskkill /f /t /im server.exe', (err, stdout, stderr) => {
      if (err) {
        log.error(err)
        return
      }
      log.info(`stdout: ${stdout}`)
      log.error(`stderr: ${stderr}`)
    })
  }
}

export { launchPythonServer, killPythonServer }
