import { LinearGradient } from 'expo-linear-gradient';
import {
    Award,
    Check,
    Crown,
    Gift,
    Lock,
    Sparkles,
    Star,
    Target,
    Trophy,
    Zap
} from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';

const BattlePassScreen = ({ navigation }) => {
  const { userProfile, coins, awardCoins } = useGame();
  const [hasPremium, setHasPremium] = useState(false);
  
  // XP actual y nivel del Battle Pass
  const currentXP = userProfile?.xp || 0;
  const currentTier = Math.min(Math.floor(currentXP / 100), 50); // 100 XP por nivel, máximo 50
  const xpInCurrentTier = currentXP % 100;
  const xpNeededForNext = 100;

  // Definir recompensas por nivel
  const battlePassRewards = [
    // Nivel 1-10
    { tier: 1, free: { type: 'coins', amount: 100 }, premium: { type: 'skin', name: 'FIRE' } },
    { tier: 2, free: { type: 'coins', amount: 150 }, premium: { type: 'coins', amount: 500 } },
    { tier: 3, free: { type: 'coins', amount: 200 }, premium: { type: 'board', name: 'NEON' } },
    { tier: 4, free: { type: 'coins', amount: 250 }, premium: { type: 'coins', amount: 750 } },
    { tier: 5, free: { type: 'skin', name: 'STAR' }, premium: { type: 'skin', name: 'LIGHTNING' } },
    { tier: 6, free: { type: 'coins', amount: 300 }, premium: { type: 'coins', amount: 1000 } },
    { tier: 7, free: { type: 'coins', amount: 350 }, premium: { type: 'board', name: 'GARDEN' } },
    { tier: 8, free: { type: 'coins', amount: 400 }, premium: { type: 'coins', amount: 1250 } },
    { tier: 9, free: { type: 'coins', amount: 450 }, premium: { type: 'skin', name: 'ROCKET' } },
    { tier: 10, free: { type: 'skin', name: 'HEART' }, premium: { type: 'board', name: 'OCEAN' } },
    
    // Nivel 11-20
    { tier: 11, free: { type: 'coins', amount: 500 }, premium: { type: 'coins', amount: 1500 } },
    { tier: 12, free: { type: 'coins', amount: 550 }, premium: { type: 'skin', name: 'DIAMOND' } },
    { tier: 13, free: { type: 'coins', amount: 600 }, premium: { type: 'coins', amount: 1750 } },
    { tier: 14, free: { type: 'coins', amount: 650 }, premium: { type: 'board', name: 'LAVA' } },
    { tier: 15, free: { type: 'skin', name: 'MEXICO' }, premium: { type: 'skin', name: 'CROWN' } },
    { tier: 16, free: { type: 'coins', amount: 700 }, premium: { type: 'coins', amount: 2000 } },
    { tier: 17, free: { type: 'coins', amount: 750 }, premium: { type: 'skin', name: 'TROPHY' } },
    { tier: 18, free: { type: 'coins', amount: 800 }, premium: { type: 'coins', amount: 2250 } },
    { tier: 19, free: { type: 'coins', amount: 850 }, premium: { type: 'skin', name: 'SOCCER' } },
    { tier: 20, free: { type: 'coins', amount: 1000 }, premium: { type: 'board', name: 'GOLD' } },
    
    // Nivel 21-30
    { tier: 21, free: { type: 'coins', amount: 1100 }, premium: { type: 'coins', amount: 2500 } },
    { tier: 22, free: { type: 'coins', amount: 1200 }, premium: { type: 'skin', name: 'GAMING' } },
    { tier: 23, free: { type: 'coins', amount: 1300 }, premium: { type: 'coins', amount: 2750 } },
    { tier: 24, free: { type: 'coins', amount: 1400 }, premium: { type: 'skin', name: 'BRAZIL' } },
    { tier: 25, free: { type: 'skin', name: 'ARGENTINA' }, premium: { type: 'skin', name: 'SPAIN' } },
    { tier: 26, free: { type: 'coins', amount: 1500 }, premium: { type: 'coins', amount: 3000 } },
    { tier: 27, free: { type: 'coins', amount: 1600 }, premium: { type: 'skin', name: 'USA' } },
    { tier: 28, free: { type: 'coins', amount: 1700 }, premium: { type: 'coins', amount: 3250 } },
    { tier: 29, free: { type: 'coins', amount: 1800 }, premium: { type: 'coins', amount: 3500 } },
    { tier: 30, free: { type: 'coins', amount: 2000 }, premium: { type: 'coins', amount: 5000 } },
    
    // Nivel 31-40
    { tier: 31, free: { type: 'coins', amount: 2200 }, premium: { type: 'coins', amount: 5500 } },
    { tier: 32, free: { type: 'coins', amount: 2400 }, premium: { type: 'skin', name: 'CHILE' } },
    { tier: 33, free: { type: 'coins', amount: 2600 }, premium: { type: 'coins', amount: 6000 } },
    { tier: 34, free: { type: 'coins', amount: 2800 }, premium: { type: 'skin', name: 'COLOMBIA' } },
    { tier: 35, free: { type: 'skin', name: 'PERU' }, premium: { type: 'coins', amount: 7000 } },
    { tier: 36, free: { type: 'coins', amount: 3000 }, premium: { type: 'coins', amount: 7500 } },
    { tier: 37, free: { type: 'coins', amount: 3200 }, premium: { type: 'coins', amount: 8000 } },
    { tier: 38, free: { type: 'coins', amount: 3400 }, premium: { type: 'coins', amount: 8500 } },
    { tier: 39, free: { type: 'coins', amount: 3600 }, premium: { type: 'coins', amount: 9000 } },
    { tier: 40, free: { type: 'coins', amount: 4000 }, premium: { type: 'coins', amount: 10000 } },
    
    // Nivel 41-50
    { tier: 41, free: { type: 'coins', amount: 4500 }, premium: { type: 'coins', amount: 11000 } },
    { tier: 42, free: { type: 'coins', amount: 5000 }, premium: { type: 'coins', amount: 12000 } },
    { tier: 43, free: { type: 'coins', amount: 5500 }, premium: { type: 'coins', amount: 13000 } },
    { tier: 44, free: { type: 'coins', amount: 6000 }, premium: { type: 'coins', amount: 14000 } },
    { tier: 45, free: { type: 'coins', amount: 6500 }, premium: { type: 'coins', amount: 15000 } },
    { tier: 46, free: { type: 'coins', amount: 7000 }, premium: { type: 'coins', amount: 16000 } },
    { tier: 47, free: { type: 'coins', amount: 7500 }, premium: { type: 'coins', amount: 17000 } },
    { tier: 48, free: { type: 'coins', amount: 8000 }, premium: { type: 'coins', amount: 18000 } },
    { tier: 49, free: { type: 'coins', amount: 8500 }, premium: { type: 'coins', amount: 19000 } },
    { tier: 50, free: { type: 'coins', amount: 10000 }, premium: { type: 'coins', amount: 25000 } },
  ];

  const renderRewardIcon = (reward) => {
    if (reward.type === 'coins') {
      return <Text style={styles.coinIcon}>🪙</Text>;
    } else if (reward.type === 'skin') {
      return <Sparkles size={24} color="#fbbf24" />;
    } else if (reward.type === 'board') {
      return <Target size={24} color="#8b5cf6" />;
    }
    return <Gift size={24} color="#10b981" />;
  };

  const renderRewardLabel = (reward) => {
    if (reward.type === 'coins') {
      return `${reward.amount} monedas`;
    } else if (reward.type === 'skin') {
      return `Skin: ${reward.name}`;
    } else if (reward.type === 'board') {
      return `Tablero: ${reward.name}`;
    }
    return 'Recompensa';
  };

  const RewardItem = ({ tier, reward, isPremium, isUnlocked }) => {
    const locked = tier > currentTier;
    const claimed = tier <= currentTier && (!isPremium || hasPremium);

    return (
      <View style={[
        styles.rewardItem,
        isPremium && styles.premiumReward,
        claimed && styles.claimedReward
      ]}>
        {locked ? (
          <>
            <Lock size={20} color="#9ca3af" />
            <Text style={styles.lockedText}>Nivel {tier}</Text>
          </>
        ) : claimed ? (
          <>
            <View style={styles.rewardIconContainer}>
              {renderRewardIcon(reward)}
            </View>
            <Text style={styles.rewardText} numberOfLines={2}>
              {renderRewardLabel(reward)}
            </Text>
            <Check size={16} color="#10b981" style={styles.checkIcon} />
          </>
        ) : (
          <>
            <View style={styles.rewardIconContainer}>
              {renderRewardIcon(reward)}
            </View>
            <Text style={styles.rewardText} numberOfLines={2}>
              {renderRewardLabel(reward)}
            </Text>
            {isPremium && !hasPremium && (
              <Crown size={16} color="#fbbf24" style={styles.premiumIcon} />
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e293b', '#0f172a']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>BATTLE PASS</Text>
        <Text style={styles.subtitle}>Temporada 1</Text>

        {/* Progreso actual */}
        <View style={styles.progressSection}>
          <View style={styles.tierInfo}>
            <View style={styles.tierBadge}>
              <Trophy size={24} color="#fbbf24" />
              <Text style={styles.tierNumber}>{currentTier}</Text>
            </View>
            <View>
              <Text style={styles.tierLabel}>Nivel Actual</Text>
              <Text style={styles.xpText}>{xpInCurrentTier} / {xpNeededForNext} XP</Text>
            </View>
          </View>

          {/* Barra de progreso */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(xpInCurrentTier / xpNeededForNext) * 100}%` }]} />
          </View>
        </View>

        {/* Botón Premium */}
        {!hasPremium && (
          <TouchableOpacity 
            style={styles.premiumButton}
            onPress={() => {
              // Aquí iría la lógica de compra (5000 monedas)
              if (coins >= 5000) {
                setHasPremium(true);
                // awardCoins(-5000); // Descomentar cuando esté listo
                alert('¡Battle Pass Premium activado! 🎉');
              } else {
                alert('Necesitas 5,000 monedas para el Battle Pass Premium');
              }
            }}
          >
            <LinearGradient
              colors={['#fbbf24', '#f59e0b']}
              style={styles.premiumGradient}
            >
              <Crown size={20} color="#fff" />
              <Text style={styles.premiumButtonText}>Comprar Premium - 5,000 🪙</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {hasPremium && (
          <View style={styles.premiumBadge}>
            <Crown size={20} color="#fbbf24" />
            <Text style={styles.premiumBadgeText}>PREMIUM ACTIVO</Text>
          </View>
        )}
      </LinearGradient>

      {/* Lista de recompensas */}
      <ScrollView style={styles.rewardsContainer}>
        <View style={styles.rewardsTracks}>
          {/* Track Labels */}
          <View style={styles.trackLabels}>
            <View style={styles.trackLabel}>
              <Gift size={20} color="#10b981" />
              <Text style={styles.trackLabelText}>GRATIS</Text>
            </View>
            <View style={[styles.trackLabel, styles.premiumLabel]}>
              <Crown size={20} color="#fbbf24" />
              <Text style={styles.trackLabelText}>PREMIUM</Text>
            </View>
          </View>

          {/* Rewards Grid */}
          {battlePassRewards.map((item) => (
            <View key={item.tier} style={styles.tierRow}>
              <View style={styles.tierMarker}>
                <Text style={styles.tierMarkerText}>{item.tier}</Text>
              </View>
              
              <View style={styles.rewardPair}>
                <RewardItem 
                  tier={item.tier}
                  reward={item.free}
                  isPremium={false}
                  isUnlocked={item.tier <= currentTier}
                />
                
                <RewardItem 
                  tier={item.tier}
                  reward={item.premium}
                  isPremium={true}
                  isUnlocked={item.tier <= currentTier && hasPremium}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Información adicional */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Cómo ganar XP:</Text>
          <View style={styles.infoItem}>
            <Zap size={16} color="#fbbf24" />
            <Text style={styles.infoText}>Ganar partidas: +50 XP</Text>
          </View>
          <View style={styles.infoItem}>
            <Target size={16} color="#3b82f6" />
            <Text style={styles.infoText}>Completar misiones diarias: +20 XP</Text>
          </View>
          <View style={styles.infoItem}>
            <Award size={16} color="#8b5cf6" />
            <Text style={styles.infoText}>Completar misiones semanales: +100 XP</Text>
          </View>
          <View style={styles.infoItem}>
            <Star size={16} color="#10b981" />
            <Text style={styles.infoText}>Jugar partidas: +10 XP</Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    marginBottom: 10,
  },
  backText: {
    fontSize: 24,
    color: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  tierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierBadge: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  tierNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginTop: 2,
  },
  tierLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 2,
  },
  xpText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 6,
  },
  premiumButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 10,
  },
  premiumButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  premiumBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  rewardsContainer: {
    flex: 1,
  },
  rewardsTracks: {
    padding: 20,
  },
  trackLabels: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingLeft: 50,
  },
  trackLabel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    gap: 8,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  premiumLabel: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderColor: '#fbbf24',
  },
  trackLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tierMarker: {
    width: 40,
    height: 40,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#475569',
  },
  tierMarkerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  rewardPair: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  rewardItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
    borderWidth: 1,
    borderColor: '#334155',
  },
  premiumReward: {
    backgroundColor: 'rgba(251, 191, 36, 0.05)',
    borderColor: '#fbbf24',
  },
  claimedReward: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: '#10b981',
  },
  rewardIconContainer: {
    marginBottom: 6,
  },
  coinIcon: {
    fontSize: 24,
  },
  rewardText: {
    fontSize: 11,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  lockedText: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 5,
  },
  checkIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  premiumIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  infoSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  bottomPadding: {
    height: 30,
  },
});

export default BattlePassScreen;
