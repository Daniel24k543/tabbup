Param()

Write-Host "=== Helper: run-dev-client-windows.ps1 ==="

function Check-Command($cmd) {
    $which = Get-Command $cmd -ErrorAction SilentlyContinue
    return $which -ne $null
}

if (-not (Check-Command adb)) {
    Write-Host "ERROR: 'adb' no está en el PATH. Instala Android platform-tools y añade adb al PATH." -ForegroundColor Red
    exit 1
}

Write-Host "Verificando dispositivos conectados..."
adb devices

Write-Host "Ejecutando adb reverse para conectar el dev-client con Metro..."
adb reverse tcp:8081 tcp:8081 | Out-Null
adb reverse tcp:19000 tcp:19000 | Out-Null
adb reverse tcp:8088 tcp:8088 | Out-Null

Write-Host "Reenvío (reverse) listo. Iniciando Metro en modo dev-client (expo start --dev-client)..."

Write-Host "Si prefieres abrir Metro en otra terminal, cancela ahora (Ctrl+C) y ejecuta 'npm run start:dev-client' manualmente." -ForegroundColor Yellow

npx expo start --dev-client
