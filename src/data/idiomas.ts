export interface Idioma {
  codigo: string;      // para MyMemory API
  codigoVoz: string;  // para expo-speech TTS
  nombre: string;
  bandera: string;
}

export const IDIOMAS: Idioma[] = [
  { codigo: 'es', codigoVoz: 'es-ES', nombre: 'Español', bandera: '🇪🇸' },
  { codigo: 'en', codigoVoz: 'en-US', nombre: 'Inglés', bandera: '🇺🇸' },
  { codigo: 'pt', codigoVoz: 'pt-BR', nombre: 'Portugués', bandera: '🇧🇷' },
  { codigo: 'fr', codigoVoz: 'fr-FR', nombre: 'Francés', bandera: '🇫🇷' },
  { codigo: 'de', codigoVoz: 'de-DE', nombre: 'Alemán', bandera: '🇩🇪' },
  { codigo: 'it', codigoVoz: 'it-IT', nombre: 'Italiano', bandera: '🇮🇹' },
  { codigo: 'ja', codigoVoz: 'ja-JP', nombre: 'Japonés', bandera: '🇯🇵' },
  { codigo: 'zh', codigoVoz: 'zh-CN', nombre: 'Chino', bandera: '🇨🇳' },
  { codigo: 'ko', codigoVoz: 'ko-KR', nombre: 'Coreano', bandera: '🇰🇷' },
  { codigo: 'ru', codigoVoz: 'ru-RU', nombre: 'Ruso', bandera: '🇷🇺' },
  { codigo: 'ar', codigoVoz: 'ar-SA', nombre: 'Árabe', bandera: '🇸🇦' },
  { codigo: 'hi', codigoVoz: 'hi-IN', nombre: 'Hindi', bandera: '🇮🇳' },
];

export async function traducir(texto: string, desde: string, hacia: string): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${desde}|${hacia}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    throw new Error('Error de traducción');
  } catch {
    throw new Error('No se pudo traducir. Verificá tu conexión.');
  }
}

// Sugerencias de respuesta según contexto básico
export const SUGERENCIAS: { [key: string]: string[] } = {
  saludo: ['Hola, ¿cómo estás?', 'Mucho gusto', 'Buenos días', '¿Hablas español?'],
  afirmacion: ['Sí, entiendo', 'De acuerdo', 'Por supuesto', 'Está bien'],
  negacion: ['No entiendo', 'Por favor repite', 'Habla más despacio', 'No, gracias'],
  ayuda: ['¿Puedes ayudarme?', '¿Dónde está...?', 'Necesito ayuda', '¿Cuánto cuesta?'],
  despedida: ['Hasta luego', 'Gracias', 'Fue un placer', 'Adiós'],
};

export function getSugerencias(texto: string): string[] {
  const t = texto.toLowerCase();
  if (t.includes('hola') || t.includes('hello') || t.includes('hi') || t.includes('buenos')) {
    return SUGERENCIAS.saludo;
  }
  if (t.includes('gracias') || t.includes('thank') || t.includes('adios') || t.includes('bye')) {
    return SUGERENCIAS.despedida;
  }
  if (t.includes('no') || t.includes('repeat') || t.includes('slow')) {
    return SUGERENCIAS.negacion;
  }
  if (t.includes('help') || t.includes('ayuda') || t.includes('where') || t.includes('donde')) {
    return SUGERENCIAS.ayuda;
  }
  return SUGERENCIAS.afirmacion;
}
