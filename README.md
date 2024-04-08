# video-catalog-suite

New England Aquarium has requested custom-made software to manage, ingest, and annotate images and videos of marine mammals. There are two sub-tools: a Video Annotation and Recall Tool, and a Data Ingestion Tool.

## Local Development

There is an Javascript frontend, running within an Electron container, and a python backed that runs as a separate process and acts as a web server.

**Pre-requisites**

- Install python >= `3.12`
- Install nodejs >= `20.11`
- `git clone` this repository
- Download [video_data_blank](https://docs.google.com/spreadsheets/d/1-H_4MKgTKCH0FXSmXvH-JL7M8vyCJkocljIGnYStL3s/edit?usp=sharing) as an `.xlsx` file and place within the `.\test-files\` folder

**Running**

- `npm install`
- `pip install -r requirements.txt`
- `npm start`

## Production

**Build the executable**

- Complete the _Local Development_ steps (ignore `npm start`)
- Run `.\build.cmd`

**Running**

- Go to `dist\electron-win32-x64\electron.exe` and double click
- The app should open an run as an executable
- Exiting closes the app and the python `server.exe`
