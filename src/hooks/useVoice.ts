import { useState, useEffect, useCallback } from 'react';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';

export function useVoice() {
  const [escuchando, setEscuchando] = useState(false);
  const [textoReconocido, setTextoReconocido] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = () => setEscuchando(true);
    Voice.onSpeechEnd = () => setEscuchando(false);
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        setTextoReconocido(e.value[0]);
      }
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setError(e.error?.message || 'Error de reconocimiento');
      setEscuchando(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const iniciarEscucha = useCallback(async (codigoIdioma: string) => {
    try {
      setTextoReconocido('');
      setError('');
      await Voice.start(codigoIdioma);
    } catch (e) {
      setError('No se pudo iniciar el micrófono');
    }
  }, []);

  const detenerEscucha = useCallback(async () => {
    try {
      await Voice.stop();
    } catch {}
  }, []);

  return { escuchando, textoReconocido, error, iniciarEscucha, detenerEscucha };
}
