import path from 'path'
import child_process from 'child_process'
import { is } from '@electron-toolkit/utils'

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
      console.log(err)
    }
    if (stdout) {
      console.log(stdout)
    }
    if (stderr) {
      console.log(stderr)
    }
  }

  const backend = path.join(process.cwd(), 'resources/app/bin/server.exe')
  child_process.execFile(backend, { windowsHide: true }, processCallback)
  return null
}

const killPythonServer = (pythonServer) => {
  if (is.dev) {
    console.log('Killing python server')
    pythonServer.kill('SIGINT')
    pythonServer.kill('SIGKILL')
  } else {
    child_process.exec('taskkill /f /t /im server.exe', (err, stdout, stderr) => {
      if (err) {
        console.log(err)
        return
      }
      console.log(`stdout: ${stdout}`)
      console.log(`stderr: ${stderr}`)
    })
  }
}

export { launchPythonServer, killPythonServer }
