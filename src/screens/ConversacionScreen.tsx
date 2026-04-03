import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Animated,
} from 'react-native';
import * as Speech from 'expo-speech';
import { useVoice } from '../hooks/useVoice';
import { IDIOMAS, Idioma, traducir, getSugerencias } from '../data/idiomas';
import SelectorIdioma from './SelectorIdioma';

interface Mensaje {
  id: number;
  original: string;
  traducido: string;
  lado: 'izquierda' | 'derecha';
}

export default function ConversacionScreen() {
  const [idiomaIzq, setIdiomaIzq] = useState<Idioma>(IDIOMAS[0]); // Español
  const [idiomaDer, setIdiomaDer] = useState<Idioma>(IDIOMAS[1]); // Inglés
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [traduciendo, setTraduciendo] = useState(false);
  const [ladoActivo, setLadoActivo] = useState<'izquierda' | 'derecha' | null>(null);
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [modalIdioma, setModalIdioma] = useState<'izq' | 'der' | null>(null);
  const [pulseAnim] = useState(new Animated.Value(1));

  const { escuchando, textoReconocido, error, iniciarEscucha, detenerEscucha } = useVoice();

  // Animación pulso micrófono
  useEffect(() => {
    if (escuchando) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [escuchando]);

  // Cuando Voice reconoce texto, traducir automáticamente
  useEffect(() => {
    if (textoReconocido && ladoActivo && !escuchando) {
      procesarTexto(textoReconocido, ladoActivo);
    }
  }, [textoReconocido, escuchando]);

  const procesarTexto = async (texto: string, lado: 'izquierda' | 'derecha') => {
    setTraduciendo(true);
    const desde = lado === 'izquierda' ? idiomaIzq : idiomaDer;
    const hacia = lado === 'izquierda' ? idiomaDer : idiomaIzq;

    try {
      const traducido = await traducir(texto, desde.codigo, hacia.codigo);
      const nuevoMensaje: Mensaje = {
        id: Date.now(),
        original: texto,
        traducido,
        lado,
      };
      setMensajes(prev => [...prev, nuevoMensaje]);
      setSugerencias(getSugerencias(texto));
      // Hablar la traducción automáticamente
      Speech.speak(traducido, { language: hacia.codigoVoz, rate: 0.9 });
    } catch {
      // silencio si falla
    } finally {
      setTraduciendo(false);
      setLadoActivo(null);
    }
  };

  const hablar = async (lado: 'izquierda' | 'derecha') => {
    if (escuchando) {
      await detenerEscucha();
      return;
    }
    const idioma = lado === 'izquierda' ? idiomaIzq : idiomaDer;
    setLadoActivo(lado);
    await iniciarEscucha(idioma.codigoVoz);
  };

  const reproducirSugerencia = async (texto: string) => {
    setTraduciendo(true);
    try {
      const traducido = await traducir(texto, idiomaIzq.codigo, idiomaDer.codigo);
      Speech.speak(traducido, { language: idiomaDer.codigoVoz, rate: 0.9 });
      const nuevoMensaje: Mensaje = {
        id: Date.now(),
        original: texto,
        traducido,
        lado: 'izquierda',
      };
      setMensajes(prev => [...prev, nuevoMensaje]);
    } catch {}
    finally { setTraduciendo(false); }
  };

  return (
    <View style={styles.container}>
      {/* Header idiomas */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.idiomaBtn} onPress={() => setModalIdioma('izq')}>
          <Text style={styles.idiomaBandera}>{idiomaIzq.bandera}</Text>
          <Text style={styles.idiomaNombre}>{idiomaIzq.nombre}</Text>
          <Text style={styles.idiomaArrow}>▾</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.swapBtn}
          onPress={() => { setIdiomaIzq(idiomaDer); setIdiomaDer(idiomaIzq); }}
        >
          <Text style={styles.swapText}>⇄</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.idiomaBtn} onPress={() => setModalIdioma('der')}>
          <Text style={styles.idiomaBandera}>{idiomaDer.bandera}</Text>
          <Text style={styles.idiomaNombre}>{idiomaDer.nombre}</Text>
          <Text style={styles.idiomaArrow}>▾</Text>
        </TouchableOpacity>
      </View>

      {/* Conversación */}
      <ScrollView
        style={styles.conversacion}
        contentContainerStyle={styles.conversacionContent}
      >
        {mensajes.length === 0 && (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>🎙️</Text>
            <Text style={styles.placeholderTexto}>
              Presioná el micrófono y empezá a hablar
            </Text>
            <Text style={styles.placeholderSub}>
              La traducción se reproduce automáticamente
            </Text>
          </View>
        )}

        {mensajes.map(m => (
          <View key={m.id} style={[styles.mensajeBurbuja, m.lado === 'derecha' && styles.mensajeDerecha]}>
            <Text style={styles.mensajeOriginal}>{m.original}</Text>
            <View style={styles.mensajeDivider} />
            <Text style={styles.mensajeTraducido}>{m.traducido}</Text>
          </View>
        ))}

        {traduciendo && (
          <View style={styles.traduciendo}>
            <ActivityIndicator size="small" color="#4FC3F7" />
            <Text style={styles.traduciendoText}>Traduciendo...</Text>
          </View>
        )}
      </ScrollView>

      {/* Sugerencias */}
      {sugerencias.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sugerenciasScroll}>
          {sugerencias.map((s, i) => (
            <TouchableOpacity key={i} style={styles.sugerenciaBtn} onPress={() => reproducirSugerencia(s)}>
              <Text style={styles.sugerenciaText}>💬 {s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Micrófonos */}
      <View style={styles.micRow}>
        {/* Micrófono izquierda */}
        <Animated.View style={ladoActivo === 'izquierda' ? { transform: [{ scale: pulseAnim }] } : {}}>
          <TouchableOpacity
            style={[styles.micBtn, ladoActivo === 'izquierda' && styles.micBtnActivo]}
            onPress={() => hablar('izquierda')}
          >
            <Text style={styles.micEmoji}>{ladoActivo === 'izquierda' && escuchando ? '⏹' : '🎙️'}</Text>
            <Text style={styles.micLabel}>{idiomaIzq.bandera} {idiomaIzq.nombre}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Micrófono derecha */}
        <Animated.View style={ladoActivo === 'derecha' ? { transform: [{ scale: pulseAnim }] } : {}}>
          <TouchableOpacity
            style={[styles.micBtn, ladoActivo === 'derecha' && styles.micBtnActivo]}
            onPress={() => hablar('derecha')}
          >
            <Text style={styles.micEmoji}>{ladoActivo === 'derecha' && escuchando ? '⏹' : '🎙️'}</Text>
            <Text style={styles.micLabel}>{idiomaDer.bandera} {idiomaDer.nombre}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Modal selector idioma */}
      {modalIdioma && (
        <SelectorIdioma
          actual={modalIdioma === 'izq' ? idiomaIzq : idiomaDer}
          onSelect={(idioma) => {
            if (modalIdioma === 'izq') setIdiomaIzq(idioma);
            else setIdiomaDer(idioma);
            setModalIdioma(null);
          }}
          onClose={() => setModalIdioma(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a1a' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#111128', paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#1a1a3a',
  },
  idiomaBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6,
  },
  idiomaBandera: { fontSize: 24 },
  idiomaNombre: { color: '#fff', fontSize: 15, fontWeight: '700' },
  idiomaArrow: { color: '#4FC3F7', fontSize: 14 },
  swapBtn: {
    backgroundColor: '#1a1a3a', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginHorizontal: 8,
  },
  swapText: { color: '#4FC3F7', fontSize: 22, fontWeight: '700' },
  conversacion: { flex: 1 },
  conversacionContent: { padding: 16, gap: 12, flexGrow: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  placeholderEmoji: { fontSize: 60, marginBottom: 16 },
  placeholderTexto: { color: '#ccc', fontSize: 17, textAlign: 'center', fontWeight: '600' },
  placeholderSub: { color: '#555', fontSize: 14, marginTop: 8, textAlign: 'center' },
  mensajeBurbuja: {
    backgroundColor: '#111128', borderRadius: 16,
    padding: 14, borderLeftWidth: 3, borderLeftColor: '#4FC3F7',
    maxWidth: '85%', alignSelf: 'flex-start',
  },
  mensajeDerecha: {
    alignSelf: 'flex-end', borderLeftWidth: 0,
    borderRightWidth: 3, borderRightColor: '#7C4DFF',
  },
  mensajeOriginal: { color: '#aaa', fontSize: 14, fontStyle: 'italic' },
  mensajeDivider: { height: 1, backgroundColor: '#1a1a3a', marginVertical: 8 },
  mensajeTraducido: { color: '#fff', fontSize: 17, fontWeight: '600' },
  traduciendo: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    alignSelf: 'center', paddingVertical: 8,
  },
  traduciendoText: { color: '#4FC3F7', fontSize: 14 },
  sugerenciasScroll: {
    maxHeight: 52, paddingHorizontal: 12,
    backgroundColor: '#111128', borderTopWidth: 1, borderTopColor: '#1a1a3a',
  },
  sugerenciaBtn: {
    backgroundColor: '#1a1a3a', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 10, marginRight: 8, marginVertical: 8,
  },
  sugerenciaText: { color: '#4FC3F7', fontSize: 13, fontWeight: '600' },
  micRow: {
    flexDirection: 'row', gap: 12, padding: 16,
    backgroundColor: '#111128', borderTopWidth: 1, borderTopColor: '#1a1a3a',
  },
  micBtn: {
    flex: 1, alignItems: 'center', backgroundColor: '#1a1a3a',
    borderRadius: 18, paddingVertical: 18,
    borderWidth: 2, borderColor: '#2a2a5a',
  },
  micBtnActivo: { borderColor: '#4FC3F7', backgroundColor: '#0d1f3a' },
  micEmoji: { fontSize: 34, marginBottom: 6 },
  micLabel: { color: '#ccc', fontSize: 13, fontWeight: '600' },
  errorText: {
    color: '#E74C3C', textAlign: 'center',
    paddingVertical: 8, backgroundColor: '#111128',
  },
});
