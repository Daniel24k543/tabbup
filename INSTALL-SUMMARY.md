# Resumen: Preparación completa para probar anuncios en dispositivo

## ✅ Lo que ya está hecho

### Archivos y configuraciones creadas

- ✅ **`eas.json`**: Perfiles de build (development, preview, production) para EAS.
- ✅ **`scripts/clean-gradle-cache.ps1`**: Limpia caché corrupta de Gradle y ejecuta `gradlew clean`.
- ✅ **`scripts/run-dev-client-windows.ps1`**: Hace `adb reverse` y arranca Metro en modo dev-client.
- ✅ **`README-testing.md`**: Guía completa paso a paso para builds EAS, local, y uso de Metro.
- ✅ **`package.json`**: Scripts agregados:
  - `start:dev-client` - Inicia Metro para dev-client
  - `adb-reverse` - Hace reverse de puertos por USB
  - `build:eas:dev` - Build desarrollo en la nube
  - `run:android-local` - Build local con `expo run:android`
  - `prebuild` - Genera proyecto nativo
  - `install-deps` - Instala dependencias npm

### Verificaciones realizadas

- ✅ `AndroidManifest.xml` ya contiene `com.google.android.gms.ads.APPLICATION_ID` con el ID de prueba de AdMob.
- ✅ `app.json` tiene el plugin `react-native-google-mobile-ads` con `androidAppId` e `iosAppId` de prueba.
- ✅ `ShopScreen.js` usa `TestIds` para anuncios rewarded (perfecto para pruebas).

### Comandos ejecutados por mí

- ✅ Ejecuté `.\scripts\clean-gradle-cache.ps1` → Gradle clean exitoso
- ✅ Lancé `npx expo run:android` en background → compilando e instalando APK ahora

---

## 📱 Próximos pasos (cuando termine el build)

### 1. Verificar instalación del APK

El build está compilando. Cuando termine verás en la terminal:

```
BUILD SUCCESSFUL
Installing APK...
Installed on <device>
Starting Metro...
```

Si el build falla, revisa la salida y me la pegas para corregir el error.

### 2. Conectar Metro al dev-client (si no se conectó automáticamente)

Si la app instalada no se conecta automáticamente a Metro:

```powershell
# Ejecuta el helper (hace adb reverse + Metro)
.\scripts\run-dev-client-windows.ps1

# O manualmente:
npm run adb-reverse
npm run start:dev-client
```

### 3. Probar los banners de anuncios

- Abre la app dev-client en el teléfono.
- Navega a `ShopScreen` (la pantalla donde usas `RewardedAd`).
- Verifica que aparezcan los anuncios de prueba (IDs de prueba ya configurados en el código).
- También revisa `ResultsScreen` donde hay un espacio placeholder para banners.

### 4. Ver logs nativos y JS

```powershell
# Logs JS (Metro) - aparecen en la terminal donde ejecutaste start:dev-client
# Logs nativos (Android)
adb logcat *:S ReactNative:V ReactNativeJS:V

# Filtrar por tu app (reemplaza com.tabbup.game si el paquete cambió)
adb logcat | Select-String "com.tabbup.game"
```

### 5. Si necesitas cambios JS (hot reload con Metro)

- Edita cualquier archivo `.js`/`.tsx` del proyecto.
- Metro recargará automáticamente (hot reload).
- No necesitas recompilar para cambios JS (solo para cambios nativos).

### 6. Para cambios nativos (rebuild necesario)

Si modificas `AndroidManifest.xml`, dependencias nativas, o algo en `android/`:

```powershell
cd android
.\gradlew.bat clean
cd ..
npx expo run:android
```

---

## 🔧 Troubleshooting rápido

### Si el build falla de nuevo

1. Pega aquí las últimas 60 líneas del error
2. O ejecuta con más detalle:
   ```powershell
   cd android
   .\gradlew.bat assembleDebug --stacktrace --info
   ```

### Si Metro no se conecta

- Verifica `adb devices` (debe mostrar tu dispositivo).
- Ejecuta `npm run adb-reverse`.
- Abre la app dev-client y usa "Open from URL" con la URL de Metro.

### Si los anuncios no aparecen

- Asegúrate de usar IDs de prueba (`TestIds` en `ShopScreen.js`).
- Revisa `adb logcat` para errores del SDK de Google.
- Verifica que `AndroidManifest.xml` tenga el `APPLICATION_ID` meta-data.

---

## 🚀 Alternativa: Build EAS (si prefieres cloud)

Tienes un build EAS en cola desde antes:

- URL: https://expo.dev/accounts/lester24k/projects/Tabbup/builds/a33bdd92-d029-4a3e-b74d-59bf4976e95d
- Cuando termine, descarga el APK e instala:
  ```powershell
  adb install -r "ruta\al\archivo.apk"
  .\scripts\run-dev-client-windows.ps1
  ```

---

## 📝 Recordatorio: IDs de producción

Los IDs de AdMob actuales son de PRUEBA. Para publicar en producción:

1. Crea tu app en AdMob Console.
2. Obtén tu `App ID` real (ca-app-pub-XXXXXXXX~YYYYYYYY).
3. Reemplaza en `app.json` el `androidAppId` con tu ID real.
4. NO subas IDs reales a repos públicos.

---

**Estado actual**: Build local corriendo en terminal background. Cuando termine, sigue los pasos arriba para probar los banners. Si ves algún error, pégamelo y te ayudo a resolverlo inmediatamente.
