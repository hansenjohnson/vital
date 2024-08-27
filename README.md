# VITAL - Video and Image Tool for tracking Animal Lives

New England Aquarium has requested custom-made software to manage, ingest, and annotate images and videos of marine mammals. There are two sub-tools: a Video Annotation and Recall Tool, and a Data Ingestion Tool.

**Application Technology**

There is an Javascript frontend, running within an Electron container, and a python backed that runs as a separate process and acts as a web server. Seamless bitrate-adaptive video playback is made possible by DASH web technologies.

UI Frameworks: Vite, React, Material UI

Server Frameworks: Flask, SQLite

## Local Development

**Pre-requisites**

- Install python >= `3.12`
- Install nodejs >= `20.11`
- `git clone` this repository

**Add 3rd Party Executables**

- Download ffmpeg (https://github.com/BtbN/FFmpeg-Builds/releases)
  - Unzip
  - Move `bin/ffmpeg.exe` to `python/resources`
  - Move `bin/ffprobe.exe` to `python/resources`
- Build mp4box using Visual Studio, follow these instructions: https://wiki.gpac.io/Build/build/GPAC-Build-Guide-for-Windows/
  - Move the built `mp4box.exe` to `python/resources`
- Download exiftool (https://exiftool.org/)
  - Unzip
  - rename `exiftool(-k).exe` to `exiftool.exe`
  - Move `exiftool.exe` to `python/resources`
  - Move folder `exiftool_files` to `python/resources`
- Download the latest mozjpeg build from https://github.com/garyzyg/mozjpeg-windows/releases
  - Unzip
  - Move `cjpeg-static.exe` to `python/resources`
- Download the latest LibRaw from https://www.libraw.org/download
  - Unzip
  - Navigate into `.\LibRaw-X.X.X\bin\
  - Move `dcraw_emu.exe` to `python/resources`
  - Move `libraw.dll` to `python/resources`

**Install Source Code Dependencies**

- `npm install`
- `pip install -r requirements.txt`

**Running**

- `npm start`

## Production

**Build the executable**

- Complete the _Local Development_ steps (ignore `npm start`)
- Run `.\build.cmd`

**Running**

- Go to `dist\` and double click the installer `VITAL Setup v#.#.#.exe`
- Once installed, the app can be opened with the desktop icon or start menu shortcut
- Exiting closes the app and the python `server.exe`

## Attributions

- [Folder icon created by kmg design - Flaticon](https://www.flaticon.com/free-icons/folder)
