// index.ts
const { app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path');
const url = require('url');
const child_process = require('child_process');
const { exec } = require('child_process');

let mainWindow;
let pythonServer;

const isDevelopment = process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {

  if (isDevelopment) {
    pythonServer = child_process.spawn('python', ['python/server.py'])

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
    backend = path.join(process.cwd(), 'resources/app/bin/python.exe')
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
});


app.on('before-quit', () => { 
  if (!isDevelopment) {
    exec('taskkill /f /t /im python.exe', (err, stdout, stderr) => {
      if (err) {
        console.log(err)
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
      });
  } else {
    console.log('Killing Python python')
    pythonServer.kill('SIGINT');
    pythonServer.kill('SIGKILL');
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
 });


ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Excel', extensions: ['xlsx', 'xls', 'csv'] }],
  }).then((file) => {
    if (!file.canceled) {
      // worksheet will need to input from the client
      event.reply('selected-file', file.filePaths[0], 'Association');
    }
  });
});