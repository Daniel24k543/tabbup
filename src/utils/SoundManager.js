// src/utils/SoundManager.js
import { Audio } from 'expo-av';

const soundObjects = {
  bgMusic: new Audio.Sound(),
  tap: new Audio.Sound(),
  win: new Audio.Sound(),
};

// Cargar sonidos al inicio
export const loadSounds = async () => {
  try {
    // Asegúrate de tener estos archivos en assets
    await soundObjects.bgMusic.loadAsync(require('../../assets/lobby.mp3'));
    await soundObjects.tap.loadAsync(require('../../assets/tap.mp3'));
    // await soundObjects.win.loadAsync(require('../../assets/win.mp3')); // Descomenta si tienes este archivo
    
    // Configurar música de fondo
    await soundObjects.bgMusic.setIsLoopingAsync(true);
    await soundObjects.bgMusic.setVolumeAsync(0.5); // Volumen al 50%
  } catch (error) {
    console.log("Error cargando sonidos (revisar nombres en assets):", error);
  }
};

// Reproducir música de fondo
export const playBackgroundMusic = async () => {
  try {
    const status = await soundObjects.bgMusic.getStatusAsync();
    if (!status.isPlaying) {
      await soundObjects.bgMusic.playAsync();
    }
  } catch (error) { console.log(error); }
};

// Pausar música
export const stopBackgroundMusic = async () => {
  try {
    await soundObjects.bgMusic.stopAsync();
  } catch (error) { console.log(error); }
};

// Reproducir efecto TAP (Reinicia si ya está sonando para taps rápidos)
export const playTapSound = async () => {
  try {
    await soundObjects.tap.replayAsync();
  } catch (error) { console.log(error); }
};