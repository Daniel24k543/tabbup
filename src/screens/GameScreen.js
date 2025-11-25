// src/screens/GameScreen.js
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { X, MessageCircle, Smile, Clock, Send, Zap } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, BackHandler, Dimensions, StyleSheet, Text, TouchableOpacity, View, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useGame } from '../context/GameContext';

const { width, height } = Dimensions.get('window');

// EMOJIS DE REACCIONES
const REACTION_EMOJIS = [
  { id: 'laugh', emoji: '😂', name: 'Risa' },
  { id: 'fire', emoji: '🔥', name: 'Fuego' },
  { id: 'cry', emoji: '😭', name: 'Llorar' },
  { id: 'angry', emoji: '😡', name: 'Enojado' },
  { id: 'skull', emoji: '💀', name: 'Muerto' },
  { id: 'clown', emoji: '🤡', name: 'Payaso' },
  { id: 'trophy', emoji: '🏆', name: 'Victoria' },
  { id: 'crown', emoji: '👑', name: 'Rey' },
  { id: 'thumbsup', emoji: '👍', name: 'Bien' },
  { id: 'thumbsdown', emoji: '👎', name: 'Mal' },
  { id: 'muscle', emoji: '💪', name: 'Fuerza' },
  { id: 'boom', emoji: '💥', name: 'Boom' },
];

// MAPA DE ICONOS DE LOS TAPS
const TAP_ICONS = {
  DEFAULT: '+1',
  PERU: '🇵🇪',
  BOLIVIA: '🇧🇴',
  ARGENTINA: '🇦🇷',
  MEXICO: '🇲🇽',
  CHILE: '🇨🇱',
  COLOMBIA: '🇨🇴',
  BRAZIL: '🇧🇷',
  SPAIN: '🇪🇸',
  USA: '🇺🇸',
  FIRE: '🔥',
  STAR: '⭐',
  HEART: '💖',
  LIGHTNING: '⚡',
  ROCKET: '🚀',
  DIAMOND: '💎',
  CROWN: '👑',
  TROPHY: '🏆',
  SOCCER: '⚽',
  GAMING: '🎮',
};

