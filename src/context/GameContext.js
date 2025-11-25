// src/context/GameContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // --- 👤 DATOS DE PERFIL Y ESTADÍSTICAS ---
  const [userProfile, setUserProfile] = useState({
    name: 'Guest',
    level: 1,
    xp: 0,
    totalGames: 0,
    totalWins: 0,
    maxStreak: 0,
    currentStreak: 0,
    country: '🇵🇪' // Por defecto Perú
  });

  // --- 💰 ECONOMÍA & INVENTARIO ---
  const [coins, setCoins] = useState(1000);
  const [isPremium, setIsPremium] = useState(false);
  const [hasMicrophone, setHasMicrophone] = useState(false); // NUEVO: Compra de micrófono
  const [hasNoAds, setHasNoAds] = useState(false); // NUEVO: Eliminación de anuncios
  
  // SKINS (Efectos)
  const [tapSkin, setTapSkin] = useState('DEFAULT');
  const [unlockedSkins, setUnlockedSkins] = useState(['DEFAULT']);
  
  // TABLEROS (NUEVO)
  const [boardSkin, setBoardSkin] = useState('DEFAULT'); // Tablero equipado
  const [unlockedBoards, setUnlockedBoards] = useState(['DEFAULT']); // Tableros comprados
  
  // VENTAJAS (BOOSTS)
  const [activeBoosts, setActiveBoosts] = useState([]); // Boosts activos en la partida actual
  const [purchasedBoosts, setPurchasedBoosts] = useState([]); // Boosts comprados para usar

  const [chests, setChests] = useState([null, null, null, null]); 

  // --- 🎯 MISIONES Y PROGRESO ---
  const [dailyMissions, setDailyMissions] = useState([]);
  const [weeklyMissions, setWeeklyMissions] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [lastDailyReset, setLastDailyReset] = useState(null);
  const [lastWeeklyReset, setLastWeeklyReset] = useState(null);
  
  // Estadísticas para misiones
  const [gameStats, setGameStats] = useState({
    totalTaps: 0,
    todayTaps: 0,
    weekTaps: 0,
    todayWins: 0,
    weekWins: 0,
    todayGames: 0,
    weekGames: 0,
    itemsPurchased: 0,
    currentWinStreak: 0,
    maxTapsPerSecond: 0,
  });

  // --- 🎮 JUEGO ---
  const [gameMode, setGameMode] = useState(null);
  const [players, setPlayers] = useState([]); 
  const [roomCode, setRoomCode] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [myId, setMyId] = useState(null); 
  const [gameState, setGameState] = useState('waiting'); 
  const [messages, setMessages] = useState([]);
  const [settings] = useState({ timePerRound: 30, maxPlayers: 4 });

  // 1. CARGAR DATOS GUARDADOS
  useEffect(() => { 
    const loadUserData = async () => {
      try {
        const keys = [
          'userCoins', 'userProfile', 'userSkins', 'userBoards', 
          'equippedBoard', 'equippedSkin', 'hasMicrophone', 'hasNoAds',
          'dailyMissions', 'weeklyMissions', 'achievements', 
          'lastDailyReset', 'lastWeeklyReset', 'gameStats'
        ];
        const result = await AsyncStorage.multiGet(keys);
        const data = Object.fromEntries(result);

        if (data.userCoins) setCoins(parseInt(data.userCoins));
        if (data.userProfile) setUserProfile(JSON.parse(data.userProfile));
        if (data.userSkins) setUnlockedSkins(JSON.parse(data.userSkins));
        if (data.userBoards) setUnlockedBoards(JSON.parse(data.userBoards));
        if (data.equippedBoard) setBoardSkin(data.equippedBoard);
        if (data.equippedSkin) setTapSkin(data.equippedSkin);
        if (data.hasMicrophone) setHasMicrophone(data.hasMicrophone === 'true');
        if (data.hasNoAds) setHasNoAds(data.hasNoAds === 'true');
        
        // Cargar misiones
        if (data.dailyMissions) setDailyMissions(JSON.parse(data.dailyMissions));
        if (data.weeklyMissions) setWeeklyMissions(JSON.parse(data.weeklyMissions));
        if (data.achievements) setAchievements(JSON.parse(data.achievements));
        if (data.lastDailyReset) setLastDailyReset(parseInt(data.lastDailyReset));
        if (data.lastWeeklyReset) setLastWeeklyReset(parseInt(data.lastWeeklyReset));
        if (data.gameStats) setGameStats(JSON.parse(data.gameStats));
        
        // Inicializar misiones si es primera vez
        if (!data.dailyMissions) {
          initializeMissions();
        } else {
          // Verificar si necesita reset
          checkMissionResets();
        }
      } catch (e) { console.error(e); }
    };
    
    const initializeMissions = () => {
      const now = Date.now();
      
      // Misiones diarias por defecto
      setDailyMissions([
        { id: 'd1', title: 'Ganar 3 partidas', desc: 'Victorias', progress: 0, goal: 3, reward: 500, completed: false, claimed: false },
        { id: 'd2', title: 'Tapea 500 veces', desc: 'Taps totales', progress: 0, goal: 500, reward: 300, completed: false, claimed: false },
        { id: 'd3', title: 'Juega 5 partidas', desc: 'Partidas', progress: 0, goal: 5, reward: 200, completed: false, claimed: false },
        { id: 'd4', title: 'Compra 1 item', desc: 'Tienda', progress: 0, goal: 1, reward: 150, completed: false, claimed: false },
      ]);

      // Misiones semanales
      setWeeklyMissions([
        { id: 'w1', title: 'Ganar 20 partidas', desc: 'Victorias semanales', progress: 0, goal: 20, reward: 2000, completed: false, claimed: false },
        { id: 'w2', title: 'Alcanza 10,000 taps', desc: 'Taps semanales', progress: 0, goal: 10000, reward: 1500, completed: false, claimed: false },
        { id: 'w3', title: 'Juega 30 partidas', desc: 'Partidas semanales', progress: 0, goal: 30, reward: 1000, completed: false, claimed: false },
      ]);

      // Logros
      setAchievements([
        { id: 'a1', title: 'Primera Victoria', desc: 'Gana tu primera partida', reward: 100, unlocked: false, claimed: false },
        { id: 'a2', title: 'Tapeo Veloz', desc: 'Alcanza 10 taps/segundo', reward: 500, unlocked: false, claimed: false },
        { id: 'a3', title: 'Racha Ganadora', desc: 'Gana 10 partidas seguidas', reward: 2000, unlocked: false, claimed: false },
        { id: 'a4', title: 'Maestro Tapper', desc: 'Alcanza 100,000 taps totales', reward: 5000, unlocked: false, claimed: false },
        { id: 'a5', title: 'Comprador VIP', desc: 'Compra 50 items en la tienda', reward: 3000, unlocked: false, claimed: false },
      ]);

      setLastDailyReset(now);
      setLastWeeklyReset(now);
    };

    const checkMissionResets = () => {
      const now = Date.now();
      const ONE_DAY = 24 * 60 * 60 * 1000;
      const ONE_WEEK = 7 * ONE_DAY;

      // Reset diario (si han pasado 24h)
      if (now - lastDailyReset > ONE_DAY) {
        setDailyMissions(prev => prev.map(m => ({ ...m, progress: 0, completed: false, claimed: false })));
        setLastDailyReset(now);
        setGameStats(prev => ({ ...prev, todayTaps: 0 }));
      }

      // Reset semanal (si han pasado 7d)
      if (now - lastWeeklyReset > ONE_WEEK) {
        setWeeklyMissions(prev => prev.map(m => ({ ...m, progress: 0, completed: false, claimed: false })));
        setLastWeeklyReset(now);
        setGameStats(prev => ({ ...prev, weekTaps: 0 }));
      }
    };
    
    loadUserData(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveData = async () => {
    // Guardamos todo localmente (idealmente esto iría a Firebase también)
    await AsyncStorage.setItem('userCoins', coins.toString());
    await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
    await AsyncStorage.setItem('userBoards', JSON.stringify(unlockedBoards));
    await AsyncStorage.setItem('equippedBoard', boardSkin);
    await AsyncStorage.setItem('hasMicrophone', hasMicrophone.toString());
    await AsyncStorage.setItem('hasNoAds', hasNoAds.toString());
    await AsyncStorage.setItem('dailyMissions', JSON.stringify(dailyMissions));
    await AsyncStorage.setItem('weeklyMissions', JSON.stringify(weeklyMissions));
    await AsyncStorage.setItem('achievements', JSON.stringify(achievements));
    await AsyncStorage.setItem('gameStats', JSON.stringify(gameStats));
    if (lastDailyReset) await AsyncStorage.setItem('lastDailyReset', lastDailyReset.toString());
    if (lastWeeklyReset) await AsyncStorage.setItem('lastWeeklyReset', lastWeeklyReset.toString());
  };

  // 2. FUNCIONES DE TIENDA (TABLEROS Y EFECTOS)
  const buyItem = (type, id, cost) => {
    if (coins < cost) return false;

    const newCoins = coins - cost;
    setCoins(newCoins);

    if (type === 'board') {
        const newBoards = [...unlockedBoards, id];
        setUnlockedBoards(newBoards);
        setBoardSkin(id); // Equipar al comprar
    } else if (type === 'skin') {
        const newSkins = [...unlockedSkins, id];
        setUnlockedSkins(newSkins);
        setTapSkin(id);
    } else if (type === 'microphone') {
        setHasMicrophone(true);
    } else if (type === 'noads') {
        setHasNoAds(true);
    } else if (type === 'boost') {
        // Agregar boost a la lista de comprados
        const newBoosts = [...purchasedBoosts, id];
        setPurchasedBoosts(newBoosts);
    }
    
    // Actualizar progreso de misiones
    updateMissionProgress('purchase');
    
    saveData();
    return true;
  };

  const equipItem = (type, id) => {
    if (type === 'board' && unlockedBoards.includes(id)) setBoardSkin(id);
    if (type === 'skin' && unlockedSkins.includes(id)) setTapSkin(id);
    saveData();
  };
  
  // ACTIVAR BOOSTS AL CREAR SALA
  const activateBoosts = (boostIds) => {
    setActiveBoosts(boostIds);
    // Remover los boosts usados de la lista de comprados
    const remaining = purchasedBoosts.filter(b => !boostIds.includes(b));
    setPurchasedBoosts(remaining);
  };
  
  // LIMPIAR BOOSTS AL TERMINAR PARTIDA
  const clearBoosts = () => {
    setActiveBoosts([]);
  };
  
  // --- SISTEMA DE MISIONES ---
  // Actualizar progreso de misiones
  const updateMissionProgress = (type, amount = 1) => {
    if (type === 'tap') {
      setGameStats(prev => ({
        ...prev,
        totalTaps: prev.totalTaps + amount,
        todayTaps: prev.todayTaps + amount,
        weekTaps: prev.weekTaps + amount,
      }));
      
      // Actualizar misión de taps diaria
      setDailyMissions(prev => prev.map(m => {
        if (m.id === 'd2' && !m.completed) {
          const newProgress = m.progress + amount;
          return { ...m, progress: newProgress, completed: newProgress >= m.goal };
        }
        return m;
      }));
      
      // Actualizar misión de taps semanal
      setWeeklyMissions(prev => prev.map(m => {
        if (m.id === 'w2' && !m.completed) {
          const newProgress = m.progress + amount;
          return { ...m, progress: newProgress, completed: newProgress >= m.goal };
        }
        return m;
      }));
    }
    
    if (type === 'win') {
      setGameStats(prev => ({
        ...prev,
        todayWins: prev.todayWins + 1,
        weekWins: prev.weekWins + 1,
        currentWinStreak: prev.currentWinStreak + 1,
      }));
      
      // Actualizar misiones de victorias
      setDailyMissions(prev => prev.map(m => {
        if (m.id === 'd1' && !m.completed) {
          const newProgress = m.progress + 1;
          return { ...m, progress: newProgress, completed: newProgress >= m.goal };
        }
        return m;
      }));
      
      setWeeklyMissions(prev => prev.map(m => {
        if (m.id === 'w1' && !m.completed) {
          const newProgress = m.progress + 1;
          return { ...m, progress: newProgress, completed: newProgress >= m.goal };
        }
        return m;
      }));
      
      // Logros
      setAchievements(prev => prev.map(a => {
        if (a.id === 'a1' && !a.unlocked) return { ...a, unlocked: true };
        if (a.id === 'a3' && !a.unlocked && gameStats.currentWinStreak >= 10) return { ...a, unlocked: true };
        return a;
      }));
    }
    
    if (type === 'game') {
      setGameStats(prev => ({
        ...prev,
        todayGames: prev.todayGames + 1,
        weekGames: prev.weekGames + 1,
      }));
      
      // Actualizar misiones de partidas
      setDailyMissions(prev => prev.map(m => {
        if (m.id === 'd3' && !m.completed) {
          const newProgress = m.progress + 1;
          return { ...m, progress: newProgress, completed: newProgress >= m.goal };
        }
        return m;
      }));
      
      setWeeklyMissions(prev => prev.map(m => {
        if (m.id === 'w3' && !m.completed) {
          const newProgress = m.progress + 1;
          return { ...m, progress: newProgress, completed: newProgress >= m.goal };
        }
        return m;
      }));
    }
    
    if (type === 'purchase') {
      setGameStats(prev => ({ ...prev, itemsPurchased: prev.itemsPurchased + 1 }));
      
      setDailyMissions(prev => prev.map(m => {
        if (m.id === 'd4' && !m.completed) {
          const newProgress = m.progress + 1;
          return { ...m, progress: newProgress, completed: newProgress >= m.goal };
        }
        return m;
      }));
      
      // Logro de compras
      if (gameStats.itemsPurchased >= 50) {
        setAchievements(prev => prev.map(a => 
          a.id === 'a5' && !a.unlocked ? { ...a, unlocked: true } : a
        ));
      }
    }
    
    saveData();
  };
  
  // Reclamar recompensa de misión
  const claimMissionReward = (missionId, type = 'daily') => {
    let mission;
    
    if (type === 'daily') {
      mission = dailyMissions.find(m => m.id === missionId);
      if (mission && mission.completed && !mission.claimed) {
        setCoins(prev => prev + mission.reward);
        setDailyMissions(prev => prev.map(m => 
          m.id === missionId ? { ...m, claimed: true } : m
        ));
        saveData();
        return mission.reward;
      }
    } else if (type === 'weekly') {
      mission = weeklyMissions.find(m => m.id === missionId);
      if (mission && mission.completed && !mission.claimed) {
        setCoins(prev => prev + mission.reward);
        setWeeklyMissions(prev => prev.map(m => 
          m.id === missionId ? { ...m, claimed: true } : m
        ));
        saveData();
        return mission.reward;
      }
    } else if (type === 'achievement') {
      mission = achievements.find(a => a.id === missionId);
      if (mission && mission.unlocked && !mission.claimed) {
        setCoins(prev => prev + mission.reward);
        setAchievements(prev => prev.map(a => 
          a.id === missionId ? { ...a, claimed: true } : a
        ));
        saveData();
        return mission.reward;
      }
    }
    
    return 0;
  };

  // 3. FINALIZAR PARTIDA (ACTUALIZAR ESTADÍSTICAS)
  const finishGame = (didWin) => {
    setUserProfile(prev => {
        const newWins = didWin ? prev.totalWins + 1 : prev.totalWins;
        const newStreak = didWin ? prev.currentStreak + 1 : 0;
        const newMaxStreak = newStreak > prev.maxStreak ? newStreak : prev.maxStreak;
        
        return {
            ...prev,
            totalGames: prev.totalGames + 1,
            totalWins: newWins,
            currentStreak: newStreak,
            maxStreak: newMaxStreak,
            xp: prev.xp + (didWin ? 100 : 20) // XP por jugar
        };
    });
    
    // Actualizar misiones
    updateMissionProgress('game');
    if (didWin) {
      updateMissionProgress('win');
    } else {
      // Reiniciar racha si pierde
      setGameStats(prev => ({ ...prev, currentWinStreak: 0 }));
    }
    
    saveData();
  };

  // --- FIREBASE MULTIPLAYER ---
  const awardCoins = (n) => setCoins(c => c + n);
  const openChest = () => 100;

  const createOnlineRoom = async (name, theme) => {
    try {
      const { db } = require('../utils/firebaseConfig');
      const { ref, set, onValue } = require('firebase/database');
      
      // Generar código único de 5 dígitos
      const code = Math.floor(10000 + Math.random() * 90000).toString();
      const playerId = Date.now().toString();
      
      const roomRef = ref(db, `rooms/${code}`);
      
      // Crear sala en Firebase
      await set(roomRef, {
        code,
        host: playerId,
        theme: theme || 'COMPETITIVE',
        state: 'waiting',
        createdAt: Date.now(),
        players: {
          [playerId]: { id: playerId, name, ready: true }
        },
        messages: {}
      });
      
      setRoomCode(code);
      setMyId(playerId);
      setIsHost(true);
      setPlayers([{ id: playerId, name, ready: true }]);
      setGameState('waiting');
      
      // Escuchar cambios en la sala
      onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const playersList = Object.values(data.players || {});
          setPlayers(playersList);
          setGameState(data.state);
          
          if (data.messages) {
            const msgList = Object.values(data.messages);
            setMessages(msgList);
          }
        }
      });
      
      return code;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  };

  const joinOnlineRoom = async (name, code) => {
    try {
      const { db } = require('../utils/firebaseConfig');
      const { ref, get, update, onValue } = require('firebase/database');
      
      const roomRef = ref(db, `rooms/${code}`);
      const snapshot = await get(roomRef);
      
      if (!snapshot.exists()) {
        return false;
      }
      
      const roomData = snapshot.val();
      const playerId = Date.now().toString();
      
      // Agregar jugador a la sala
      await update(roomRef, {
        [`players/${playerId}`]: { id: playerId, name, ready: true }
      });
      
      setRoomCode(code);
      setMyId(playerId);
      setIsHost(false);
      setGameState(roomData.state);
      
      // Escuchar cambios
      onValue(roomRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const playersList = Object.values(data.players || {});
          setPlayers(playersList);
          setGameState(data.state);
          
          if (data.messages) {
            const msgList = Object.values(data.messages);
            setMessages(msgList);
          }
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error joining room:', error);
      return false;
    }
  };

  const startGame = async () => {
    if (!isHost || !roomCode) return;
    
    try {
      const { db } = require('../utils/firebaseConfig');
      const { ref, update } = require('firebase/database');
      
      const roomRef = ref(db, `rooms/${roomCode}`);
      await update(roomRef, { state: 'playing' });
      setGameState('playing');
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const sendChatMessage = async (text, senderName) => {
    if (!roomCode || !text.trim()) return;
    
    try {
      const { db } = require('../utils/firebaseConfig');
      const { ref, push } = require('firebase/database');
      
      const messagesRef = ref(db, `rooms/${roomCode}/messages`);
      await push(messagesRef, {
        sender: senderName,
        text: text.trim(),
        timestamp: Date.now()
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const tapOnline = () => {
    // Implementar lógica de tap en partida online si es necesario
  };

  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({
      ...prev,
      ...updates
    }));
    saveData();
  };

  return (
    <GameContext.Provider value={{
      coins, userProfile, // Perfil
      tapSkin, unlockedSkins, boardSkin, unlockedBoards, chests, isPremium, hasMicrophone, hasNoAds, // Inventario
      activeBoosts, purchasedBoosts, activateBoosts, clearBoosts, // Boosts
      dailyMissions, weeklyMissions, achievements, gameStats, // Misiones
      updateMissionProgress, claimMissionReward, // Acciones de misiones
      buyItem, equipItem, awardCoins, finishGame, openChest, updateUserProfile, // Acciones
      createOnlineRoom, joinOnlineRoom, startGame, tapOnline, sendChatMessage, // Multiplayer
      players, roomCode, isHost, gameState, messages, // Estado Sala
      gameMode, setGameMode, settings, myId // Game Mode & Settings
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);