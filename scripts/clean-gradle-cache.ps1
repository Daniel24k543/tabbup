# Limpia caches problemáticos de Gradle y corre gradlew clean
Write-Host "=== Limpiar cache de Gradle y ejecutar gradlew clean ==="

$cacheBase = Join-Path $env:USERPROFILE ".gradle\caches"
$gradleVersion = "8.14.3"
$problemPath = Join-Path $cacheBase (Join-Path $gradleVersion "transforms")

# Intenta eliminar transform específico conocido
$knownTransform = Join-Path $cacheBase (Join-Path $gradleVersion "transforms\e5d515112484fe4dddc05785469cc380")
if (Test-Path $knownTransform) {
  Write-Host "Eliminando transform corrupto: $knownTransform"
  Remove-Item -Recurse -Force $knownTransform
} else {
  Write-Host "No se encontró transform corrupto conocido. Continuando..."
}

# Opcional: eliminar caché completo (comenta si no quieres borrar todo)
# Write-Host "Eliminando cache completo de Gradle: $cacheBase"
# Remove-Item -Recurse -Force $cacheBase

# Ejecutar gradle clean en android
if (Test-Path "android\gradlew.bat") {
  Write-Host "Ejecutando gradlew clean en android/"
  Push-Location android
  & .\gradlew.bat clean
  Pop-Location
  Write-Host "gradlew clean finalizado"
} else {
  Write-Host "No se encontró android\\gradlew.bat. Ejecuta 'npx expo prebuild' primero o verifica el proyecto." -ForegroundColor Yellow
}

Write-Host "Listo. Intenta ejecutar: npx expo run:android"
