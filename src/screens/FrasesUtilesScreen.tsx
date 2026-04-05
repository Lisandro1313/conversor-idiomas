import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView,
} from 'react-native';
import * as Speech from 'expo-speech';
import { IDIOMAS, Idioma, traducir } from '../data/idiomas';
import SelectorIdioma from './SelectorIdioma';

interface Frase {
  es: string;
  emoji: string;
}

interface Categoria {
  nombre: string;
  emoji: string;
  color: string;
  frases: Frase[];
}

const CATEGORIAS: Categoria[] = [
  {
    nombre: 'Saludos', emoji: '👋', color: '#4FC3F7',
    frases: [
      { es: 'Hola, ¿cómo estás?', emoji: '😊' },
      { es: 'Buenos días', emoji: '🌅' },
      { es: 'Buenas tardes', emoji: '🌤️' },
      { es: 'Buenas noches', emoji: '🌙' },
      { es: 'Mucho gusto en conocerte', emoji: '🤝' },
      { es: 'Hasta luego', emoji: '👋' },
      { es: 'Por favor', emoji: '🙏' },
      { es: 'Gracias', emoji: '💙' },
    ],
  },
  {
    nombre: 'Emergencia', emoji: '🆘', color: '#F44336',
    frases: [
      { es: 'Necesito ayuda', emoji: '🆘' },
      { es: 'Llamen a la policía', emoji: '🚔' },
      { es: 'Necesito un médico', emoji: '🏥' },
      { es: 'Estoy perdido', emoji: '📍' },
      { es: '¿Dónde está el hospital?', emoji: '🏨' },
      { es: 'Me robaron', emoji: '🚨' },
      { es: 'Estoy alérgico a...', emoji: '⚠️' },
    ],
  },
  {
    nombre: 'Transporte', emoji: '🚌', color: '#FF9800',
    frases: [
      { es: '¿Dónde está el aeropuerto?', emoji: '✈️' },
      { es: '¿Cómo llego al centro?', emoji: '🗺️' },
      { es: 'Un taxi, por favor', emoji: '🚖' },
      { es: '¿Cuánto cuesta el boleto?', emoji: '🎫' },
      { es: 'Quiero ir a...', emoji: '📌' },
      { es: '¿A qué hora sale el próximo tren?', emoji: '🚆' },
      { es: 'Pare aquí, por favor', emoji: '🛑' },
    ],
  },
  {
    nombre: 'Restaurante', emoji: '🍽️', color: '#4CAF50',
    frases: [
      { es: 'Una mesa para dos, por favor', emoji: '🪑' },
      { es: 'La carta, por favor', emoji: '📋' },
      { es: 'Soy vegetariano', emoji: '🥗' },
      { es: 'Sin gluten, por favor', emoji: '🌾' },
      { es: '¿Qué recomienda?', emoji: '⭐' },
      { es: 'La cuenta, por favor', emoji: '💳' },
      { es: 'Muy delicioso, gracias', emoji: '😋' },
    ],
  },
  {
    nombre: 'Hotel', emoji: '🏨', color: '#9C27B0',
    frases: [
      { es: 'Tengo una reserva a nombre de...', emoji: '📋' },
      { es: '¿A qué hora es el check-out?', emoji: '🕐' },
      { es: 'Necesito más toallas', emoji: '🛁' },
      { es: '¿Hay WiFi?', emoji: '📶' },
      { es: 'El aire acondicionado no funciona', emoji: '❄️' },
      { es: '¿Hay estacionamiento?', emoji: '🚗' },
    ],
  },
  {
    nombre: 'Compras', emoji: '🛍️', color: '#E91E63',
    frases: [
      { es: '¿Cuánto cuesta esto?', emoji: '💰' },
      { es: '¿Tiene descuento?', emoji: '🏷️' },
      { es: '¿Puedo probármelo?', emoji: '👕' },
      { es: 'Lo llevo', emoji: '✅' },
      { es: '¿Aceptan tarjeta?', emoji: '💳' },
      { es: '¿Tienen talle más grande?', emoji: '📏' },
    ],
  },
];

