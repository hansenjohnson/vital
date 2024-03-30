const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const packager = require('electron-packager');
const os = require('os');

const options = {
  dir: '.',
  out: 'dist',
  overwrite: true,
  platform: 'win32'
};

packager(options)
  .then(outPath => console.log(`Packaged electron app at paths: ${outPath}`))
  .catch(err => console.error(err));
