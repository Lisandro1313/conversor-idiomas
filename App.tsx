import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import ConversacionScreen from './src/screens/ConversacionScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>🌐 Traductor en Vivo</Text>
      </View>
      <ConversacionScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  topBar: {
    backgroundColor: '#111128',
    paddingTop: 52,
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a3a',
  },
  topBarTitle: {
    color: '#4FC3F7',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
