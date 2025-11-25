// src/screens/MissionsScreen.js
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar, Check, Gift, Target, TrendingUp } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function MissionsScreen() {
  const navigation = useNavigation();
  const { 
    dailyMissions, 
    weeklyMissions, 
    achievements, 
    claimMissionReward 
  } = useGame();

  const [timeLeft, setTimeLeft] = useState({ daily: '', weekly: '' });

  // Calcular tiempo restante
  useEffect(() => {
    const updateTimers = () => {
      const now = new Date();
      
      // Tiempo hasta medianoche (reset diario)
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const msToMidnight = tomorrow - now;
      const hoursToMidnight = Math.floor(msToMidnight / (1000 * 60 * 60));
      const minutesToMidnight = Math.floor((msToMidnight % (1000 * 60 * 60)) / (1000 * 60));
      const secondsToMidnight = Math.floor((msToMidnight % (1000 * 60)) / 1000);
      
      // Tiempo hasta el lunes (reset semanal)
      const dayOfWeek = now.getDay();
      const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      const nextMonday = new Date(now);
      nextMonday.setDate(now.getDate() + daysToMonday);
      nextMonday.setHours(0, 0, 0, 0);
      const msToMonday = nextMonday - now;
      const daysLeft = Math.floor(msToMonday / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((msToMonday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      setTimeLeft({
        daily: `${hoursToMidnight}:${minutesToMidnight.toString().padStart(2, '0')}:${secondsToMidnight.toString().padStart(2, '0')}`,
        weekly: `${daysLeft}d ${hoursLeft}h`
      });
    };
    
    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, []);

  const claimReward = (mission, type) => {
    if ((mission.completed || mission.unlocked) && !mission.claimed) {
      const reward = claimMissionReward(mission.id, type);
      if (reward > 0) {
        Alert.alert('🎉 ¡Recompensa Reclamada!', `Has ganado ${reward} monedas 💰`, [
          { text: 'Genial!', style: 'default' }
        ]);
      }
    }
  };

  return (
    <LinearGradient colors={['#1e40af', '#3b82f6']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Misiones</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView style={styles.content}>
        {/* MISIONES DIARIAS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar color="#fbbf24" size={24} />
            <Text style={styles.sectionTitle}>Misiones Diarias</Text>
            <Text style={styles.sectionTimer}>{timeLeft.daily}</Text>
          </View>

          {dailyMissions && dailyMissions.length > 0 ? dailyMissions.map((mission) => (
            <View key={mission.id} style={styles.missionCard}>
              <View style={styles.missionLeft}>
                <View style={[styles.missionIcon, mission.completed && styles.missionIconCompleted]}>
                  {mission.claimed ? (
                    <Gift color="#fff" size={24} />
                  ) : mission.completed ? (
                    <Check color="#fff" size={24} />
                  ) : (
                    <Target color="#fff" size={24} />
                  )}
                </View>
                <View style={styles.missionInfo}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={styles.missionDesc}>{mission.desc}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${(mission.progress / mission.goal) * 100}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{mission.progress}/{mission.goal}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={[
                  styles.rewardBtn, 
                  mission.completed && !mission.claimed && styles.rewardBtnActive,
                  mission.claimed && styles.rewardBtnClaimed
                ]}
                onPress={() => claimReward(mission, 'daily')}
                disabled={!mission.completed || mission.claimed}
              >
                {mission.claimed ? (
                  <Check color="#10b981" size={24} />
                ) : (
                  <>
                    <Text style={styles.rewardCoin}>💰</Text>
                    <Text style={[styles.rewardText, mission.completed && styles.rewardTextActive]}>
                      {mission.reward}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )) : (
            <Text style={styles.noMissions}>Cargando misiones...</Text>
          )}
        </View>

        {/* MISIONES SEMANALES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp color="#22c55e" size={24} />
            <Text style={styles.sectionTitle}>Misiones Semanales</Text>
            <Text style={styles.sectionTimer}>{timeLeft.weekly}</Text>
          </View>

          {weeklyMissions && weeklyMissions.length > 0 ? weeklyMissions.map((mission) => (
            <View key={mission.id} style={styles.missionCard}>
              <View style={styles.missionLeft}>
                <View style={[styles.missionIcon, mission.completed && styles.missionIconCompleted]}>
                  {mission.claimed ? (
                    <Gift color="#fff" size={24} />
                  ) : mission.completed ? (
                    <Check color="#fff" size={24} />
                  ) : (
                    <Target color="#fff" size={24} />
                  )}
                </View>
                <View style={styles.missionInfo}>
                  <Text style={styles.missionTitle}>{mission.title}</Text>
                  <Text style={styles.missionDesc}>{mission.desc}</Text>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${(mission.progress / mission.goal) * 100}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{mission.progress}/{mission.goal}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={[
                  styles.rewardBtn, 
                  mission.completed && !mission.claimed && styles.rewardBtnActive,
                  mission.claimed && styles.rewardBtnClaimed
                ]}
                onPress={() => claimReward(mission, 'weekly')}
                disabled={!mission.completed || mission.claimed}
              >
                {mission.claimed ? (
                  <Check color="#10b981" size={24} />
                ) : (
                  <>
                    <Text style={styles.rewardCoin}>💰</Text>
                    <Text style={[styles.rewardText, mission.completed && styles.rewardTextActive]}>
                      {mission.reward}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )) : (
            <Text style={styles.noMissions}>Cargando misiones...</Text>
          )}
        </View>

        {/* LOGROS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Gift color="#a855f7" size={24} />
            <Text style={styles.sectionTitle}>Logros</Text>
          </View>

          {achievements && achievements.length > 0 ? achievements.map((achievement) => (
            <View key={achievement.id} style={[styles.achievementCard, (achievement.unlocked || achievement.completed) && styles.achievementUnlocked]}>
              <View style={styles.achievementLeft}>
                <View style={[styles.achievementIcon, (achievement.unlocked || achievement.completed) && styles.achievementIconUnlocked]}>
                  <Text style={styles.achievementEmoji}>🏆</Text>
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDesc}>{achievement.desc}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={[
                  styles.achievementReward,
                  (achievement.unlocked || achievement.completed) && !achievement.claimed && styles.rewardBtnActive,
                  achievement.claimed && styles.rewardBtnClaimed
                ]}
                onPress={() => claimReward(achievement, 'achievement')}
                disabled={!(achievement.unlocked || achievement.completed) || achievement.claimed}
              >
                {achievement.claimed ? (
                  <Check color="#10b981" size={24} />
                ) : (
                  <>
                    <Text style={styles.rewardCoin}>💰</Text>
                    <Text style={styles.achievementRewardText}>{achievement.reward}</Text>
                    {(achievement.unlocked || achievement.completed) && <Check color="#22c55e" size={20} />}
                  </>
                )}
              </TouchableOpacity>
            </View>
          )) : (
            <Text style={styles.noMissions}>Cargando logros...</Text>
          )}
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, marginBottom: 20 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  
  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1 },
  sectionTimer: { fontSize: 14, fontWeight: 'bold', color: '#fbbf24' },
  
  missionCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 15, padding: 15, marginBottom: 10 },
  missionLeft: { flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 },
  missionIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  missionIconCompleted: { backgroundColor: '#22c55e' },
  missionInfo: { flex: 1 },
  missionTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  missionDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progressBar: { flex: 1, height: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#22c55e', borderRadius: 4 },
  progressText: { fontSize: 12, fontWeight: 'bold', color: '#fff', minWidth: 50 },
  
  rewardBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, alignItems: 'center', minWidth: 70 },
  rewardBtnActive: { backgroundColor: '#fbbf24' },
  rewardBtnClaimed: { backgroundColor: 'rgba(16,185,129,0.3)' },
  rewardCoin: { fontSize: 20, marginBottom: 4 },
  rewardText: { fontSize: 14, fontWeight: 'bold', color: 'rgba(255,255,255,0.7)' },
  rewardTextActive: { color: '#fff' },
  noMissions: { textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 14, marginVertical: 20 },
  
  achievementCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 15, padding: 15, marginBottom: 10, opacity: 0.6 },
  achievementUnlocked: { backgroundColor: 'rgba(34,197,94,0.2)', opacity: 1 },
  achievementLeft: { flexDirection: 'row', alignItems: 'center', gap: 15, flex: 1 },
  achievementIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  achievementIconUnlocked: { backgroundColor: 'rgba(251,191,36,0.3)' },
  achievementEmoji: { fontSize: 28 },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  achievementDesc: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  achievementReward: { alignItems: 'center', gap: 2 },
  achievementRewardText: { fontSize: 14, fontWeight: 'bold', color: '#fbbf24' },
});
