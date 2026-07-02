@echo off
cd /d "%~dp0"
title Iniciar Entorno Chango Dia
echo ========================================================
echo   INICIANDO ASISTENTE DE COMPRAS CHANGO DIA ARGENTINA   
echo ========================================================
echo.

:: Verificar si Python esta instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python no esta instalado o no se encuentra en el PATH.
    echo El servidor proxy local no podra iniciarse para el bypass de CORS.
    echo La aplicacion usara la base de datos simulada en el navegador.
    echo.
    pause
)

:: Verificar si node_modules existe
if not exist "node_modules\" (
    echo [INFO] No se encontro la carpeta node_modules. Instalando dependencias...
    call npm install
)

echo.
echo [1/2] Iniciando Servidor Proxy FastAPI (Puerto 8000)...
start "Proxy FastAPI - Chango Dia" cmd /c "python servidor_chango.py"

echo [2/2] Iniciando Servidor de Desarrollo Vite (Puerto 5173)...
start "Vite Frontend - Chango Dia" cmd /c "npm run dev"

echo.
echo ========================================================
echo   TODO LISTO!
echo   * El navegador se abrira en: http://localhost:5173
echo   * El proxy API se ejecuta en: http://127.0.0.1:8000
echo ========================================================
echo.
pause
