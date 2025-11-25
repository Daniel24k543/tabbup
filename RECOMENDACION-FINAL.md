# 🎯 Recomendación final — Build EAS (más simple)

## Situación actual

El build local en Windows ha fallado repetidamente por problemas de caché corrupta de Gradle. Aunque ejecuté limpieza completa, estos errores son comunes en Windows con rutas largas y permisos del sistema de archivos.

## ✅ Solución recomendada: Usar el build EAS que ya tienes en cola

Ya tienes un build EAS ejecutándose desde hace rato. Es la forma MÁS SIMPLE y sin complicaciones.

### Paso 1: Verificar estado del build EAS

```powershell
eas build:list
# O abre directamente:
# https://expo.dev/accounts/lester24k/projects/Tabbup/builds/a33bdd92-d029-4a3e-b74d-59bf4976e95d
```

### Paso 2: Cuando el build termine

1. Recibirás un enlace de descarga del APK
2. Descarga el archivo en tu PC
3. Instala en tu teléfono:

```powershell
adb install -r "C:\ruta\al\archivo-descargado.apk"
```

### Paso 3: Conectar Metro

```powershell
# Usa el helper que preparé
.\scripts\run-dev-client-windows.ps1

# O manualmente:
npm run adb-reverse
npm run start:dev-client
```

### Paso 4: Probar los anuncios

- Abre la app dev-client en el teléfono
- Navega a `ShopScreen` para ver los RewardedAds
- Los IDs de prueba ya están configurados (`TestIds`)

### Paso 5: Ver logs

```powershell
# Logs JS (Metro) - en la terminal donde ejecutaste start:dev-client
# Logs nativos:
adb logcat *:S ReactNative:V ReactNativeJS:V
```

---

## 🔧 Si aún quieres compilar localmente (opcional, avanzado)

El build local requiere solucionar el problema de caché de Gradle manualmente:

### Opción A: Limpieza manual del folder problemático

```powershell
# Cierra todas las terminales Java/Gradle
# Luego elimina manualmente (Explorador de archivos):
C:\Users\magis\.gradle\caches\8.14.3\transforms\e5d515112484fe4dddc05785469cc380

# Borra también .gradle del proyecto:
Remove-Item -Recurse -Force android\.gradle

# Vuelve a intentar:
npx expo run:android
```

### Opción B: Desactivar el daemon de Gradle

Añade al archivo `android/gradle.properties`:

```
org.gradle.daemon=false
org.gradle.jvmargs=-Xmx2048m
```

Y reintenta.

### Opción C: Build con `--no-build-cache`

```powershell
cd android
.\gradlew.bat assembleDebug --no-build-cache --no-daemon
cd ..
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
npm run start:dev-client
```

---

## 📊 Comparación

| Método                       | Tiempo                        | Complejidad | Recomendación              |
| ---------------------------- | ----------------------------- | ----------- | -------------------------- |
| **EAS build (en cola)**      | ~90 min espera (ya corriendo) | Baja        | ⭐⭐⭐⭐⭐ **RECOMENDADO** |
| Build local (arreglar caché) | 10-30 min + troubleshooting   | Alta        | Solo si eres avanzado      |

---

## 🚀 Mi recomendación clara

**Espera a que termine el build EAS** (probablemente ya está cerca de finalizar). Es el camino más simple, sin complicaciones de caché/permisos de Windows.

Mientras esperas, puedes:

- Verificar que `adb devices` muestra tu teléfono
- Leer `INSTALL-SUMMARY.md` para entender los próximos pasos
- Revisar `README-testing.md` para ver cómo usar Metro

Cuando el APK esté listo:

1. Descarga
2. `adb install -r archivo.apk`
3. `.\scripts\run-dev-client-windows.ps1`
4. Prueba los banners

**Eso es todo — no más problemas de Gradle.**
