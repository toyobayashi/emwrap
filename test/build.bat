@echo off

set out="%~dp0out"
if not exist %out% mkdir %out%

@REM set optimize="-03"
set optimize=

@REM node "%~dp0..\bin\emwrap.js" --name=lib --script="%~dp0scripts\umd.js" -o "%out%\lib.umd.js" "%out%\lib.js"
call emcc %optimize% -o "%out%\lib.umd.js" "%~dp0lib.c" --js-transform "emwrap.cmd --name=lib --script '%~dp0scripts\umd.js'"
call emcc %optimize% -o "%out%\lib.cjs.js" "%~dp0lib.c" --js-transform "emwrap.cmd --module=cjs --script '%~dp0scripts\umd.js'"

call emcc %optimize% -o "%out%\lib.esm.js" "%~dp0lib.c"
node "%~dp0..\bin\emwrap.js" --module=esm --script="%~dp0scripts\esm.js" "%out%\lib.esm.js"
call npx webpack --config "%~dp0webpack.config.js"
