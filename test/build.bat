@echo off

set out="%~dp0out"
if not exist %out% mkdir %out%

set optimize=-O3 -g1 -sMIN_CHROME_VERSION=48 -sUSE_PTHREADS=1 -sPTHREAD_POOL_SIZE=1
@REM set optimize=

@REM node "%~dp0..\bin\emwrap.js" --name=lib --script="%~dp0scripts\umd.js" -o "%out%\lib.umd.js" "%out%\lib.js"
call emcc %optimize% -o "%out%\lib.umd.js" "%~dp0lib.c" --js-transform "emwrap.cmd --name=lib --script '%~dp0scripts\umd.js' --initscript '%~dp0scripts\init.js'"
node "%~dp0..\bin\emwrap.js" --worker --name=lib "%out%\lib.umd.worker.js"

call emcc %optimize% -o "%out%\lib.cjs.js" "%~dp0lib.c" --js-transform "emwrap.cmd --module=cjs --script '%~dp0scripts\umd.js'"
node "%~dp0..\bin\emwrap.js" --worker --module=cjs "%out%\lib.cjs.worker.js"

call emcc %optimize% -o "%out%\lib.esm.js" "%~dp0lib.c"
node "%~dp0..\bin\emwrap.js" --module=esm --script="%~dp0scripts\esm.js" "%out%\lib.esm.js"
node "%~dp0..\bin\emwrap.js" --worker --module=esm "%out%\lib.esm.worker.js"

call emcc %optimize% -o "%out%\lib.mjs.js" "%~dp0lib.c"
node "%~dp0..\bin\emwrap.js" --module=mjs --script="%~dp0scripts\esm.js" --output="%out%\lib.mjs.mjs" "%out%\lib.mjs.js"
node "%~dp0..\bin\emwrap.js" --worker --module=mjs --output="%out%\lib.mjs.worker.mjs" "%out%\lib.mjs.worker.js"
del /Q "%out%\lib.mjs.worker.js"
del /Q "%out%\lib.mjs.js"

call npx webpack --config "%~dp0webpack.config.js"
