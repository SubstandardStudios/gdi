@ECHO OFF
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION
SET parent=%~dp0
SET counter=0

FOR %%X in (%parent%*.png) DO (
	REN %%X !random!.png
)

FOR %%X in (%parent%*.png) DO (
	REN %%X !counter!.png
	set /a counter+=1
)