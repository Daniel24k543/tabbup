// src/screens/ShopScreen.js
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Check, Lock, Play, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';

// PUBLICIDAD (AdMob)
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

const { width } = Dimensions.get('window');
const adUnitId = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyy';

const rewarded = RewardedAd.createForAdRequest(adUnitId, { requestNonPersonalizedAdsOnly: true });

// --- CATÁLOGO DE PRODUCTOS ---

const COIN_PACKS = [
  { id: 'small', amount: 1000, price: '0.99', color: ['#4facfe', '#00f2fe'] },
  { id: 'medium', amount: 5000, price: '3.99', color: ['#43e97b', '#38f9d7'] },
  { id: 'large', amount: 10000, price: '7.99', color: ['#fa709a', '#fee140'] },
];

const TAP_ITEMS = {
  PERU: { name: 'Perú', icon: '🇵🇪', price: 500 },
  BOLIVIA: { name: 'Bolivia', icon: '🇧🇴', price: 500 },
  ARGENTINA: { name: 'Argentina', icon: '🇦🇷', price: 500 },
  MEXICO: { name: 'México', icon: '🇲🇽', price: 500 },
  CHILE: { name: 'Chile', icon: '🇨🇱', price: 500 },
  COLOMBIA: { name: 'Colombia', icon: '🇨🇴', price: 500 },
  BRAZIL: { name: 'Brasil', icon: '🇧🇷', price: 500 },
  SPAIN: { name: 'España', icon: '🇪🇸', price: 500 },
  USA: { name: 'USA', icon: '🇺🇸', price: 500 },
  FIRE: { name: 'Fuego', icon: '🔥', price: 1000 },
  STAR: { name: 'Estrellas', icon: '⭐', price: 1000 },
  HEART: { name: 'Amor', icon: '💖', price: 1000 },
  LIGHTNING: { name: 'Rayo', icon: '⚡', price: 1200 },
  ROCKET: { name: 'Cohete', icon: '🚀', price: 1500 },
  DIAMOND: { name: 'Diamante', icon: '💎', price: 2500 },
  CROWN: { name: 'Corona', icon: '👑', price: 3000 },
  TROPHY: { name: 'Trofeo', icon: '🏆', price: 3500 },
  SOCCER: { name: 'Fútbol', icon: '⚽', price: 1800 },
  GAMING: { name: 'Gaming', icon: '🎮', price: 2000 },
};

const BOARD_ITEMS = {
  DEFAULT: { name: 'Clásico', color: '#2c3e50', price: 0 },
  NEON: { name: 'Neón', color: '#2c0e52', price: 2000 },     // Morado Oscuro
  GARDEN: { name: 'Jardín', color: '#27ae60', price: 3000 },  // Verde
  OCEAN: { name: 'Océano', color: '#2980b9', price: 5000 },   // Azul
  LAVA: { name: 'Volcán', color: '#c0392b', price: 8000 },    // Rojo
  GOLD: { name: 'V.I.P', color: '#f1c40f', price: 15000 },    // Dorado
};

const BOOST_ITEMS = {
  DOUBLE_TAP: { name: 'Tap x2', icon: '⚡', description: 'Cada tap vale 2 puntos', price: 5000, duration: 60 },
  SHIELD: { name: 'Escudo', icon: '🛡️', description: 'Protección contra ataques', price: 4000, duration: 45 },
  FREEZE: { name: 'Congelar', icon: '❄️', description: 'Congela al rival 10 segundos', price: 6000, duration: 10 },
  SLOW_MOTION: { name: 'Cámara Lenta', icon: '🐌', description: 'Ralentiza al rival', price: 3500, duration: 30 },
  AUTO_TAP: { name: 'Auto-Tap', icon: '🤖', description: 'Taps automáticos', price: 7000, duration: 20 },
};

