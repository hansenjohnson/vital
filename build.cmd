pip install -r requirements.txt
if not exist bin mkdir bin
pyinstaller --onefile --distpath bin python/server.py

node build.js