// src/screens/SettingsScreen.js
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {
    ArrowLeft,
    Award,
    Bell,
    Globe,
    LogOut,
    Medal,
    Star,
    Target,
    TrendingUp,
    Trophy,
    User,
    Volume2,
    Zap
} from 'lucide-react-native';
import { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { userProfile, coins } = useGame();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Calcular estadísticas
  const totalGames = userProfile?.totalGames || 0;
  const totalWins = userProfile?.totalWins || 0;
  const winRate = totalGames > 0 ? ((totalWins / totalGames) * 100).toFixed(1) : 0;
  const maxStreak = userProfile?.maxStreak || 0;
  const currentStreak = userProfile?.currentStreak || 0;
  const level = userProfile?.level || 1;
  const xp = userProfile?.xp || 0;
  const xpForNextLevel = level * 100;
  const xpInCurrentLevel = xp % 100;

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Salir", 
          style: "destructive",
          onPress: () => navigation.navigate('Login')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil y Ajustes</Text>
          <View style={{width: 24}} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          
          {/* PERFIL CARD */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.profileGradient}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>👤</Text>
                </View>
                <View style={styles.levelBadge}>
                  <Star size={12} color="#fbbf24" />
                  <Text style={styles.levelText}>{level}</Text>
                </View>
              </View>

              <Text style={styles.playerName}>{userProfile?.name || 'Guest_7034'}</Text>
              
              <View style={styles.countryBadge}>
                <Globe size={14} color="#fff" />
                <Text style={styles.countryText}>{userProfile?.country || '🇵🇪 Perú'}</Text>
              </View>

              {/* Barra de XP */}
              <View style={styles.xpSection}>
                <View style={styles.xpBar}>
                  <View style={[styles.xpFill, { width: `${(xpInCurrentLevel / xpForNextLevel) * 100}%` }]} />
                </View>
                <Text style={styles.xpText}>{xpInCurrentLevel} / {xpForNextLevel} XP</Text>
              </View>

              <View style={styles.coinsDisplay}>
                <Text style={styles.coinIcon}>💰</Text>
                <Text style={styles.coinAmount}>{coins || 0}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* ESTADÍSTICAS */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Estadísticas</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Trophy size={28} color="#fbbf24" />
                <Text style={styles.statValue}>{totalWins}</Text>
                <Text style={styles.statLabel}>Victorias</Text>
              </View>

              <View style={styles.statCard}>
                <Target size={28} color="#3b82f6" />
                <Text style={styles.statValue}>{totalGames}</Text>
                <Text style={styles.statLabel}>Partidas</Text>
              </View>

              <View style={styles.statCard}>
                <TrendingUp size={28} color="#10b981" />
                <Text style={styles.statValue}>{winRate}%</Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>

              <View style={styles.statCard}>
                <Zap size={28} color="#f59e0b" />
                <Text style={styles.statValue}>{currentStreak}</Text>
                <Text style={styles.statLabel}>Racha Actual</Text>
              </View>

              <View style={styles.statCard}>
                <Medal size={28} color="#8b5cf6" />
                <Text style={styles.statValue}>{maxStreak}</Text>
                <Text style={styles.statLabel}>Mejor Racha</Text>
              </View>

              <View style={styles.statCard}>
                <Award size={28} color="#ec4899" />
                <Text style={styles.statValue}>{level}</Text>
                <Text style={styles.statLabel}>Nivel</Text>
              </View>
            </View>
          </View>

          {/* CONFIGURACIÓN */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Configuración</Text>

            <View style={styles.settingsList}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Bell size={22} color="#3b82f6" />
                  <Text style={styles.settingLabel}>Notificaciones</Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#334155', true: '#3b82f6' }}
                  thumbColor={notificationsEnabled ? '#fff' : '#94a3af'}
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Volume2 size={22} color="#3b82f6" />
                  <Text style={styles.settingLabel}>Sonido</Text>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={setSoundEnabled}
                  trackColor={{ false: '#334155', true: '#3b82f6' }}
                  thumbColor={soundEnabled ? '#fff' : '#94a3af'}
                />
              </View>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <User size={22} color="#3b82f6" />
                  <Text style={styles.settingLabel}>Editar Perfil</Text>
                </View>
                <Text style={styles.settingArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Globe size={22} color="#3b82f6" />
                  <Text style={styles.settingLabel}>Cambiar País</Text>
                </View>
                <Text style={styles.settingArrow}>→</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.settingItem, styles.logoutItem]}
                onPress={handleLogout}
              >
                <View style={styles.settingLeft}>
                  <LogOut size={22} color="#ef4444" />
                  <Text style={[styles.settingLabel, styles.logoutText]}>Cerrar Sesión</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },

  // PROFILE CARD
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  profileGradient: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  levelBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#1e293b',
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  playerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  countryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  xpSection: {
    width: '100%',
    marginBottom: 15,
  },
  xpBar: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 5,
  },
  xpText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    gap: 8,
  },
  coinIcon: {
    fontSize: 20,
  },
  coinAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },

  // STATS SECTION
  statsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },

  // SETTINGS SECTION
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  settingsList: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 18,
    color: '#94a3b8',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ef4444',
  },
  bottomPadding: {
    height: 30,
  },
});