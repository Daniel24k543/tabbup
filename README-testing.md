# Pruebas en dispositivo (Android) — Dev-client y Metro

Este documento explica paso a paso cómo generar un `dev-client` que incluya el SDK nativo (`react-native-google-mobile-ads`), instalarlo en tu teléfono por USB y controlar la app con Metro (desde Windows PowerShell).

IMPORTANTE: `react-native-google-mobile-ads` es un módulo nativo. Expo Go no lo soporta; necesitas un `dev-client` o un build de producción.

Requisitos en tu PC:

- Node.js y npm
- `adb` (Android Platform-Tools) en el `PATH`
- `eas-cli` (para builds EAS) — se instalará abajo

1. Instalar dependencias y herramientas

Abre PowerShell en la carpeta del proyecto (`c:\Users\magis\Documents\Tabbup\Tabbup`) y ejecuta:

```powershell
npm install -g eas-cli
npm run install-deps
```

2. Conectar el teléfono por USB

- Activa Opciones de desarrollador y Depuración USB en el teléfono.
- Conecta por USB al PC y acepta la autorización cuando aparezca.
- Verifica conexión:

```powershell
adb devices
```

3. (Opcional pero recomendado) Login en Expo/EAS

```powershell
eas login
```

4. Construir dev-client (en la nube, perfil `development`)

```powershell
npm run build:eas:dev
```

Al terminar el build EAS te dará un enlace donde podrás descargar el `.apk`. Descárgalo en tu PC.

Alternativa local: `eas build --local` requiere JDK/Android SDK configurado; pídeme guía si prefieres local.

## Build local (rápido, evita la cola de EAS)

Si no quieres esperar en la cola de EAS, puedes compilar e instalar localmente en tu máquina (Windows). Requisitos mínimos:

- JDK 11 o 17 (Temurin/Adoptium funciona bien)
- Android SDK (puedes instalar Android Studio o solo las command-line tools)
- `adb` (platform-tools) en el `PATH`

Pasos resumidos (PowerShell):

```powershell
# 1) Instala dependencias JS
npm run install-deps

# 2) Verifica que adb vea tu dispositivo (con Depuración USB activada en el teléfono)
adb devices

# 3) (Opcional) instala plataformas/build-tools si te faltan:
# sdkmanager normalmente está en %ANDROID_SDK_ROOT%\cmdline-tools\latest\bin
# Ejecuta (ajusta versiones según tu SDK):
# sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.2"

# 4) Compila e instala en el dispositivo conectado (hace prebuild + gradle + instala)
npx expo run:android
```

Notas:

- `npx expo run:android` ejecuta `expo prebuild` internamente, compila el proyecto nativo y lanza/instala el APK en el dispositivo. Metro se iniciará automáticamente y la app instalada se conectará al servidor Metro.
- Si prefieres pasos separados:
  - `npx expo prebuild`
  - `cd android` y en Windows: `./gradlew assembleDebug` (o `gradlew.bat assembleDebug`)
  - Instala el APK resultante: `adb install -r android\app\build\outputs\apk\debug\app-debug.apk`
- Si faltan variables de entorno como `ANDROID_SDK_ROOT`, dímelo y te doy los pasos para configurarlas.

Por qué esto acelera: compilar en tu máquina evita la cola de EAS; la primera configuración toma tiempo (instalar JDK/SDK), pero luego compilar localmente suele ser mucho más rápido.

5. Instalar el APK en el teléfono

```powershell
# ejemplo: adb install -r .\tabbup-dev-client.apk
adb install -r "C:\ruta\al\archivo.apk"
```

6. Preparar Metro y hacer el reenvío (reverse) por USB

Abre Metro con dev-client:

```powershell
npm run start:dev-client
```

En Windows puedes ejecutar un único helper que hace `adb reverse` y arranca Metro en modo dev-client:

```powershell
.\scripts\run-dev-client-windows.ps1
```

O, si prefieres separarlo manualmente, en otra terminal (o después de arrancar Metro) ejecuta:

```powershell
npm run adb-reverse
```

## Limpieza de caché de Gradle (si tu build local falla)

Si durante el build local ves errores como "Could not read workspace metadata ... metadata.bin", ejecuta el helper que añadimos para limpiar la caché y correr `gradlew clean`:

```powershell
.\scripts\clean-gradle-cache.ps1
```

El script intentará eliminar la transform concreta reportada como corrupta y ejecutará `gradlew clean` en `android/`. Si lo prefieres, abre el script y comenta la línea que borra toda la caché si no quieres eliminar todo.

7. Abrir la app dev-client en el teléfono

- Abre la app dev-client instalada. Debería conectarse automáticamente al Metro (por `adb reverse`). Si no, usa la opción "Open from URL" y pega la URL del Metro mostrada por `expo start --dev-client`.

8. Probar los banners

- Navega a la pantalla `ShopScreen` o `ResultsScreen` donde se usan los anuncios.
- Para pruebas usa `TestIds` (ya importado en `ShopScreen.js`) para evitar impresiones reales.

9. Logs y debugging

- Logs JS aparecen en la terminal donde ejecutaste `npm run start:dev-client`.
- Logs nativos (Android):

```powershell
adb logcat *:S ReactNative:V ReactNativeJS:V
```

Filtrado rápido por paquete (reemplaza `com.tuapp`):

```powershell
adb logcat | Select-String "com.tuapp"
```

10. Añadir App ID de AdMob (cuando quieras usar IDs reales)

- Para usar IDs reales, necesitas agregar el meta-data `com.google.android.gms.ads.APPLICATION_ID` al `AndroidManifest.xml`.
- Flujo recomendado con Expo managed:
  1. Ejecuta `expo prebuild` para generar la carpeta `android/`.
  2. Edita `android/app/src/main/AndroidManifest.xml` y añade dentro de `<application>`:

```xml
<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID"
           android:value="ca-app-pub-XXXXXXXX~YYYYYYYY" />
```

3. Vuelve a construir el dev-client con EAS.

No pongas tu App ID real en el repo público.

11. Problemas frecuentes y soluciones

- Si el dev-client no se conecta: revisa `adb reverse` y que Metro esté en ejecución.
- Si los anuncios no aparecen: usa `TestIds` y revisa `adb logcat` para errores del SDK de Google.
- Errores de build en EAS: copia y pega la salida aquí y te ayudo.

¿Quieres que inicie el build EAS desde aquí ahora? (Necesitarás hacer `eas login` en tu máquina; yo no puedo usar tus credenciales). Si prefieres, te voy guiando paso a paso mientras ejecutas los comandos — pásame las salidas si sale algún error.
