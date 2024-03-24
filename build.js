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

async function main() {
  try {
    await createWindowsInstaller({
      appDirectory: path.join(__dirname, '../dist', 'electron_tutorial-win32-x64'),
      outputDirectory: path.join(__dirname, '../dist', 'windows-installer'),
      authors: 'Ben Zendker, Matthew Crawford',
      exe: 'electron_tutorial.exe',
    })
    console.log('Successfully created package at dist/windows-installer')
  } catch (error) {
    console.error(error.message || error)
    process.exit(1)
  }
}
