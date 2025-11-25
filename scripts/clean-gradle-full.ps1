# Limpieza completa de caché de Gradle (solución agresiva)
Write-Host "=== Limpieza completa de Gradle ===" -ForegroundColor Yellow

# Mata procesos Java/Gradle que puedan estar bloqueando archivos
Write-Host "Deteniendo procesos Java/Gradle..." -ForegroundColor Cyan
Get-Process | Where-Object {$_.ProcessName -match "java|gradle"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Borra TODA la caché de Gradle
$gradleCache = Join-Path $env:USERPROFILE ".gradle\caches"
if (Test-Path $gradleCache) {
    Write-Host "Eliminando caché completo: $gradleCache" -ForegroundColor Red
    Remove-Item -Recurse -Force $gradleCache -ErrorAction SilentlyContinue
    Write-Host "Caché eliminado" -ForegroundColor Green
} else {
    Write-Host "No se encontró caché de Gradle" -ForegroundColor Yellow
}

# Borra daemon
$gradleDaemon = Join-Path $env:USERPROFILE ".gradle\daemon"
if (Test-Path $gradleDaemon) {
    Write-Host "Eliminando daemon: $gradleDaemon" -ForegroundColor Red
    Remove-Item -Recurse -Force $gradleDaemon -ErrorAction SilentlyContinue
}

# Limpia el proyecto Android
if (Test-Path "android") {
    Write-Host "Limpiando proyecto Android..." -ForegroundColor Cyan
    Push-Location android
    
    # Borra carpetas build y .gradle del proyecto
    if (Test-Path "build") {
        Remove-Item -Recurse -Force build -ErrorAction SilentlyContinue
    }
    if (Test-Path ".gradle") {
        Remove-Item -Recurse -Force .gradle -ErrorAction SilentlyContinue
    }
    
    # Ejecuta gradlew clean
    if (Test-Path "gradlew.bat") {
        Write-Host "Ejecutando gradlew clean..." -ForegroundColor Cyan
        & .\gradlew.bat clean --no-daemon
    }
    
    Pop-Location
    Write-Host "Proyecto Android limpio" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Limpieza completa finalizada ===" -ForegroundColor Green
Write-Host "Ahora ejecuta: npx expo run:android" -ForegroundColor Yellow
