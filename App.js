// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/context/GameContext';

// Importar pantallas
import BattlePassScreen from './src/screens/BattlePassScreen';
import FreeClickScreen from './src/screens/FreeClickScreen';
import GameScreen from './src/screens/GameScreen';
import HomeScreen from './src/screens/HomeScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import LoginScreen from './src/screens/LoginScreen';
import MissionsScreen from './src/screens/MissionsScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import RomanticModeScreen from './src/screens/RomanticModeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ShopScreen from './src/screens/ShopScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator 
          initialRouteName="Loading" 
          screenOptions={{ 
            headerShown: false, 
            animationEnabled: true, 
            cardStyle: { backgroundColor: '#fff' }
          }}
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Lobby" component={LobbyScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="FreeClick" component={FreeClickScreen} />
          <Stack.Screen name="RomanticMode" component={RomanticModeScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Shop" component={ShopScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Missions" component={MissionsScreen} />
          <Stack.Screen name="BattlePass" component={BattlePassScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameProvider>
  );
}