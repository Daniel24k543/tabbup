// src/screens/HomeScreen.js
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Cpu,
    Crown,
    Heart,
    Home,
    ShoppingCart,
    Smartphone,
    Target,
    Trophy,
    UserCircle,
    Users,
    Wifi,
    Zap
} from 'lucide-react-native';
import { useRef } from 'react';
import { Animated, Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';

const { width } = Dimensions.get('window');

// Componente con animación spring
const AnimatedGameButton = ({ style, onPress, children }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 3,
      tension: 40
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[style, { transform: [{ scale: scaleAnim }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const { setGameMode, coins, gems, userProfile } = useGame();

  const handlePress = (mode, target, params = {}) => {
    setGameMode(mode);
    navigation.navigate(target, params);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2b5c" />
      
      {/* FONDO DEGRADADO */}
      <LinearGradient
        colors={['#1a2b5c', '#2d4a8c', '#1a2b5c']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>👤</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>1</Text>
              </View>
            </View>
            <Text style={styles.userName}>{userProfile?.name || 'Guest_7034'}</Text>
          </View>

          <View style={styles.currencyRow}>
            <View style={styles.coinContainer}>
              <Text style={styles.coinIcon}>💰</Text>
              <Text style={styles.coinText}>{coins || 1500}</Text>
              <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.gemContainer}>
              <Text style={styles.gemIcon}>💎</Text>
              <Text style={styles.gemText}>{gems || 50}</Text>
              <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('BattlePass')}>
              <Crown color="#ffd700" size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* BATTLE PASS BANNER */}
        <TouchableOpacity 
          style={styles.battlePassBanner}
          onPress={() => navigation.navigate('BattlePass')}
        >
          <LinearGradient
            colors={['#fbbf24', '#f59e0b', '#d97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.battlePassGradient}
          >
            <View style={styles.battlePassLeft}>
              <Crown color="#fff" size={32} />
              <View style={styles.battlePassText}>
                <Text style={styles.battlePassTitle}>BATTLE PASS</Text>
                <Text style={styles.battlePassSubtitle}>Temporada 1 • 50 Niveles</Text>
              </View>
            </View>
            <View style={styles.battlePassRight}>
              <Text style={styles.battlePassCTA}>VER PREMIOS →</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* GRID DE MODOS DE JUEGO 3x2 */}
        <View style={styles.gameGrid}>
          
          {/* EN LÍNEA */}
          <AnimatedGameButton
            style={[styles.gameCard, {backgroundColor: '#4ade80'}]}
            onPress={() => handlePress('online_code', 'Lobby', { mode: 'join' })}
          >
            <View style={styles.cardGradient}>
              <Users color="#fff" size={35} strokeWidth={2.5} />
              <Text style={styles.cardTitle}>En línea</Text>
              <Text style={styles.cardSubtitle}>Unirse</Text>
            </View>
          </AnimatedGameButton>

          {/* VS CPU */}
          <AnimatedGameButton
            style={[styles.gameCard, {backgroundColor: '#facc15'}]}
            onPress={() => handlePress('offline', 'Lobby', { mode: 'cpu' })}
          >
            <View style={styles.cardGradient}>
              <Cpu color="#fff" size={35} strokeWidth={2.5} />
              <Text style={styles.cardTitle}>Vs CPU</Text>
              <Text style={styles.cardSubtitle}>Práctica</Text>
            </View>
          </AnimatedGameButton>

          {/* CLICS LIBRES */}
          <AnimatedGameButton
            style={[styles.gameCard, {backgroundColor: '#a78bfa'}]}
            onPress={() => navigation.navigate('FreeClick')}
          >
            <View style={styles.cardGradient}>
              <Zap color="#fff" size={35} strokeWidth={2.5} />
              <Text style={styles.cardTitle}>Clics Libres</Text>
              <Text style={styles.cardSubtitle}>Récord</Text>
            </View>
          </AnimatedGameButton>

          {/* LOCAL */}
          <AnimatedGameButton
            style={[styles.gameCard, {backgroundColor: '#f87171'}]}
            onPress={() => handlePress('offline', 'Lobby', { mode: 'local' })}
          >
            <View style={styles.cardGradient}>
              <Smartphone color="#fff" size={35} strokeWidth={2.5} />
              <Text style={styles.cardTitle}>Local</Text>
              <Text style={styles.cardSubtitle}>2 vs 2</Text>
            </View>
          </AnimatedGameButton>

          {/* CREAR SALA */}
          <AnimatedGameButton
            style={[styles.gameCard, {backgroundColor: '#60a5fa'}]}
            onPress={() => handlePress('online_code', 'Lobby', { mode: 'create' })}
          >
            <View style={styles.cardGradient}>
              <Wifi color="#fff" size={35} strokeWidth={2.5} />
              <Text style={styles.cardTitle}>Crear Sala</Text>
              <Text style={styles.cardSubtitle}>Anfitrión</Text>
            </View>
          </AnimatedGameButton>

          {/* MODO ROMÁNTICO */}
          <AnimatedGameButton
            style={[styles.gameCard, {backgroundColor: '#f472b6'}]}
            onPress={() => navigation.navigate('RomanticMode')}
          >
            <View style={styles.cardGradient}>
              <Heart color="#fff" size={35} strokeWidth={2.5} fill="#fff" />
              <Text style={styles.cardTitle}>Romántico</Text>
              <Text style={styles.cardSubtitle}>Te Amo</Text>
            </View>
          </AnimatedGameButton>

        </View>

        {/* RANURAS DE COFRE */}
        <View style={styles.chestsContainer}>
          <View style={styles.chestsRow}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.chestSlot}>
                <Text style={styles.lockIcon}>🔒</Text>
                <Text style={styles.chestLabel}>Ranura vacía</Text>
              </View>
            ))}
          </View>
        </View>

      </SafeAreaView>

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Shop')}>
          <ShoppingCart color="#fff" size={24} />
          <Text style={styles.navLabel}>Tienda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Missions')}>
          <Target color="#fff" size={24} />
          <Text style={styles.navLabel}>Misiones</Text>
        </TouchableOpacity>

        <View style={styles.centerNavItem}>
          <View style={styles.homeButton}>
            <Home color="#1a2b5c" size={32} />
          </View>
          <Text style={styles.navLabel}>INICIO</Text>
        </View>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Leaderboard')}>
          <Trophy color="#fff" size={24} />
          <Text style={styles.navLabel}>Ranking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <UserCircle color="#fff" size={24} />
          <Text style={styles.navLabel}>Perfil</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a2b5c',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  
  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 24,
  },
  levelBadge: {
    position: 'absolute',
    top: -2,
    left: -5,
    backgroundColor: '#fbbf24',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  levelText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  },
  userName: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  // CURRENCY
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  coinContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    gap: 5,
  },
  coinIcon: {
    fontSize: 16,
  },
  coinText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gemContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    gap: 5,
  },
  gemIcon: {
    fontSize: 16,
  },
  gemText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  addBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  settingsBtn: {
    padding: 5,
  },

  // BATTLE PASS BANNER
  battlePassBanner: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  battlePassGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  battlePassLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  battlePassText: {
    justifyContent: 'center',
  },
  battlePassTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  battlePassSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  battlePassRight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  battlePassCTA: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },

  // GAME GRID
  gameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  gameCard: {
    width: (width - 64) / 3,
    height: (width - 64) / 3,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    textAlign: 'center',
  },

  // CHESTS
  chestsContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  chestsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chestSlot: {
    width: (width - 60) / 4,
    height: (width - 60) / 4 + 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(147, 112, 219, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  lockIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  chestLabel: {
    fontSize: 9,
    color: '#a78bfa',
    textAlign: 'center',
    fontWeight: '600',
  },

  // BOTTOM NAV
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1e40af',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    color: '#fff',
    marginTop: 4,
    fontWeight: '600',
  },
  centerNavItem: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -20,
  },
  homeButton: {
    width: 70,
    height: 70,
    backgroundColor: '#60a5fa',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#1e40af',
    elevation: 8,
  },
});