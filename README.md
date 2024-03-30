# video-catalog-suite

PoC for a python backend build
## Local Development
- Make sure to have latest python (3.12.2) and latest node (v20.11.1) installed
- Run npm install and pip install -r requirements.txt
- Run npm start to start the app locally. It is a very simple app that makes a request to the python backend from the frontend
## Build and Run the EXE
- Make sure to have run npm install (couldn't get it running in the build script)
- Run ..\build.cmd
- Go to dist\electron-win32-x64\electron.exe and double click
- The app should open an run in the executable
- Exiting closes the app and server.exe