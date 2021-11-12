@echo off

mkdir "%~dp0out"
call emcc -o "%~dp0out\lib.js" "%~dp0lib.c"
node "%~dp0..\bin\emwrap.js" --name=lib -o "%~dp0out\lib.umd.js" "%~dp0out\lib.js"
node "%~dp0..\bin\emwrap.js" --module=esm -o "%~dp0out\lib.esm.js" "%~dp0out\lib.js"
