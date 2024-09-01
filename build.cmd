pip install -r requirements.txt

if not exist bin mkdir bin
if not exist bin\resources mkdir bin\resources
if not exist bin\resources\exiftool_files mkdir bin\resources\exiftool_files

copy /Y python\resources\ bin\resources
copy /Y python\resources\exiftool_files\ bin\resources\exiftool_files

pyinstaller --onefile --distpath bin python/server.py

npm run build:win
