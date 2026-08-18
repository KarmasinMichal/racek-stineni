@echo off
cd /d "%~dp0"

echo Spoustim lokalni server pro nahled webu...
echo (Az skoncis, zavri toto okno.)
echo.

where python >nul 2>nul
if %ERRORLEVEL%==0 (
    start "" http://localhost:8000/index.html
    python -m http.server 8000
    goto :eof
)

where py >nul 2>nul
if %ERRORLEVEL%==0 (
    start "" http://localhost:8000/index.html
    py -m http.server 8000
    goto :eof
)

where npx >nul 2>nul
if %ERRORLEVEL%==0 (
    start "" http://localhost:8000/index.html
    npx --yes serve -l 8000 .
    goto :eof
)

echo Nenasel jsem Python ani Node.js.
echo Nainstaluj prosim jedno z toho (staci jedno):
echo   - Python:  https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo Pak tento soubor spust znovu.
pause
