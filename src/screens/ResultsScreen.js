// src/screens/ResultsScreen.js
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, RotateCcw, Trophy } from 'lucide-react-native';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

export default function ResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { players, gameMode, awardCoins, finishGame } = useGame();
  
  // Obtener scores del route params (enviados desde GameScreen)
  const { playerScore = 0, cpuScore = 0 } = route.params || {};

  // Determinar ganador
  let winner = null;
  let didWin = false;

  if (gameMode === 'offline') {
    // Modo CPU
    didWin = playerScore > cpuScore;
    winner = didWin ? 'TÚ' : 'CPU';
  } else {
    // Modo multijugador
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    winner = sortedPlayers[0]?.name || 'Jugador';
    didWin = sortedPlayers[0]?.isMe || false;
  }

  // Dar recompensas
  useEffect(() => {
    if (didWin) {
      awardCoins(500); // Premio por ganar
    } else {
      awardCoins(100); // Consolación
    }
    finishGame(didWin);
  }, [didWin, awardCoins, finishGame]);

  const handleRematch = () => {
    navigation.replace('Game');
  };

  const goHome = () => {
    navigation.navigate('Home');
  };

  return (
    <LinearGradient colors={['#1e40af', '#3b82f6', '#1e40af']} style={styles.container}>
      <View style={styles.content}>
        
        {/* RESULTADO */}
        <View style={styles.resultBox}>
          {didWin ? (
            <>
              <Trophy color="#fbbf24" size={100} fill="#fbbf24" />
              <Text style={styles.resultTitle}>¡VICTORIA!</Text>
              <Text style={styles.resultSubtitle}>+500 💰</Text>
            </>
          ) : (
            <>
              <Text style={styles.sadEmoji}>😔</Text>
              <Text style={styles.resultTitle}>Derrota</Text>
              <Text style={styles.resultSubtitle}>+100 💰</Text>
            </>
          )}
        </View>

        {/* SCORES */}
        <View style={styles.scoresContainer}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>TÚ</Text>
            <Text style={styles.scoreValue}>{playerScore}</Text>
          </View>

          <Text style={styles.vsText}>VS</Text>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>{gameMode === 'offline' ? 'CPU' : 'RIVAL'}</Text>
            <Text style={styles.scoreValue}>{cpuScore}</Text>
          </View>
        </View>

        {/* ESTADÍSTICAS */}
        <View style={styles.statsBox}>
          <Text style={styles.statsTitle}>Estadísticas</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Ganador:</Text>
            <Text style={styles.statValue}>{winner}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Diferencia:</Text>
            <Text style={styles.statValue}>{Math.abs(playerScore - cpuScore)} taps</Text>
          </View>
        </View>

      </View>

      {/* BOTONES */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnHome} onPress={goHome}>
          <Home color="#fff" size={28} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.btnRematch} onPress={handleRematch}>
          <RotateCcw color="#fff" size={24} style={{marginRight: 10}}/>
          <Text style={styles.btnText}>REVANCHA</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  
  // RESULTADO
  resultBox: { 
    alignItems: 'center', 
    marginBottom: 40 
  },
  resultTitle: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: '#fff',
    marginTop: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowRadius: 10,
  },
  resultSubtitle: {
    fontSize: 24,
    color: '#fbbf24',
    fontWeight: 'bold',
    marginTop: 10,
  },
  sadEmoji: {
    fontSize: 100,
  },
  
  // SCORES
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    marginBottom: 30,
  },
  scoreCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#fff',
  },
  vsText: {
    fontSize: 32,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.5)',
  },
  
  // ESTADÍSTICAS
  statsBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // ACCIONES
  actions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: 15,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  btnHome: { 
    width: 70, 
    height: 70, 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  btnRematch: { 
    flex: 1, 
    height: 70, 
    backgroundColor: '#22c55e', 
    borderRadius: 35, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
  },
  btnText: { 
    color: '#fff', 
    fontWeight: '900', 
    fontSize: 20,
  }
});