@echo off

set out="%~dp0out"
if not exist %out% mkdir %out%

@REM node "%~dp0..\bin\emwrap.js" --name=lib --script="%~dp0scripts\umd.js" -o "%out%\lib.umd.js" "%out%\lib.js"
call emcc -O3 -o "%out%\lib.umd.js" "%~dp0lib.c" --js-transform "emwrap.cmd --name=lib --script '%~dp0scripts\umd.js'"

call emcc -O3 -o "%out%\lib.esm.js" "%~dp0lib.c"
node "%~dp0..\bin\emwrap.js" --module=esm --minify --script="%~dp0scripts\esm.js" "%out%\lib.esm.js"
call npx webpack --config "%~dp0webpack.config.js"
