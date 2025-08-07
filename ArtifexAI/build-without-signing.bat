@echo off
echo Building Artifex.AI without code signing...

REM Disable code signing completely
set CSC_IDENTITY_AUTO_DISCOVERY=false
set WIN_CSC_LINK=
set WIN_CSC_KEY_PASSWORD=
set CSC_LINK=
set CSC_KEY_PASSWORD=

REM Clear electron-builder cache
rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache\winCodeSign" 2>nul

REM Build the application
echo Starting build process...
call npm run build

REM Build portable executable
echo Building portable executable...
call npx electron-builder --win portable --config.win.certificateFile=null --config.win.certificatePassword=null

echo Build complete!
pause