export default function ShopScreen() {
  const navigation = useNavigation();
  
  // Traemos todas las funciones del contexto
  const { 
    coins, awardCoins, 
    buyItem, equipItem, // Funciones genéricas que creamos
    unlockedSkins, tapSkin, 
    unlockedBoards, boardSkin,
    hasMicrophone, hasNoAds // NUEVO
  } = useGame();

  const [activeTab, setActiveTab] = useState('coins'); // coins | taps | boards | boosts | premium
  const [adLoaded, setAdLoaded] = useState(false);

  // Cargar Anuncio
  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => setAdLoaded(true));
    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      awardCoins(500);
      Alert.alert("¡Premio!", "Ganaste +500 Monedas 💰");
      setAdLoaded(false);
      rewarded.load();
    });
    rewarded.load();
    return () => { unsubscribeLoaded(); unsubscribeEarned(); };
  }, []);

  const showAd = () => {
    if (adLoaded) rewarded.show();
    else Alert.alert("Cargando...", "El video no está listo aún.");
  };

  const handleBuyCoins = (pack) => {
    Alert.alert("💳 Pago Simulado", `Comprando ${pack.amount} monedas...`, [
      { text: "Cancelar" },
      { text: "Pagar", onPress: () => { awardCoins(pack.amount); Alert.alert("¡Exitoso!"); } }
    ]);
  };

  // Manejador Genérico para comprar/equipar
  const handleItemAction = (type, key, itemData, unlockedList, currentEquipped) => {
    const isUnlocked = unlockedList.includes(key);
    
    if (isUnlocked) {
        equipItem(type, key);
        Alert.alert("¡Equipado!", `Usando: ${itemData.name}`);
    } else {
        Alert.alert("Comprar", `¿Gastar ${itemData.price} monedas en ${itemData.name}?`, [
            { text: "Cancelar", style: "cancel" },
            { text: "COMPRAR", onPress: () => {
                const success = buyItem(type, key, itemData.price);
                if (success) Alert.alert("¡Comprado!", "Ya es tuyo.");
                else Alert.alert("Error", "No tienes suficientes monedas.");
            }}
        ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#c0392b" />
      
      {/* Header */}
      <LinearGradient colors={['#c0392b', '#8e44ad']} style={styles.header}>
         <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color="#fff" size={26}/></TouchableOpacity>
            <Text style={styles.title}>TIENDA</Text>
            <View style={styles.coinBadge}><Text style={styles.coinText}>💰 {coins}</Text></View>
         </View>
      </LinearGradient>

      {/* PESTAÑAS (TABS) */}
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setActiveTab('coins')} style={[styles.tab, activeTab === 'coins' && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === 'coins' && styles.activeTabText]}>MONEDAS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('taks')} style={[styles.tab, activeTab === 'taks' && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === 'taks' && styles.activeTabText]}>EFECTOS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('boards')} style={[styles.tab, activeTab === 'boards' && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === 'boards' && styles.activeTabText]}>TABLEROS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('boosts')} style={[styles.tab, activeTab === 'boosts' && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === 'boosts' && styles.activeTabText]}>VENTAJAS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('premium')} style={[styles.tab, activeTab === 'premium' && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === 'premium' && styles.activeTabText]}>PREMIUM</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{padding: 20, paddingBottom: 50}}>
        
        {/* --- SECCIÓN MONEDAS --- */}
        {activeTab === 'coins' && (
            <>
                <TouchableOpacity style={styles.adCard} onPress={showAd}>
                    <LinearGradient colors={['#FF9800', '#F44336']} style={styles.gradientCard}>
                        <Play color="#fff" size={32} fill="#fff"/>
                        <View style={{marginLeft: 15}}>
                            <Text style={styles.adTitle}>VER VIDEO GRATIS</Text>
                            <Text style={styles.adSubtitle}>Gana +500 Monedas</Text>
                        </View>
                        {!adLoaded && <ActivityIndicator color="#fff" style={{marginLeft: 'auto'}}/>}
                    </LinearGradient>
                </TouchableOpacity>

                {COIN_PACKS.map(pack => (
                    <TouchableOpacity key={pack.id} onPress={() => handleBuyCoins(pack)} style={styles.packCard}>
                        <LinearGradient colors={pack.color} style={styles.gradientCard}>
                            <Sparkles color="#fff" size={24}/>
                            <Text style={styles.packAmount}>+{pack.amount}</Text>
                            <View style={styles.priceTag}><Text style={styles.priceText}>US$ {pack.price}</Text></View>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </>
        )}

        {/* --- SECCIÓN EFECTOS (TAKS) --- */}
        {activeTab === 'taks' && (
            <View style={styles.grid}>
                {Object.keys(TAP_ITEMS).map(key => {
                    const item = TAP_ITEMS[key];
                    const owned = unlockedSkins.includes(key);
                    const equipped = tapSkin === key;
                    return (
                        <TouchableOpacity key={key} style={[styles.skinCard, equipped && styles.equippedBorder]} onPress={() => handleItemAction('skin', key, item, unlockedSkins, tapSkin)}>
                            <Text style={{fontSize: 40}}>{item.icon}</Text>
                            <Text style={{fontWeight: 'bold', marginTop: 5}}>{item.name}</Text>
                            <Text style={{color: owned ? '#2ecc71' : '#f1c40f', fontWeight:'bold'}}>{owned ? (equipped ? 'EQUIPADO' : 'ADQUIRIDO') : `💰 ${item.price}`}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        )}

        {/* --- SECCIÓN TABLEROS (BOARDS) --- */}
        {activeTab === 'boards' && (
            <View style={styles.grid}>
                {Object.keys(BOARD_ITEMS).map(key => {
                    const item = BOARD_ITEMS[key];
                    const owned = unlockedBoards.includes(key);
                    const equipped = boardSkin === key;
                    return (
                        <TouchableOpacity key={key} style={[styles.boardCard, equipped && styles.equippedBorder]} onPress={() => handleItemAction('board', key, item, unlockedBoards, boardSkin)}>
                            {/* Vista Previa del Tablero (Color) */}
                            <View style={[styles.boardPreview, { backgroundColor: item.color }]}>
                                {equipped && <Check color="#fff" size={30} style={{opacity:0.8}}/>}
                                {!owned && <Lock color="rgba(255,255,255,0.5)" size={30} />}
                            </View>
                            
                            <View style={styles.boardInfo}>
                                <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.name}</Text>
                                <Text style={{color: owned ? '#2ecc71' : '#f1c40f', fontWeight:'bold'}}>
                                    {owned ? (equipped ? 'USANDO' : 'ADQUIRIDO') : `💰 ${item.price}`}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        )}

        {/* --- SECCIÓN VENTAJAS (BOOSTS) --- */}
        {activeTab === 'boosts' && (
            <View>
                <Text style={styles.boostHeader}>⚡ VENTAJAS PARA LA PARTIDA ⚡</Text>
                <Text style={styles.boostSubtitle}>Activa ventajas únicamente en la sala que creas</Text>
                
                {Object.keys(BOOST_ITEMS).map(key => {
                    const item = BOOST_ITEMS[key];
                    return (
                        <TouchableOpacity
                            key={key}
                            style={styles.boostCard}
                            onPress={() => {
                                Alert.alert(
                                    `${item.icon} ${item.name}`,
                                    `${item.description}\nDuración: ${item.duration}s\nPrecio: ${item.price} monedas\n\n¿Comprar y activar en tu próxima sala?`,
                                    [
                                        { text: "Cancelar", style: "cancel" },
                                        { text: "COMPRAR", onPress: () => {
                                            const success = buyItem('boost', key, item.price);
                                            if (success) {
                                                Alert.alert("✅ Activado!", `${item.name} estará activo en tu próxima sala creada.`);
                                            } else {
                                                Alert.alert("Error", "No tienes suficientes monedas.");
                                            }
                                        }}
                                    ]
                                );
                            }}
                        >
                            <LinearGradient
                                colors={['#8b5cf6', '#7c3aed']}
                                style={styles.boostGradient}
                            >
                                <Text style={styles.boostEmoji}>{item.icon}</Text>
                                <View style={styles.boostInfo}>
                                    <Text style={styles.boostName}>{item.name}</Text>
                                    <Text style={styles.boostDesc}>{item.description}</Text>
                                    <Text style={styles.boostDuration}>⏱️ {item.duration} segundos</Text>
                                </View>
                                <View style={styles.boostPriceBox}>
                                    <Text style={styles.boostPrice}>💰 {item.price}</Text>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    );
                })}
                
                <View style={styles.boostNote}>
                    <Text style={styles.noteText}>💡 Las ventajas solo funcionan en salas que tú creas</Text>
                    <Text style={styles.noteText}>⏳ Se activan al inicio de la partida</Text>
                </View>
            </View>
        )}

        {/* --- SECCIÓN PREMIUM --- */}
        {activeTab === 'premium' && (
            <View>
                {/* Micrófono */}
                <TouchableOpacity 
                    style={[styles.premiumCard, hasMicrophone && styles.purchasedCard]}
                    onPress={() => {
                        if (hasMicrophone) {
                            Alert.alert("✅ Ya comprado", "Ya tienes el micrófono desbloqueado");
                        } else {
                            Alert.alert(
                                "🎤 Micrófono de Voz",
                                "Desbloquea el chat de voz en las salas. Precio: 8,000 monedas",
                                [
                                    { text: "Cancelar", style: "cancel" },
                                    { text: "COMPRAR", onPress: () => {
                                        const success = buyItem('microphone', 'microphone', 8000);
                                        if (success) Alert.alert("¡Comprado!", "Micrófono desbloqueado 🎤");
                                        else Alert.alert("Error", "No tienes suficientes monedas.");
                                    }}
                                ]
                            );
                        }
                    }}
                >
                    <LinearGradient
                        colors={hasMicrophone ? ['#2ecc71', '#27ae60'] : ['#3b82f6', '#2563eb']}
                        style={styles.premiumGradient}
                    >
                        <View style={styles.premiumIcon}>
                            <Text style={styles.premiumEmoji}>🎤</Text>
                        </View>
                        <View style={styles.premiumInfo}>
                            <Text style={styles.premiumTitle}>Micrófono de Voz</Text>
                            <Text style={styles.premiumDesc}>
                                {hasMicrophone ? "✅ Desbloqueado" : "Habla con tus rivales en tiempo real"}
                            </Text>
                        </View>
                        {!hasMicrophone && (
                            <View style={styles.premiumPrice}>
                                <Text style={styles.premiumPriceText}>💰 8,000</Text>
                            </View>
                        )}
                        {hasMicrophone && (
                            <Check color="#fff" size={32} />
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                {/* Eliminar Anuncios */}
                <TouchableOpacity 
                    style={[styles.premiumCard, hasNoAds && styles.purchasedCard]}
                    onPress={() => {
                        if (hasNoAds) {
                            Alert.alert("✅ Ya comprado", "Ya tienes los anuncios eliminados");
                        } else {
                            Alert.alert(
                                "🚫 Eliminar Anuncios",
                                "Elimina todos los anuncios para siempre. Precio: 12,000 monedas",
                                [
                                    { text: "Cancelar", style: "cancel" },
                                    { text: "COMPRAR", onPress: () => {
                                        const success = buyItem('noads', 'noads', 12000);
                                        if (success) Alert.alert("¡Comprado!", "Anuncios eliminados 🎉");
                                        else Alert.alert("Error", "No tienes suficientes monedas.");
                                    }}
                                ]
                            );
                        }
                    }}
                >
                    <LinearGradient
                        colors={hasNoAds ? ['#2ecc71', '#27ae60'] : ['#fbbf24', '#f59e0b']}
                        style={styles.premiumGradient}
                    >
                        <View style={styles.premiumIcon}>
                            <Text style={styles.premiumEmoji}>🚫</Text>
                        </View>
                        <View style={styles.premiumInfo}>
                            <Text style={styles.premiumTitle}>Eliminar Anuncios</Text>
                            <Text style={styles.premiumDesc}>
                                {hasNoAds ? "✅ Sin anuncios" : "Juega sin interrupciones"}
                            </Text>
                        </View>
                        {!hasNoAds && (
                            <View style={styles.premiumPrice}>
                                <Text style={styles.premiumPriceText}>💰 12,000</Text>
                            </View>
                        )}
                        {hasNoAds && (
                            <Check color="#fff" size={32} />
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.premiumNote}>
                    <Text style={styles.noteText}>💡 Las compras Premium son permanentes</Text>
                </View>
            </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  coinBadge: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 15 },
  coinText: { color: '#ffd700', fontWeight: 'bold' },
  
  tabs: { flexDirection: 'row', backgroundColor: '#fff', margin: 20, borderRadius: 10, padding: 5 },
  tab: { flex: 1, padding: 12, alignItems: 'center', borderRadius: 8 },
  activeTab: { backgroundColor: '#c0392b' },
  tabText: { fontWeight: 'bold', color: '#555' },
  activeTabText: { color: '#fff' },
  
  // Cards
  adCard: { marginBottom: 20, borderRadius: 15, elevation: 5 },
  packCard: { marginBottom: 15, borderRadius: 15, elevation: 3 },
  gradientCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 15 },
  adTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  adSubtitle: { color: '#eee' },
  packAmount: { color: '#fff', fontSize: 24, fontWeight: 'bold', flex: 1, marginLeft: 10 },
  priceTag: { backgroundColor: '#fff', padding: 8, borderRadius: 8 },
  priceText: { fontWeight: 'bold' },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  // Skins Taks
  skinCard: { width: width/2 - 25, backgroundColor: '#fff', padding: 15, borderRadius: 15, marginBottom: 15, alignItems: 'center', elevation: 3, borderWidth: 2, borderColor: 'transparent' },
  
  // Boards Cards
  boardCard: { width: '100%', backgroundColor: '#fff', borderRadius: 15, marginBottom: 15, elevation: 3, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden' },
  boardPreview: { height: 100, justifyContent: 'center', alignItems: 'center' },
  boardInfo: { padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  
  equippedBorder: { borderColor: '#2ecc71' },
  
  // Premium Cards
  premiumCard: { 
    marginBottom: 20, 
    borderRadius: 15, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  purchasedCard: {
    opacity: 0.8,
  },
  premiumGradient: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 15,
    gap: 15,
  },
  premiumIcon: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumEmoji: {
    fontSize: 32,
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  premiumDesc: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
  },
  premiumPrice: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  premiumPriceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  premiumNote: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  noteText: {
    color: '#3b82f6',
    textAlign: 'center',
    fontSize: 14,
  },
  // ESTILOS DE BOOSTS
  boostHeader: {
    fontSize: 20,
    fontWeight: '900',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 8,
  },
  boostSubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  boostCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  boostGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 15,
  },
  boostEmoji: {
    fontSize: 48,
  },
  boostInfo: {
    flex: 1,
  },
  boostName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  boostDesc: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  boostDuration: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  boostPriceBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  boostPrice: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  boostNote: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
});