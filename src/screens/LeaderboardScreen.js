// src/screens/LeaderboardScreen.js
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Award, Crown, Medal, Trophy } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function LeaderboardScreen() {
  const navigation = useNavigation();
  const { userProfile } = useGame();
  const [activeTab, setActiveTab] = useState('global'); // global | friends | clan

  // Datos de ejemplo (en producción vendría de Firebase)
  const globalLeaderboard = [
    { position: 1, name: 'ProGamer_99', score: 15420, avatar: '👑', country: '🇵🇪', rank: 'MAESTRO' },
    { position: 2, name: 'SpeedTapper', score: 14890, avatar: '🔥', country: '🇲🇽', rank: 'DIAMANTE' },
    { position: 3, name: 'TapMaster', score: 14230, avatar: '⚡', country: '🇦🇷', rank: 'DIAMANTE' },
    { position: 4, name: 'FastFingers', score: 13870, avatar: '💎', country: '🇨🇱', rank: 'PLATINO' },
    { position: 5, name: 'ElRapido123', score: 13450, avatar: '🚀', country: '🇨🇴', rank: 'PLATINO' },
    { position: 6, name: 'TapKing', score: 12980, avatar: '👾', country: '🇧🇷', rank: 'ORO' },
    { position: 7, name: 'Lightning', score: 12560, avatar: '⭐', country: '🇪🇸', rank: 'ORO' },
    { position: 8, name: 'ClickMaestro', score: 12120, avatar: '🎮', country: '🇺🇸', rank: 'ORO' },
  ];

  const getRankColor = (rank) => {
    switch(rank) {
      case 'MAESTRO': return '#ff00ff';
      case 'DIAMANTE': return '#00ffff';
      case 'PLATINO': return '#e5e7eb';
      case 'ORO': return '#fbbf24';
      case 'PLATA': return '#9ca3af';
      default: return '#cd7f32';
    }
  };

  const getRankBadge = (position) => {
    if (position === 1) return <Crown color="#fbbf24" size={24} />;
    if (position === 2) return <Medal color="#e5e7eb" size={24} />;
    if (position === 3) return <Award color="#cd7f32" size={24} />;
    return <Text style={styles.rankNumber}>#{position}</Text>;
  };

  return (
    <LinearGradient colors={['#1e40af', '#3b82f6']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Clasificación</Text>
        <View style={{width: 40}} />
      </View>

      {/* TABS */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'global' && styles.tabActive]}
          onPress={() => setActiveTab('global')}
        >
          <Trophy color={activeTab === 'global' ? '#fff' : 'rgba(255,255,255,0.5)'} size={20} />
          <Text style={[styles.tabText, activeTab === 'global' && styles.tabTextActive]}>Global</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.tabTextActive]}>Amigos</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'clan' && styles.tabActive]}
          onPress={() => setActiveTab('clan')}
        >
          <Text style={[styles.tabText, activeTab === 'clan' && styles.tabTextActive]}>Clan</Text>
        </TouchableOpacity>
      </View>

      {/* TOP 3 PODIO */}
      <View style={styles.podiumContainer}>
        <View style={styles.podiumPlace}>
          <View style={[styles.podiumAvatar, {backgroundColor: '#e5e7eb'}]}>
            <Text style={styles.podiumAvatarText}>{globalLeaderboard[1].avatar}</Text>
          </View>
          <Text style={styles.podiumName}>{globalLeaderboard[1].name}</Text>
          <Text style={styles.podiumScore}>{globalLeaderboard[1].score}</Text>
          <View style={[styles.podiumBar, {height: 80, backgroundColor: '#9ca3af'}]}>
            <Text style={styles.podiumRank}>2</Text>
          </View>
        </View>

        <View style={styles.podiumPlace}>
          <Crown color="#fbbf24" size={32} style={{marginBottom: 5}} />
          <View style={[styles.podiumAvatar, {backgroundColor: '#fbbf24'}]}>
            <Text style={styles.podiumAvatarText}>{globalLeaderboard[0].avatar}</Text>
          </View>
          <Text style={styles.podiumName}>{globalLeaderboard[0].name}</Text>
          <Text style={styles.podiumScore}>{globalLeaderboard[0].score}</Text>
          <View style={[styles.podiumBar, {height: 120, backgroundColor: '#fbbf24'}]}>
            <Text style={styles.podiumRank}>1</Text>
          </View>
        </View>

        <View style={styles.podiumPlace}>
          <View style={[styles.podiumAvatar, {backgroundColor: '#cd7f32'}]}>
            <Text style={styles.podiumAvatarText}>{globalLeaderboard[2].avatar}</Text>
          </View>
          <Text style={styles.podiumName}>{globalLeaderboard[2].name}</Text>
          <Text style={styles.podiumScore}>{globalLeaderboard[2].score}</Text>
          <View style={[styles.podiumBar, {height: 60, backgroundColor: '#f97316'}]}>
            <Text style={styles.podiumRank}>3</Text>
          </View>
        </View>
      </View>

      {/* LISTA */}
      <ScrollView style={styles.listContainer}>
        {globalLeaderboard.slice(3).map((player) => (
          <View key={player.rank} style={styles.playerCard}>
            <View style={styles.playerLeft}>
              {getRankBadge(player.rank)}
              <View style={styles.playerAvatar}>
                <Text style={styles.avatarText}>{player.avatar}</Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <View style={styles.playerMeta}>
                  <Text style={styles.playerCountry}>{player.country}</Text>
                  <View style={[styles.rankBadge, {borderColor: getRankColor(player.rank)}]}>
                    <Text style={[styles.rankText, {color: getRankColor(player.rank)}]}>{player.rank}</Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.playerScore}>{player.score}</Text>
          </View>
        ))}
      </ScrollView>

      {/* MI POSICIÓN */}
      <View style={styles.myPositionCard}>
        <Text style={styles.myPositionLabel}>Tu Posición</Text>
        <View style={styles.myPositionContent}>
          <Text style={styles.myPositionRank}>#247</Text>
          <Text style={styles.myPositionName}>{userProfile?.name || 'Guest'}</Text>
          <Text style={styles.myPositionScore}>8,450</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, marginBottom: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  
  tabsContainer: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 15, padding: 5 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 5 },
  tabActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  tabText: { fontSize: 14, fontWeight: 'bold', color: 'rgba(255,255,255,0.5)' },
  tabTextActive: { color: '#fff' },
  
  podiumContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 20, paddingHorizontal: 20, gap: 10 },
  podiumPlace: { flex: 1, alignItems: 'center' },
  podiumAvatar: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  podiumAvatarText: { fontSize: 30 },
  podiumName: { fontSize: 12, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  podiumScore: { fontSize: 14, fontWeight: '900', color: '#fbbf24', marginBottom: 8 },
  podiumBar: { width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10, justifyContent: 'flex-start', alignItems: 'center', paddingTop: 10 },
  podiumRank: { fontSize: 24, fontWeight: '900', color: '#fff' },
  
  listContainer: { flex: 1, paddingHorizontal: 20 },
  playerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 15, padding: 15, marginBottom: 10 },
  playerLeft: { flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 },
  rankNumber: { fontSize: 18, fontWeight: 'bold', color: '#fff', minWidth: 30 },
  playerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  playerMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  playerCountry: { fontSize: 16 },
  rankBadge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  rankText: { fontSize: 10, fontWeight: 'bold' },
  playerScore: { fontSize: 20, fontWeight: '900', color: '#fbbf24' },
  
  myPositionCard: { backgroundColor: 'rgba(251,191,36,0.2)', borderTopWidth: 2, borderColor: '#fbbf24', padding: 15 },
  myPositionLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 8 },
  myPositionContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  myPositionRank: { fontSize: 24, fontWeight: '900', color: '#fff' },
  myPositionName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  myPositionScore: { fontSize: 20, fontWeight: '900', color: '#fbbf24' },
});
