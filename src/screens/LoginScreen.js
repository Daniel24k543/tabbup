// src/screens/LoginScreen.js
import { useNavigation } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');

  // Cargamos el video local 'bg.mp4'
  const videoSource = require('../../assets/bg.mp4');

  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
    player.muted = true;
  });

  const handleLogin = () => {
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={styles.container}>
        {/* Video de Fondo */}
        <VideoView
          style={styles.video}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />

        {/* Capa oscura */}
        <View style={styles.overlay} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Text style={styles.title}>Tabbup</Text>
        <Text style={styles.subtitle}>Ingresa tu nombre para jugar</Text>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Ej: TapMaster"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>INGRESAR</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)' // Un poco transparente para ver los corazones
  },
  content: { flex: 1, justifyContent: 'center', padding: 30 },
  title: { fontSize: 48, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#fff', textAlign: 'center', marginBottom: 40 },
  inputContainer: { marginBottom: 25 },
  input: { 
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15, 
    padding: 20, 
    fontSize: 18, 
    color: '#fff',
    borderWidth: 1, 
    borderColor: 'rgba(255, 255, 255, 0.5)' 
  },
  loginBtn: { 
    backgroundColor: '#ff4d6d',
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#ff4d6d',
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  loginText: { color: '#fff', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 }
});