export default function GameScreen() {
  const navigation = useNavigation();
  const { 
    tapOnline, 
    gameMode, 
    settings, 
    tapSkin, 
    userProfile,
    updateUserProfile,
    roomCode,
    messages,
    sendChatMessage,
    updateMissionProgress
  } = useGame(); 
  
  const [timeLeft, setTimeLeft] = useState(settings?.timePerRound || 180); // 3 minutos por defecto
  const [gameActive, setGameActive] = useState(true);
  const scaleValue = useRef(new Animated.Value(1)).current;
  const [particles, setParticles] = useState([]);
  
  // SCORES LOCALES
  const [myScore, setMyScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const botInterval = useRef(null);
  const timerInterval = useRef(null);
  
  // CHAT Y EMOJIS
  const [showChat, setShowChat] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [reactions, setReactions] = useState([]); // Emojis flotantes
  
  // VENTAJAS ACTIVAS (compradas en la tienda)
  const { activeBoosts = [] } = useGame(); // double_tap, shield, freeze, etc.
  
  // --- ANTI-CHEAT VARIABLES ---
  const lastTapTime = useRef(0);
  const tapsInOneSecond = useRef(0);
  const lastSecondCheck = useRef(Date.now());
  const isFrozen = useRef(false); // Para congelar si hace trampa

  // Formatear tiempo en MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // CRONÓMETRO - CUENTA REGRESIVA
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      timerInterval.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval.current);
            setGameActive(false);
            // Ir a resultados
            setTimeout(() => {
              navigation.replace('Results', {
                myScore,
                cpuScore,
                winner: myScore > cpuScore ? 'player' : 'cpu'
              });
            }, 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
    };
  }, [gameActive, timeLeft, myScore, cpuScore, navigation]);

  // SISTEMA DE ABANDONO Y SUSPENSIÓN
  const handleQuitGame = useCallback(() => {
    const abandonCount = userProfile?.abandonCount || 0;
    
    let suspensionMessage = '';
    let suspensionTime = '';
    
    if (abandonCount === 0) {
      suspensionMessage = '⚠️ Si abandonas esta partida, recibirás una advertencia.';
      suspensionTime = 'Primera advertencia';
    } else if (abandonCount === 1) {
      suspensionMessage = '⚠️ Si abandonas, serás suspendido por 2 horas.';
      suspensionTime = '2 horas de suspensión';
    } else if (abandonCount === 2) {
      suspensionMessage = '⚠️ Si abandonas, serás suspendido por 24 horas.';
      suspensionTime = '24 horas de suspensión';
    } else {
      suspensionMessage = '⚠️ Si abandonas, serás suspendido por 7 días.';
      suspensionTime = '7 días de suspensión';
    }

    Alert.alert(
      '🚨 Abandonar Partida',
      `${suspensionMessage}\n\nAbandonos registrados: ${abandonCount}\nPróxima sanción: ${suspensionTime}\n\n¿Estás seguro de abandonar?`,
      [
        {
          text: 'Continuar Jugando',
          style: 'cancel'
        },
        {
          text: 'Abandonar',
          style: 'destructive',
          onPress: () => {
            // Incrementar contador de abandonos
            const newAbandonCount = abandonCount + 1;
            const now = Date.now();
            let suspensionEndTime = null;

            // Calcular tiempo de suspensión
            if (newAbandonCount === 1) {
              // Primera vez: solo advertencia
              Alert.alert('⚠️ Advertencia', 'Has recibido tu primera advertencia. La próxima vez serás suspendido.');
            } else if (newAbandonCount === 2) {
              // 2 horas
              suspensionEndTime = now + (2 * 60 * 60 * 1000);
              Alert.alert('🚫 Suspendido', 'Has sido suspendido por 2 horas.');
            } else if (newAbandonCount === 3) {
              // 24 horas
              suspensionEndTime = now + (24 * 60 * 60 * 1000);
              Alert.alert('🚫 Suspendido', 'Has sido suspendido por 24 horas.');
            } else {
              // 7 días
              suspensionEndTime = now + (7 * 24 * 60 * 60 * 1000);
              Alert.alert('🚫 Suspendido', 'Has sido suspendido por 7 días.');
            }

            // Actualizar perfil
            if (updateUserProfile) {
              updateUserProfile({
                abandonCount: newAbandonCount,
                suspensionEndTime: suspensionEndTime,
                lastAbandonTime: now
              });
            }

            // Volver al home
            navigation.navigate('Home');
          }
        }
      ]
    );
  }, [userProfile, updateUserProfile, navigation]);

  // Interceptar botón de retroceso de Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleQuitGame();
      return true; // Prevenir comportamiento por defecto
    });

    return () => backHandler.remove();
  }, [handleQuitGame]);

  const endGame = useCallback(() => {
    setGameActive(false);
    navigation.replace('Results', { 
      playerScore: myScore, 
      cpuScore: cpuScore 
    });
  }, [navigation, myScore, cpuScore]);

  useEffect(() => {
    setGameActive(true);
    
    // Timer principal
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (botInterval.current) clearInterval(botInterval.current);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Bot CPU - SIEMPRE activo, sin importar el modo
    // El bot toca entre 5-7 veces por segundo (velocidad humana realista)
    const botSpeed = 140 + Math.random() * 60; // 140-200ms entre taps
    
    botInterval.current = setInterval(() => {
      if (gameActive) {
        setCpuScore(prev => prev + 1);
        // Variación aleatoria para hacerlo más realista
        if (Math.random() > 0.92) { // 8% chance de doble tap
          setTimeout(() => setCpuScore(prev => prev + 1), 40);
        }
      }
    }, botSpeed);
    
    return () => {
      clearInterval(timer);
      if (botInterval.current) clearInterval(botInterval.current);
    };
  }, [gameMode, endGame, gameActive]);

  const handleTap = () => {
    if (!gameActive || isFrozen.current) return;

    const now = Date.now();

    // 🛡️ ANTI-CHEAT 1: Velocidad inhumana (<40ms)
    if (now - lastTapTime.current < 40) {
        return; // Ignorar tap silenciosamente
    }
    lastTapTime.current = now;

    // 🛡️ ANTI-CHEAT 2: Ráfaga (>14 taps/segundo)
    if (now - lastSecondCheck.current > 1000) {
        tapsInOneSecond.current = 0;
        lastSecondCheck.current = now;
    }
    tapsInOneSecond.current += 1;

    if (tapsInOneSecond.current > 14) {
        isFrozen.current = true;
        Alert.alert("⛔ ALERTA DE SEGURIDAD", "Se ha detectado una velocidad inusual. Espera 3 segundos.", [
            { text: "Entendido", onPress: () => setTimeout(() => { isFrozen.current = false; }, 3000) }
        ]);
        return;
    }

    // --- INCREMENTAR SCORE CON VENTAJAS ---
    const hasDoubleTap = activeBoosts?.includes('double_tap');
    const tapValue = hasDoubleTap ? 2 : 1;
    
    setMyScore(prev => prev + tapValue);
    
    // ACTUALIZAR MISIONES - Tracking de taps
    if (updateMissionProgress) {
      updateMissionProgress('tap', tapValue);
    }
    
    // Si es online, también actualizar en Firebase
    if (gameMode === 'online_code') {
      tapOnline(); 
    }
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animación Botón
    scaleValue.setValue(0.8);
    Animated.spring(scaleValue, { toValue: 1, friction: 3, useNativeDriver: true }).start();

    // Partícula
    createParticle();
  };

  const createParticle = () => {
    const id = Date.now() + Math.random();
    // Usamos el icono comprado o el default
    const icon = TAP_ICONS[tapSkin] || '+1'; 
    const randomX = (Math.random() - 0.5) * 100; // -50 a 50
    const randomRotate = (Math.random() - 0.5) * 60; // -30° a 30°
    const newParticle = { id, text: icon, x: randomX, rotate: randomRotate };
    
    setParticles(prev => [...prev, newParticle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id));
    }, 800);
  };
  
  // ENVIAR EMOJI DE REACCIÓN
  const sendEmoji = (emoji) => {
    const id = Date.now() + Math.random();
    const newReaction = { id, emoji, side: 'player' };
    setReactions(prev => [...prev, newReaction]);
    
    // Enviar a rival si es online
    if (gameMode === 'online_code' && roomCode) {
      // Aquí iría la lógica de Firebase para enviar el emoji
    }
    
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 3000);
    
    setShowEmojis(false);
  };
  
  // ENVIAR MENSAJE DE CHAT
  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Enviar mensaje si es online
    if (gameMode === 'online_code' && sendChatMessage) {
      sendChatMessage(chatMessage, userProfile?.name || 'Jugador');
    }
    
    setChatMessage('');
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: '#0f172a' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* BOTÓN SALIR */}
      <TouchableOpacity style={styles.quitBtn} onPress={handleQuitGame}>
        <X color="#fff" size={28} />
      </TouchableOpacity>

      {/* HEADER CON TIMER Y VENTAJAS ACTIVAS */}
      <View style={styles.header}>
        <LinearGradient
          colors={['rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0.05)']}
          style={styles.timerBox}
        >
          <Clock color="#6366f1" size={20} />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </LinearGradient>
        {activeBoosts && activeBoosts.length > 0 && (
          <View style={styles.boostsBar}>
            {activeBoosts.includes('double_tap') && (
              <LinearGradient colors={['#fbbf24', '#f59e0b']} style={styles.boostPill}>
                <Zap color="#fff" size={14} fill="#fff" />
                <Text style={styles.boostText}>x2</Text>
              </LinearGradient>
            )}
            {activeBoosts.includes('shield') && (
              <LinearGradient colors={['#10b981', '#059669']} style={styles.boostPill}>
                <Text style={styles.boostText}>🛡️</Text>
              </LinearGradient>
            )}
            {activeBoosts.includes('freeze') && (
              <LinearGradient colors={['#06b6d4', '#0891b2']} style={styles.boostPill}>
                <Text style={styles.boostText}>❄️</Text>
              </LinearGradient>
            )}
          </View>
        )}
      </View>

      {/* TABLERO MINIMALISTA VERTICAL */}
      <View style={styles.gameBoard}>
        {/* RIVAL - ARRIBA */}
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.05)']}
          style={styles.rivalSection}
        >
          <View style={styles.playerInfo}>
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              style={styles.playerAvatar}
            >
              <Text style={styles.avatarEmoji}>🤖</Text>
            </LinearGradient>
            <View>
              <Text style={styles.playerName}>CPU</Text>
              <Text style={styles.playerRole}>Oponente</Text>
            </View>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreNumber}>{cpuScore}</Text>
            <View style={styles.scoreLabelContainer}>
              <View style={styles.scoreDot} />
              <Text style={styles.scoreLabel}>PUNTOS</Text>
            </View>
          </View>
        </LinearGradient>

        {/* SEPARADOR VS */}
        <View style={styles.vsDivider}>
          <View style={styles.vsLine} />
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.vsLine} />
        </View>

        {/* JUGADOR - ABAJO (ÁREA DE TAP) */}
        <TouchableOpacity 
          style={styles.playerSection}
          onPress={handleTap}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#6366f1', '#4f46e5', '#4338ca']}
            style={styles.tapGradient}
          >
            <View style={styles.tapHeader}>
              <View style={styles.tapPulse} />
              <Text style={styles.tapInstruction}>TOCA PARA ANOTAR</Text>
            </View>
            
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Text style={styles.myScoreDisplay}>{myScore}</Text>
            </Animated.View>
            
            <View style={styles.myPlayerInfo}>
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.myAvatar}
              >
                <Text style={styles.avatarEmoji}>👤</Text>
              </LinearGradient>
              <View>
                <Text style={styles.myPlayerName}>TÚ</Text>
                <Text style={styles.myPlayerRole}>Jugador Principal</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* PARTÍCULAS DE TAP */}
        {particles.map(p => (
          <FloatingText key={p.id} text={p.text} x={p.x} rotate={p.rotate} />
        ))}
        
        {/* EMOJIS DE REACCIÓN FLOTANTES */}
        {reactions.map(r => (
          <Animated.Text key={r.id} style={styles.reactionFloat}>
            {r.emoji}
          </Animated.Text>
        ))}
      </View>

      {/* BOTONES DE ACCIÓN - ESTILO JUEGOS MÓVILES */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.bottomActionBtn}
          onPress={() => setShowEmojis(!showEmojis)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={showEmojis ? ['#fbbf24', '#f59e0b'] : ['rgba(99, 102, 241, 0.9)', 'rgba(79, 70, 229, 0.9)']}
            style={styles.bottomActionGradient}
          >
            <Smile color="#fff" size={26} />
            <Text style={styles.bottomActionLabel}>Emojis</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomActionBtn}
          onPress={() => setShowChat(!showChat)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={showChat ? ['#10b981', '#059669'] : ['rgba(99, 102, 241, 0.9)', 'rgba(79, 70, 229, 0.9)']}
            style={styles.bottomActionGradient}
          >
            <MessageCircle color="#fff" size={26} />
            <Text style={styles.bottomActionLabel}>Chat</Text>
            {messages && messages.length > 0 && (
              <View style={styles.chatBadgeBottom}>
                <Text style={styles.chatBadgeText}>{messages.length}</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* PANEL DE EMOJIS */}
      {showEmojis && (
        <View style={styles.emojiPanel}>
          <Text style={styles.emojiTitle}>Enviar Reacción</Text>
          <View style={styles.emojiGrid}>
            {REACTION_EMOJIS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.emojiBtn}
                onPress={() => sendEmoji(item.emoji)}
              >
                <Text style={styles.emojiIcon}>{item.emoji}</Text>
                <Text style={styles.emojiName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* PANEL DE CHAT */}
      {showChat && (
        <View style={styles.chatPanel}>
          <LinearGradient
            colors={['#1e293b', '#0f172a']}
            style={styles.chatContainer}
          >
            <View style={styles.chatHeader}>
              <View style={styles.chatHeaderLeft}>
                <View style={styles.chatOnlineIndicator} />
                <View>
                  <Text style={styles.chatTitle}>Chat en Vivo</Text>
                  <Text style={styles.chatSubtitle}>Habla con tu rival</Text>
                </View>
              </View>
              <TouchableOpacity 
                onPress={() => setShowChat(false)}
                style={styles.chatCloseBtn}
              >
                <X color="#fff" size={20} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={messages || []}
              style={styles.chatList}
              contentContainerStyle={styles.chatListContent}
              keyExtractor={(item) => item.id?.toString()}
              renderItem={({ item }) => (
                <View style={[
                  styles.chatBubble,
                  item.sender === userProfile?.name && styles.chatBubbleMine
                ]}>
                  <Text style={styles.chatSender}>{item.sender}</Text>
                  <Text style={styles.chatText}>{item.text}</Text>
                  <Text style={styles.chatTime}>
                    {new Date(item.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.chatEmpty}>
                  <MessageCircle color="#475569" size={32} />
                  <Text style={styles.chatEmptyText}>No hay mensajes aún</Text>
                  <Text style={styles.chatEmptySubtext}>Sé el primero en escribir</Text>
                </View>
              }
            />
            
            <View style={styles.chatInputContainer}>
              <View style={styles.chatInputWrapper}>
                <TextInput
                  style={styles.chatTextInput}
                  placeholder="Escribe un mensaje..."
                  placeholderTextColor="#64748b"
                  value={chatMessage}
                  onChangeText={setChatMessage}
                  onSubmitEditing={sendMessage}
                  multiline
                  maxLength={200}
                />
                <TouchableOpacity 
                  style={[styles.chatSendBtn, !chatMessage.trim() && styles.chatSendBtnDisabled]}
                  onPress={sendMessage}
                  disabled={!chatMessage.trim()}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={chatMessage.trim() ? ['#6366f1', '#4f46e5'] : ['#475569', '#334155']}
                    style={styles.chatSendGradient}
                  >
                    <Send color="#fff" size={18} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const FloatingText = ({ text, x, rotate }) => {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const moveAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
            Animated.timing(moveAnim, { toValue: -250, duration: 1000, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1.5, friction: 4, useNativeDriver: true }),
        ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Animated.Text 
            style={[
                styles.particle, 
                { 
                    opacity: fadeAnim, 
                    transform: [
                        { translateY: moveAnim }, 
                        { translateX: x },
                        { rotate: `${rotate || 0}deg` },
                        { scale: scaleAnim }
                    ] 
                }
            ]}
        >
            {text}
        </Animated.Text>
    );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0f172a',
  },
  
  quitBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 50,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 5,
  },
  
  header: { 
    alignItems: 'center', 
    marginTop: 50, 
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  timerBox: { 
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timerText: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#fff',
    letterSpacing: 1,
  },
  boostsBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  boostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    elevation: 4,
  },
  boostText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  
  // TABLERO MINIMALISTA
  gameBoard: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 90,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  
  // SECCIÓN RIVAL
  rivalSection: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(239, 68, 68, 0.2)',
  },
  
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 15,
  },
  
  playerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  
  avatarEmoji: {
    fontSize: 28,
  },
  
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  playerRole: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    marginTop: 2,
  },
  
  scoreContainer: {
    alignItems: 'center',
  },
  
  scoreNumber: {
    fontSize: 56,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  scoreLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  
  scoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6366f1',
  },
  
  scoreLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  
  // DIVISOR VS
  vsDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 15,
  },
  
  vsLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(99, 102, 241, 0.5)',
  },
  
  vsText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#6366f1',
    paddingHorizontal: 15,
  },
  
  // SECCIÓN JUGADOR (ÁREA DE TAP)
  playerSection: {
    flex: 1,
    margin: 15,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
  },
  
  tapGradient: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 25,
  },
  
  tapHeader: {
    alignItems: 'center',
    gap: 8,
  },
  
  tapPulse: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  
  tapInstruction: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  
  myScoreDisplay: {
    fontSize: 96,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 6 },
    textShadowRadius: 12,
    letterSpacing: -4,
  },
  
  myPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  
  myAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  
  myPlayerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  myPlayerRole: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    marginTop: 2,
  },
  
  // BOTONES DE ACCIÓN - ESTILO JUEGOS MÓVILES
  bottomActions: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    paddingHorizontal: 20,
  },
  
  bottomActionBtn: {
    flex: 1,
    maxWidth: 140,
  },
  
  bottomActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  bottomActionLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  chatBadgeBottom: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
    paddingHorizontal: 6,
  },
  
  chatBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  
  chatBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  
  // PANEL DE EMOJIS
  emojiPanel: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    borderRadius: 20,
    padding: 15,
    borderWidth: 2,
    borderColor: '#fbbf24',
    elevation: 10,
  },
  
  emojiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  
  emojiBtn: {
    width: (width - 120) / 4,
    aspectRatio: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.5)',
  },
  
  emojiIcon: {
    fontSize: 32,
  },
  
  emojiName: {
    fontSize: 9,
    color: '#fff',
    marginTop: 4,
  },
  
  // PANEL DE CHAT
  chatPanel: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    height: height * 0.45,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  
  chatContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 24,
  },
  
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(99, 102, 241, 0.2)',
  },
  
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  chatOnlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  chatSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  
  chatCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  chatList: {
    flex: 1,
  },
  
  chatListContent: {
    padding: 16,
    paddingBottom: 8,
  },
  
  chatEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  
  chatEmptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 12,
  },
  
  chatEmptySubtext: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  
  chatBubble: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    maxWidth: '85%',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  
  chatBubbleMine: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignSelf: 'flex-end',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  
  chatSender: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  chatText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  
  chatTime: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  
  chatInputContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.2)',
    padding: 12,
  },
  
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },
  
  chatTextInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  
  chatSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  
  chatSendBtnDisabled: {
    opacity: 0.5,
  },
  
  chatSendGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  
  reactionFloat: {
    position: 'absolute',
    fontSize: 60,
    top: '30%',
    right: 40,
  },
  
  particle: { 
    position: 'absolute', 
    top: '25%',
    left: '10%',
    fontSize: 50, 
    fontWeight: '900', 
    zIndex: 10, 
    color: '#fff', 
    textShadowColor: '#000', 
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8 
  },
});