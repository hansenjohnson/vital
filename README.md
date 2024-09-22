# VITAL - Video and Image Tool for tracking Animal Lives

The New England Aquarium contracted custom-made software to manage, ingest, and annotate images and videos of marine mammals. This suite can be forked, cusomtized, or used by any group of individuals looking to track the images, videos, and datasets associated with animals of any kind.

There are two sub-tools: a Video Annotation and Recall Tool, and a Media Ingestion Tool.

### Application Technology

There is a Javascript frontend, running within an Electron container, and a python backed that runs as a separate process and acts as a web server. Seamless bitrate-adaptive video playback is made possible by DASH web technologies.

UI Frameworks: Vite, React, Material UI

Server Frameworks: Flask, SQLite

### Compatability

This software is built specifically for **Windows 11 64-bit** computers. It may or may not work on earlier/later versions of Windows.

Given the flexibility of Electron, it would be fairly easy to add support for other Operating Systems & Versions, but you would need to use specific prebuilt 3rd Party Executables for that OS/Version as well (also fairly easy).

## Source Code Structure

VITAL is built like a webapp with the intention that it might be migrated to a real website & webserver someday.

- `/electron` -- electron specific files such as main, window, renderer

  - The renderer process (aka DOM) is exposed via an [electron-vite](https://electron-vite.org/) build
  - The main electron process kicks off the python sub-process
  - We try to minimize Operating System API use from electron to make it easier to migrate to a full webapp in the future

- `/python` -- the "backend" of the app, which acts as a webserver with various long-running processes run in separate python threads, or as sub-processes.

  - Most Interactions with the operating system happen here
  - REST API communication code
  - A model for interacting with all of the Excel-file-as-Data-Tables, with our own internal SQL representation
  - Image/Video processing code to parse metadata, apply color correction, convert images, and transcode videos
  - A Queue for media processing, with scheduling mechanics and more

- `/ui` -- a javascript React app with a standard split of Containers & Components. Containers interact with the State Store ([Zustand](https://github.com/pmndrs/zustand)), whereas components are purely for rendering props.

  - Multiple state stores to separate concerns
  - Main Rendering surfaces are: Navbar, Sidebar, Body, Dialog for Contextual choices or Transient info, Dialog for Alerts/Warnings/Confirmations
  - A fair bit of logic relating to DASH video playback and syncing the video player with our custom linkage-region-bar

## Local Development

**Pre-requisites**

- Install python >= `3.12`
- Install nodejs >= `20.11`
- `git clone` this repository

**Add 3rd Party Executables**

- Download the latest FFmpeg of type "win64 gpl" from: https://github.com/BtbN/FFmpeg-Builds/releases
  - Unzip
  - Move `bin/ffmpeg.exe` to `python/resources`
  - Move `bin/ffprobe.exe` to `python/resources`
- Build mp4box using Visual Studio, follow these instructions: https://wiki.gpac.io/Build/build/GPAC-Build-Guide-for-Windows/
  - Move the built `mp4box.exe` to `python/resources`
- Download exiftool from: https://exiftool.org/
  - Unzip
  - rename `exiftool(-k).exe` to `exiftool.exe`
  - Move `exiftool.exe` to `python/resources`
  - Move folder `exiftool_files` to `python/resources`
- Download the latest Imagemagick of type: "Portable Win64 static at 8 bits-per-pixel component." from: https://imagemagick.org/script/download.php#windows
  - Unzip
  - Move `magick.exe` to `python/resources`

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

- This software uses code of [FFmpeg](http://ffmpeg.org) licensed under the [GPLv2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html) and its source can be downloaded [here](https://www.ffmpeg.org/download.html)
- This software uses code of [GPAC](https://gpac.io/) licensed under the [LGPLv2.1](https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html) and its source can be downloaded [here](https://github.com/gpac/gpac)
- This software uses code of [ExifTool](https://exiftool.org) that simply extends the GPL license from Perl, seen [here](https://dev.perl.org/licenses/)
- This software uses code of [ImageMagick](https://imagemagick.org/) licensed under the [ImageMagick License](https://imagemagick.org/script/license.php).
- [Folder icon created by kmg design - Flaticon](https://www.flaticon.com/free-icons/folder)
