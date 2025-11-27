// src/screens/LobbyScreen.js
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Lock, Mic, MicOff, Share2, Trophy } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useGame } from '../context/GameContext';

export default function LobbyScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { mode } = route.params || { mode: 'create' };

  const { 
    createOnlineRoom, 
    joinOnlineRoom, 
    startGame,
    roomCode, 
    players = [],
    isHost,
    hasMicrophone // NUEVO
  } = useGame();
  
  const [loading, setLoading] = useState(false);
  const [inLobby, setInLobby] = useState(false);
  
  // CONFIGURACIÓN DE LA SALA
  const [maxPlayers, setMaxPlayers] = useState(4); // 2 o 4 jugadores
  const [selectedMode, setSelectedMode] = useState('CLASICO'); // CLASICO, RUSH, RAYO, CARRERA
  const [joinCodeInput, setJoinCodeInput] = useState('');

  useEffect(() => {
    // NO crear sala automáticamente, solo marcar inLobby si ya existe un roomCode
    if (roomCode && mode === 'create') {
      setInLobby(true);
    }
  }, [roomCode, mode]);

  const handleShare = async () => {
    try {
      const message = `🔥 ¡Únete a mi partida de Tabbup! 🔥\n\nCódigo: ${roomCode}\n\n¿Te atreves?`;
      await Share.share({ message });
    } catch (_error) {
      Alert.alert('Error al compartir');
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      await createOnlineRoom('Anfitrión', selectedMode);
      setInLobby(true);
    } catch (_error) {
      Alert.alert('Error', 'No se pudo crear la sala.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!joinCodeInput.trim()) return Alert.alert('Error', 'Ingresa el código de sala.');
    setLoading(true);
    try {
      const success = await joinOnlineRoom('Jugador', joinCodeInput);
      if (success) {
        setInLobby(true);
      } else {
        Alert.alert('Error', 'Sala no encontrada.');
      }
    } catch (_error) {
      Alert.alert('Error', 'Fallo de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = () => {
    if (mode === 'cpu' || mode === 'local') {
      // Para CPU y Local, ir directo al juego sin Firebase
      navigation.navigate('Game');
    } else {
      // Para online, usar startGame de Firebase
      startGame();
      navigation.navigate('Game');
    }
  };

  // MODOS DE JUEGO
  const gameModes = [
    { id: 'CLASICO', name: 'CLÁSICO', emoji: '🎯', color: '#3b82f6' },
    { id: 'RUSH', name: 'Rush', emoji: '📖', color: '#d97706' },
    { id: 'RAYO', name: 'Rayo', emoji: '⚡', color: '#fbbf24' },
    { id: 'CARRERA', name: 'Carrera', emoji: '🏁', color: '#b45309' },
  ];

  // --- VISTA 1: FORMULARIO (Configuración antes de crear/unirse) ---
  if (!inLobby) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1e40af' }}>
        <LinearGradient colors={['#1e40af', '#3b82f6']} style={styles.container}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#fff" size={28} />
          </TouchableOpacity>

        <Text style={styles.title}>
          {mode === 'create' && 'Configurar Sala'}
          {mode === 'join' && 'Unirse a Sala'}
          {mode === 'cpu' && 'Configurar Vs CPU'}
          {mode === 'local' && 'Configurar Local'}
        </Text>
        
        {mode === 'join' && (
          <>
            <Text style={styles.label}>Código de la Sala:</Text>
            <TextInput 
              style={[styles.input, styles.codeInput]} 
              placeholder="00000" 
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={5}
              value={joinCodeInput} 
              onChangeText={setJoinCodeInput} 
            />
            <TouchableOpacity style={styles.actionBtn} onPress={handleJoin} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>ENTRAR A SALA</Text>}
            </TouchableOpacity>
          </>
        )}

        {(mode === 'create' || mode === 'cpu' || mode === 'local') && (
          <>
            {/* SELECTOR DE JUGADORES */}
            <View style={styles.configCard}>
              <Text style={styles.configLabel}>Número de Jugadores</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  style={[styles.toggleBtn, maxPlayers === 2 && styles.toggleBtnActive]}
                  onPress={() => setMaxPlayers(2)}
                >
                  <Text style={[styles.toggleText, maxPlayers === 2 && styles.toggleTextActive]}>2</Text>
                  {maxPlayers === 2 && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.toggleBtn, maxPlayers === 4 && styles.toggleBtnActive]}
                  onPress={() => setMaxPlayers(4)}
                >
                  <Text style={[styles.toggleText, maxPlayers === 4 && styles.toggleTextActive]}>4</Text>
                  {maxPlayers === 4 && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              </View>
            </View>

            {/* MODOS DE JUEGO */}
            <View style={styles.configCard}>
              <Text style={styles.configLabel}>Modo de Juego</Text>
              <View style={styles.modesGridCompact}>
                {gameModes.map((gMode) => (
                  <TouchableOpacity
                    key={gMode.id}
                    style={[
                      styles.modeChip,
                      selectedMode === gMode.id && styles.modeChipActive
                    ]}
                    onPress={() => setSelectedMode(gMode.id)}
                  >
                    <Text style={styles.modeChipEmoji}>{gMode.emoji}</Text>
                    <Text style={[
                      styles.modeChipText,
                      selectedMode === gMode.id && styles.modeChipTextActive
                    ]}>
                      {gMode.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {mode === 'create' && (
              <TouchableOpacity style={styles.actionBtn} onPress={handleCreate} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>CREAR SALA</Text>}
              </TouchableOpacity>
            )}

            {(mode === 'cpu' || mode === 'local') && (
              <TouchableOpacity style={styles.actionBtn} onPress={() => setInLobby(true)} disabled={loading}>
                <Text style={styles.btnText}>CONTINUAR</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // --- VISTA 2: LOBBY CON CONFIGURACIÓN ---
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1e40af' }}>
      <KeyboardAvoidingView 
        style={{flex: 1}} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <LinearGradient colors={['#1e40af', '#3b82f6']} style={{flex: 1}}>
          <ScrollView contentContainerStyle={styles.lobbyContainer}>
          
          {/* HEADER CON CÓDIGO (solo para salas online) */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnLobby}>
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
            <View style={{flex: 1, alignItems: 'center'}}>
              {mode === 'create' ? (
                <>
                  <Text style={styles.codeLabel}>CÓDIGO</Text>
                  <Text style={styles.codeNumber}>{roomCode}</Text>
                </>
              ) : (
                <Text style={styles.codeLabel}>
                  {mode === 'cpu' && 'VS CPU'}
                  {mode === 'local' && 'LOCAL 2v2'}
                  {mode === 'join' && `SALA ${roomCode}`}
                </Text>
              )}
            </View>
            <View style={{width: 40}} />
          </View>

          {/* SELECTOR DE JUGADORES: 2 vs 4 */}
          <View style={styles.playerSelectorCard}>
            <Text style={styles.cardTitle}>Jugadores</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleBtn, maxPlayers === 2 && styles.toggleBtnActive]}
                onPress={() => setMaxPlayers(2)}
              >
                <Text style={[styles.toggleText, maxPlayers === 2 && styles.toggleTextActive]}>2</Text>
                {maxPlayers === 2 && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.toggleBtn, maxPlayers === 4 && styles.toggleBtnActive]}
                onPress={() => setMaxPlayers(4)}
              >
                <Text style={[styles.toggleText, maxPlayers === 4 && styles.toggleTextActive]}>4</Text>
                {maxPlayers === 4 && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            </View>
          </View>

          {/* LISTA DE JUGADORES CON PERFILES */}
          <View style={styles.playersListContainer}>
            <View style={styles.playerRow}>
              <View style={[styles.playerDot, { backgroundColor: '#22c55e' }]} />
              <View style={styles.playerProfileCircle}>
                <Text style={styles.profileEmoji}>👤</Text>
              </View>
              <Text style={styles.playerRowText}>
                {players[0]?.name || (mode === 'local' || mode === 'cpu' ? 'Jugador 1' : 'Esperando...')}
              </Text>
              {(players[0] || mode === 'local' || mode === 'cpu') && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            
            <View style={styles.playerRow}>
              <View style={[styles.playerDot, { backgroundColor: '#fbbf24' }]} />
              <View style={styles.playerProfileCircle}>
                <Text style={styles.profileEmoji}>{mode === 'cpu' ? '🤖' : '👤'}</Text>
              </View>
              <Text style={styles.playerRowText}>
                {players[1]?.name || (mode === 'cpu' ? '🤖 CPU' : mode === 'local' ? 'Jugador 2' : 'Esperando...')}
              </Text>
              {(players[1] || mode === 'local' || mode === 'cpu') && <Text style={styles.checkIcon}>✓</Text>}
            </View>
            
            {maxPlayers === 4 && (
              <>
                <View style={styles.playerRow}>
                  <View style={[styles.playerDot, { backgroundColor: '#ef4444' }]} />
                  <View style={styles.playerProfileCircle}>
                    <Text style={styles.profileEmoji}>👤</Text>
                  </View>
                  <Text style={styles.playerRowText}>
                    {players[2]?.name || (mode === 'local' ? 'Jugador 3' : 'Esperando...')}
                  </Text>
                  {(players[2] || mode === 'local') && <Text style={styles.checkIcon}>✓</Text>}
                </View>
                
                <View style={styles.playerRow}>
                  <View style={[styles.playerDot, { backgroundColor: '#3b82f6' }]} />
                  <View style={styles.playerProfileCircle}>
                    <Text style={styles.profileEmoji}>👤</Text>
                  </View>
                  <Text style={styles.playerRowText}>
                    {players[3]?.name || (mode === 'local' ? 'Jugador 4' : 'Esperando...')}
                  </Text>
                  {(players[3] || mode === 'local') && <Text style={styles.checkIcon}>✓</Text>}
                </View>
              </>
            )}
          </View>

          {/* BOTÓN DE MICRÓFONO */}
          <TouchableOpacity 
            style={[styles.microphoneBtn, !hasMicrophone && styles.microphoneLocked]}
            onPress={() => {
              if (!hasMicrophone) {
                Alert.alert(
                  "🔒 Micrófono Bloqueado",
                  "Compra el micrófono en la Tienda > Premium para habilitar el chat de voz",
                  [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Ir a Tienda", onPress: () => navigation.navigate('Shop') }
                  ]
                );
              } else {
                Alert.alert("🎤 Micrófono", "Chat de voz habilitado (función en desarrollo)");
              }
            }}
          >
            <View style={styles.micIconContainer}>
              {hasMicrophone ? (
                <Mic color="#fff" size={24} />
              ) : (
                <>
                  <MicOff color="#94a3b8" size={24} />
                  <Lock color="#94a3b8" size={14} style={styles.lockIcon} />
                </>
              )}
            </View>
            <Text style={[styles.micText, !hasMicrophone && styles.micTextLocked]}>
              {hasMicrophone ? "Chat de Voz" : "Bloqueado"}
            </Text>
          </TouchableOpacity>

          {/* MODOS DE JUEGO */}
          <View style={styles.modeCard}>
            <Text style={styles.cardTitle}>Modo de Juego</Text>
            <View style={styles.modesGrid}>
              {gameModes.map((gMode) => (
                <TouchableOpacity
                  key={gMode.id}
                  style={[
                    styles.modeBtn,
                    selectedMode === gMode.id && styles.modeBtnActive
                  ]}
                  onPress={() => setSelectedMode(gMode.id)}
                >
                  <Text style={styles.modeEmoji}>{gMode.emoji}</Text>
                  <Text style={[
                    styles.modeName,
                    selectedMode === gMode.id && styles.modeNameActive
                  ]}>
                    {gMode.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* RECOMPENSAS */}
          <View style={styles.rewardsCard}>
            <View style={styles.rewardRow}>
              <Trophy color="#fbbf24" size={24} />
              <Text style={styles.rewardText}>1er Lugar: </Text>
              <Text style={styles.rewardAmount}>+500 💰</Text>
            </View>
          </View>

          {/* COSTO DE ENTRADA */}
          <View style={styles.entryCard}>
            <Text style={styles.entryText}>Entrar: 💰 1,500</Text>
          </View>

          {/* BOTÓN COMPARTIR CÓDIGO (solo para crear sala) */}
          {mode === 'create' && (
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Share2 color="#fff" size={20} style={{marginRight: 10}}/>
              <Text style={styles.shareText}>COMPARTIR CÓDIGO</Text>
            </TouchableOpacity>
          )}

          {/* BOTÓN DE MICRÓFONO */}
          <TouchableOpacity 
            style={[styles.microphoneBtn, !hasMicrophone && styles.microphoneLocked]}
            onPress={() => {
              if (!hasMicrophone) {
                Alert.alert(
                  "🔒 Micrófono Bloqueado",
                  "Compra el micrófono en la Tienda > Premium para habilitar el chat de voz",
                  [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Ir a Tienda", onPress: () => navigation.navigate('Shop') }
                  ]
                );
              } else {
                Alert.alert("🎤 Micrófono", "Chat de voz habilitado (función en desarrollo)");
              }
            }}
          >
            <View style={styles.micIconContainer}>
              {hasMicrophone ? (
                <Mic color="#fff" size={24} />
              ) : (
                <>
                  <MicOff color="#94a3b8" size={24} />
                  <Lock color="#94a3b8" size={14} style={styles.lockIcon} />
                </>
              )}
            </View>
            <Text style={[styles.micText, !hasMicrophone && styles.micTextLocked]}>
              {hasMicrophone ? "Chat de Voz" : "Bloqueado"}
            </Text>
          </TouchableOpacity>

          {/* BOTÓN DE INICIAR */}
          {(mode === 'create' && isHost) || mode === 'cpu' || mode === 'local' ? (
            <TouchableOpacity style={styles.startBtn} onPress={handleStartGame}>
              <Text style={styles.startBtnText}>EMPEZAR PARTIDA</Text>
            </TouchableOpacity>
          ) : mode === 'join' ? (
            <View style={styles.footerWaiting}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.waitingText}>Esperando al anfitrión...</Text>
            </View>
          ) : null}
          
          <View style={{height: 40}} /> 
        </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 25, 
    paddingTop: 60 
  },
  
  backBtn: { 
    marginBottom: 20 
  },
  
  title: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: '#fff', 
    marginBottom: 25,
    textAlign: 'center'
  },
  
  label: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 8,
    marginTop: 10
  },
  
  input: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    padding: 18, 
    borderRadius: 15, 
    fontSize: 18, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.3)',
    color: '#fff'
  },

  // CONFIGURACIÓN DE SALA (antes de crear)
  configCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  
  configLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  modesGridCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
    width: '48%',
    justifyContent: 'center',
    gap: 8,
  },
  
  modeChipActive: {
    backgroundColor: 'rgba(251,191,36,0.3)',
    borderColor: '#fbbf24',
  },
  
  modeChipEmoji: {
    fontSize: 20,
  },
  
  modeChipText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
  },
  
  modeChipTextActive: {
    color: '#fff',
  },
  
  codeInput: { 
    textAlign: 'center', 
    fontSize: 24, 
    letterSpacing: 5, 
    fontWeight: 'bold' 
  },
  
  actionBtn: { 
    backgroundColor: '#22c55e', 
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center', 
    elevation: 5, 
    marginTop: 10 
  },
  
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 18, 
    letterSpacing: 1 
  },

  // LOBBY
  lobbyContainer: { 
    flexGrow: 1, 
    padding: 20, 
    paddingTop: 20 
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  
  backBtnLobby: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  codeLabel: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: 'rgba(255,255,255,0.7)', 
    letterSpacing: 2 
  },
  
  codeNumber: { 
    fontSize: 36, 
    fontWeight: '900', 
    color: '#fff', 
    letterSpacing: 8,
    marginTop: 5
  },
  
  // SELECTOR DE JUGADORES
  playerSelectorCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
    padding: 5,
    gap: 10,
  },
  
  toggleBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  
  toggleBtnActive: {
    backgroundColor: '#fbbf24',
  },
  
  toggleText: {
    fontSize: 24,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.5)',
  },
  
  toggleTextActive: {
    color: '#fff',
  },
  
  checkmark: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // LISTA DE JUGADORES
  playersListContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    gap: 15,
  },
  
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  playerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  
  playerProfileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  
  profileEmoji: {
    fontSize: 20,
  },
  
  playerRowText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  checkIcon: {
    fontSize: 20,
    color: '#22c55e',
    fontWeight: 'bold',
  },
  
  // MICRÓFONO
  microphoneBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    gap: 10,
    elevation: 5,
  },
  
  microphoneLocked: {
    backgroundColor: '#475569',
    opacity: 0.7,
  },
  
  micIconContainer: {
    position: 'relative',
  },
  
  lockIcon: {
    position: 'absolute',
    top: -4,
    right: -8,
  },
  
  micText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  micTextLocked: {
    color: '#94a3b8',
  },
  
  // MODOS DE JUEGO
  modeCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  
  modeBtn: {
    width: '45%',
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  
  modeBtnActive: {
    backgroundColor: 'rgba(251,191,36,0.3)',
    borderColor: '#fbbf24',
  },
  
  modeEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  
  modeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
  },
  
  modeNameActive: {
    color: '#fff',
  },
  
  // RECOMPENSAS
  rewardsCard: {
    backgroundColor: 'rgba(251,191,36,0.2)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  rewardText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  
  rewardAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fbbf24',
  },
  
  // COSTO
  entryCard: {
    backgroundColor: 'rgba(249,115,22,0.3)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f97316',
  },
  
  entryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  
  // COMPARTIR
  shareBtn: { 
    flexDirection: 'row', 
    backgroundColor: '#22c55e', 
    padding: 15, 
    borderRadius: 15, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 20,
    elevation: 5,
  },
  
  shareText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  // BOTÓN INICIAR
  startBtn: { 
    backgroundColor: '#ef4444', 
    padding: 18, 
    borderRadius: 20, 
    alignItems: 'center', 
    elevation: 5, 
    marginBottom: 20 
  },
  
  startBtnText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '900' 
  },
  
  footerWaiting: { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  
  waitingText: { 
    textAlign: 'center', 
    color: '#fff', 
    fontStyle: 'italic', 
    marginTop: 5 
  }
});