export default function FrasesUtilesScreen() {
  const [catActiva, setCatActiva] = useState(0);
  const [idiomaDestino, setIdiomaDestino] = useState<Idioma>(IDIOMAS[1]); // Inglés
  const [traducciones, setTraducciones] = useState<Record<string, string>>({});
  const [traduciendo, setTraduciendo] = useState<string | null>(null);
  const [modalIdioma, setModalIdioma] = useState(false);

  const cat = CATEGORIAS[catActiva];

  const obtenerTraduccion = async (frase: string) => {
    if (traducciones[frase]) {
      Speech.speak(traducciones[frase], { language: idiomaDestino.codigoVoz, rate: 0.9 });
      return;
    }
    setTraduciendo(frase);
    try {
      const trad = await traducir(frase, 'es', idiomaDestino.codigo);
      setTraducciones(prev => ({ ...prev, [frase]: trad }));
      Speech.speak(trad, { language: idiomaDestino.codigoVoz, rate: 0.9 });
    } catch {}
    finally { setTraduciendo(null); }
  };

  return (
    <View style={styles.container}>
      {/* Selector idioma destino */}
      <View style={styles.idiomaRow}>
        <Text style={styles.idiomaLabel}>Traducir al:</Text>
        <TouchableOpacity style={styles.idiomaSel} onPress={() => setModalIdioma(true)}>
          <Text style={styles.idiomaBandera}>{idiomaDestino.bandera}</Text>
          <Text style={styles.idiomaNombre}>{idiomaDestino.nombre}</Text>
          <Text style={styles.idiomaArrow}>▾</Text>
        </TouchableOpacity>
      </View>

      {/* Categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catsScroll}>
        {CATEGORIAS.map((c, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.catBtn, catActiva === i && { backgroundColor: c.color + '22', borderColor: c.color }]}
            onPress={() => { setCatActiva(i); setTraducciones({}); }}
          >
            <Text style={styles.catEmoji}>{c.emoji}</Text>
            <Text style={[styles.catNombre, catActiva === i && { color: c.color }]}>{c.nombre}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Frases */}
      <ScrollView style={styles.frasesScroll} contentContainerStyle={styles.frasesContent}>
        {cat.frases.map((f, i) => {
          const trad = traducciones[f.es];
          const cargando = traduciendo === f.es;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.fraseCard, { borderLeftColor: cat.color }]}
              onPress={() => obtenerTraduccion(f.es)}
            >
              <View style={styles.fraseHeader}>
                <Text style={styles.fraseEmoji}>{f.emoji}</Text>
                <View style={styles.fraseTextos}>
                  <Text style={styles.fraseEs}>{f.es}</Text>
                  {cargando && <Text style={styles.fraseTraduciendo}>Traduciendo...</Text>}
                  {trad && !cargando && (
                    <Text style={[styles.fraseTrad, { color: cat.color }]}>{trad}</Text>
                  )}
                </View>
                <Text style={styles.frasePlay}>
                  {cargando ? '⏳' : trad ? '🔊' : '▶'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {modalIdioma && (
        <SelectorIdioma
          actual={idiomaDestino}
          onSelect={(idioma) => { setIdiomaDestino(idioma); setTraducciones({}); setModalIdioma(false); }}
          onClose={() => setModalIdioma(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  idiomaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, backgroundColor: '#111128',
    borderBottomWidth: 1, borderBottomColor: '#1a1a3a',
  },
  idiomaLabel: { color: '#888', fontSize: 13 },
  idiomaSel: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1a1a3a', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  idiomaBandera: { fontSize: 18 },
  idiomaNombre: { color: '#fff', fontSize: 14, fontWeight: '700' },
  idiomaArrow: { color: '#4FC3F7', fontSize: 12 },

  catsScroll: { maxHeight: 72, backgroundColor: '#111128', borderBottomWidth: 1, borderBottomColor: '#1a1a3a' },
  catBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, marginHorizontal: 4, marginVertical: 8,
    backgroundColor: '#1a1a3a', borderRadius: 20,
    borderWidth: 1, borderColor: '#2a2a5a',
  },
  catEmoji: { fontSize: 16 },
  catNombre: { color: '#888', fontSize: 13, fontWeight: '600' },

  frasesScroll: { flex: 1 },
  frasesContent: { padding: 12, gap: 8 },
  fraseCard: {
    backgroundColor: '#111128', borderRadius: 14, padding: 14,
    borderLeftWidth: 3,
  },
  fraseHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fraseEmoji: { fontSize: 24, width: 32, textAlign: 'center' },
  fraseTextos: { flex: 1 },
  fraseEs: { color: '#fff', fontSize: 15, fontWeight: '600' },
  fraseTraduciendo: { color: '#555', fontSize: 13, marginTop: 4 },
  fraseTrad: { fontSize: 14, marginTop: 4, fontStyle: 'italic' },
  frasePlay: { fontSize: 20 },
});
