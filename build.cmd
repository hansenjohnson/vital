pip install -r requirements.txt
if not exist bin mkdir bin
if not exist bin\resources mkdir bin\resources
copy /Y python\resources\ bin\resources
pyinstaller --onefile --distpath bin python/server.py

npm run build:win
