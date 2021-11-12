@echo off

set out="%~dp0out"
if not exist %out% mkdir %out%
call emcc -o "%out%\lib.js" "%~dp0lib.c"
node "%~dp0..\bin\emwrap.js" --name=lib --script="%~dp0scripts\umd.js" -o "%out%\lib.umd.js" "%out%\lib.js"
node "%~dp0..\bin\emwrap.js" --module=esm --script="%~dp0scripts\esm.js" -o "%out%\lib.esm.js" "%out%\lib.js"
call npx webpack --config "%~dp0webpack.config.js"
