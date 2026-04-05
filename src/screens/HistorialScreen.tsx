import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  FlatList, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { useFocusEffect } from '@react-navigation/native';
import { Mensaje } from './ConversacionScreen';

const HISTORIAL_KEY = 'conversor_historial';

export default function HistorialScreen() {
  const [historial, setHistorial] = useState<Mensaje[]>([]);

  const cargar = async () => {
    const raw = await AsyncStorage.getItem(HISTORIAL_KEY);
    if (raw) setHistorial(JSON.parse(raw));
    else setHistorial([]);
  };

  useFocusEffect(useCallback(() => { cargar(); }, []));

  const limpiar = () => {
    Alert.alert('Limpiar historial', '¿Borrar todas las traducciones guardadas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar', style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem(HISTORIAL_KEY);
          setHistorial([]);
        },
      },
    ]);
  };

  const reproducir = (m: Mensaje) => {
    Speech.speak(m.traducido, { rate: 0.9 });
  };

  if (historial.length === 0) {
    return (
      <View style={styles.vacio}>
        <Text style={{ fontSize: 60, marginBottom: 16 }}>📜</Text>
        <Text style={styles.vacioTexto}>Sin historial todavía</Text>
        <Text style={styles.vacioSub}>Las traducciones aparecerán aquí</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerContador}>{historial.length} traducciones</Text>
        <TouchableOpacity onPress={limpiar} style={styles.btnLimpiar}>
          <Text style={styles.btnLimpiarText}>🗑 Limpiar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={historial}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.idiomas}>
                {item.idiomaOrig} → {item.idiomaTrad}
              </Text>
              {item.fecha && <Text style={styles.fecha}>{item.fecha}</Text>}
            </View>
            <Text style={styles.original}>{item.original}</Text>
            <View style={styles.divider} />
            <View style={styles.tradRow}>
              <Text style={styles.traducido}>{item.traducido}</Text>
              <TouchableOpacity onPress={() => reproducir(item)} style={styles.playBtn}>
                <Text style={styles.playText}>🔊</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  vacio: { flex: 1, backgroundColor: '#0a0a1a', alignItems: 'center', justifyContent: 'center' },
  vacioTexto: { color: '#888', fontSize: 18, fontWeight: '600' },
  vacioSub: { color: '#555', fontSize: 14, marginTop: 6 },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, backgroundColor: '#111128',
    borderBottomWidth: 1, borderBottomColor: '#1a1a3a',
  },
  headerContador: { color: '#888', fontSize: 13 },
  btnLimpiar: { backgroundColor: '#1a1a3a', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  btnLimpiarText: { color: '#F44336', fontSize: 13, fontWeight: '600' },
  lista: { padding: 12, gap: 8 },
  card: {
    backgroundColor: '#111128', borderRadius: 14, padding: 14,
    borderLeftWidth: 3, borderLeftColor: '#4FC3F7',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  idiomas: { color: '#4FC3F7', fontSize: 12, fontWeight: '700' },
  fecha: { color: '#555', fontSize: 11 },
  original: { color: '#888', fontSize: 14, fontStyle: 'italic', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#1a1a3a', marginBottom: 8 },
  tradRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  traducido: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600' },
  playBtn: { padding: 4 },
  playText: { fontSize: 20 },
});
