// src/screens/LoadingScreen.js
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoadingScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Espera 3 segundos y pasa al Login
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* IMAGEN DE FONDO */}
      {/* Asegúrate de tener una foto llamada 'splash.png' en assets */}
      {/* Si tu foto es jpg, cambia abajo .png por .jpg */}
      <Image 
        source={require('../../assets/splash.png')} 
        style={styles.image}
        resizeMode="cover"
      />

      {/* Capa oscura para que el texto resalte */}
      <View style={styles.overlay} />

      {/* TEXTO ABAJO */}
      <View style={styles.textContainer}>
        <Text style={styles.loadingText}>Cargando amor...</Text>
        {/* Unos puntitos extra para decorar */}
        <Text style={styles.dots}>♥ ♥ ♥</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: {
    width: width,
    height: height,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Oscurece un poquito la foto
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Manda todo al fondo
    alignItems: 'center',
    paddingBottom: 60, // Espacio desde abajo
  },
  loadingText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    marginBottom: 10
  },
  dots: {
    color: '#ff4d6d', // Color rosado para los corazones
    fontSize: 20,
    fontWeight: 'bold'
  }
});