// src/screens/LoadingScreen.js
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Sparkles, Zap } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
  const navigation = useNavigation();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animación de pulso continuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación de rotación continua
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Navega al Login después de 3 segundos
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, pulseAnim, rotateAnim, navigation]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          
          {/* LOGO/TÍTULO DEL JUEGO */}
          <View style={styles.logoContainer}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <View style={styles.logoCircle}>
                <Zap color="#fff" size={80} strokeWidth={2.5} fill="#fbbf24" />
              </View>
            </Animated.View>
            
            <Text style={styles.title}>TABBUP</Text>
            <Text style={styles.subtitle}>¡Toca más rápido!</Text>
          </View>

          {/* ICONOS FLOTANTES DECORATIVOS */}
          <View style={styles.iconsContainer}>
            <Animated.View style={[styles.floatingIcon, { transform: [{ rotate: spin }] }]}>
              <Heart color="#f472b6" size={40} fill="#f472b6" />
            </Animated.View>
            <Animated.View style={[styles.floatingIcon, styles.iconRight, { 
              transform: [{ rotate: spin }] 
            }]}>
              <Sparkles color="#fbbf24" size={40} />
            </Animated.View>
          </View>

          {/* INDICADOR DE CARGA */}
          <View style={styles.loadingContainer}>
            <Animated.View style={[styles.loadingDot, { transform: [{ scale: pulseAnim }] }]} />
            <Animated.View style={[styles.loadingDot, styles.loadingDotDelay, { 
              transform: [{ scale: pulseAnim }] 
            }]} />
            <Animated.View style={[styles.loadingDot, styles.loadingDotDelay2, { 
              transform: [{ scale: pulseAnim }] 
            }]} />
          </View>

          <Text style={styles.loadingText}>Cargando...</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#667eea' 
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  logoCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },
  iconsContainer: {
    position: 'absolute',
    top: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  floatingIcon: {
    opacity: 0.7,
  },
  iconRight: {
    position: 'absolute',
    right: 40,
  },
  loadingContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  loadingDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  loadingDotDelay: {
    opacity: 0.7,
  },
  loadingDotDelay2: {
    opacity: 0.5,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
