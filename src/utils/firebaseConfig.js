// src/utils/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Tus datos reales de Tabbup
const firebaseConfig = {
  apiKey: "AIzaSyARs87GzRmKrLGMPxSBIIkZw9b3mIYaRBo",
  authDomain: "tabbup-148b1.firebaseapp.com",
  databaseURL: "https://tabbup-148b1-default-rtdb.firebaseio.com",
  projectId: "tabbup-148b1",
  storageBucket: "tabbup-148b1.firebasestorage.app",
  messagingSenderId: "276193988776",
  appId: "1:276193988776:web:ee0cc4a1bd46dd5f21f29d",
  measurementId: "G-VWM27FST54"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar la base de datos para usarla en el juego
export const db = getDatabase(app);