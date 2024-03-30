// index.ts
const { app, BrowserWindow } = require('electron')
const path = require('path');
const url = require('url');
const child_process = require('child_process');
const { exec } = require('child_process');

const log = require('electron-log');

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

const isDevelopment = process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath);

let pythonServer;

app.on('ready', () => {

  if (isDevelopment) {
    pythonServer = child_process.spawn('python', ['server/server.py'])

    pythonServer.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonServer.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonServer.on('error', (error) => {
      console.error(`Error starting Python server: ${error}`);
    });
  } else {
    let backend;
    backend = path.join(process.cwd(), 'resources/app/bin/server.exe')
    var execfile = child_process.execFile;
    execfile(
      backend,
      {
        windowsHide: true,
      },
      (err, stdout, stderr) => {
        if (err) {
          console.log(err);
        }
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.log(stderr);
        }
      })
  }
  createWindow();
});

app.on('window-all-closed', () => {
  app.quit()
  exec('taskkill /f /t /im server.exe', (err, stdout, stderr) => {
  if (err) {
    console.log(err)
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
  });
  app.quit()
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
 })