import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ConversacionScreen from './src/screens/ConversacionScreen';
import FrasesUtilesScreen from './src/screens/FrasesUtilesScreen';
import HistorialScreen from './src/screens/HistorialScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#111128',
            borderTopColor: '#1a1a3a',
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 6,
            height: 62,
          },
          tabBarActiveTintColor: '#4FC3F7',
          tabBarInactiveTintColor: '#555',
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          headerStyle: { backgroundColor: '#111128' },
          headerTintColor: '#4FC3F7',
          headerTitleStyle: { fontWeight: '700' as const },
        }}
      >
        <Tab.Screen
          name="Traductor"
          component={ConversacionScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🎙️</Text>,
            headerTitle: '🌐 Traductor en Vivo',
          }}
        />
        <Tab.Screen
          name="Frases"
          component={FrasesUtilesScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>💬</Text>,
            headerTitle: '💬 Frases Útiles',
          }}
        />
        <Tab.Screen
          name="Historial"
          component={HistorialScreen}
          options={{
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📜</Text>,
            headerTitle: '📜 Historial',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
