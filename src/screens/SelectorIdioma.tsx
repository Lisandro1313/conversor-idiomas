import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Modal, FlatList,
} from 'react-native';
import { IDIOMAS, Idioma } from '../data/idiomas';

interface Props {
  actual: Idioma;
  onSelect: (idioma: Idioma) => void;
  onClose: () => void;
}

export default function SelectorIdioma({ actual, onSelect, onClose }: Props) {
  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <Text style={styles.titulo}>Seleccionar idioma</Text>
        <FlatList
          data={IDIOMAS}
          keyExtractor={item => item.codigo}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, actual.codigo === item.codigo && styles.itemActivo]}
              onPress={() => onSelect(item)}
            >
              <Text style={styles.bandera}>{item.bandera}</Text>
              <Text style={[styles.nombre, actual.codigo === item.codigo && styles.nombreActivo]}>
                {item.nombre}
              </Text>
              {actual.codigo === item.codigo && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#111128', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 20, paddingBottom: 40, maxHeight: '60%',
  },
  titulo: {
    color: '#4FC3F7', fontSize: 16, fontWeight: '700',
    textAlign: 'center', marginBottom: 16,
  },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 24, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#1a1a3a',
  },
  itemActivo: { backgroundColor: '#1a1a3a' },
  bandera: { fontSize: 26 },
  nombre: { flex: 1, color: '#ccc', fontSize: 16 },
  nombreActivo: { color: '#fff', fontWeight: '700' },
  check: { color: '#4FC3F7', fontSize: 18, fontWeight: '700' },
});
