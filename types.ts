export interface TTSState {
  isLoading: boolean;
  isPlaying: boolean;
  audioUrl: string | null;
  error: string | null;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  voiceName: string;
  color: string;
  gradient: string;
  textColor: string;
  avatarSeed: string; // For deterministic random avatar
}

export const CHARACTERS: Character[] = [
  {
    id: 'kiko',
    name: 'Kiko',
    role: 'Autoconciencia',
    description: 'Es un hombre tranquilo que le gusta meditar y maneja la autoconciencia. Tiene una voz que te genera paz.',
    voiceName: 'Charon', // Deep, calm male voice
    color: 'bg-indigo-500',
    gradient: 'from-indigo-400 to-purple-500',
    textColor: 'text-indigo-300',
    avatarSeed: 'kiko'
  },
  {
    id: 'lila',
    name: 'Lila',
    role: 'Autorregulación',
    description: 'Es una mujer joven que maneja la autorregulación. Su voz es tranquila y divertida.',
    voiceName: 'Kore', // Warm female voice
    color: 'bg-pink-500',
    gradient: 'from-pink-400 to-rose-500',
    textColor: 'text-pink-300',
    avatarSeed: 'lila'
  },
  {
    id: 'nimbus',
    name: 'Nimbus',
    role: 'Conciencia Social',
    description: 'Es un hombre joven, enamorado de los animales y las personas. Tiene una voz alegre y serena.',
    voiceName: 'Fenrir', // Changed to Fenrir per user request
    color: 'bg-sky-500',
    gradient: 'from-sky-400 to-cyan-500',
    textColor: 'text-sky-300',
    avatarSeed: 'nimbus'
  },
  {
    id: 'rox',
    name: 'Rox',
    role: 'Habilidades de Relación',
    description: 'Es un hombre muy alegre y le gusta hablar. Su voz es alegre y divertida.',
    voiceName: 'Aoede', // Changed to Aoede per user request
    color: 'bg-amber-500',
    gradient: 'from-amber-400 to-orange-500',
    textColor: 'text-amber-300',
    avatarSeed: 'rox'
  },
  {
    id: 'zaz',
    name: 'Zaz',
    role: 'Toma de Decisiones',
    description: 'Es un hombre determinado y le gusta planear. Su voz es concreta e intelectual.',
    voiceName: 'Fenrir', // Strong, authoritative male voice
    color: 'bg-slate-500',
    gradient: 'from-slate-400 to-gray-600',
    textColor: 'text-slate-300',
    avatarSeed: 'zaz'
  },
  {
    id: 'giro',
    name: 'Giro',
    role: 'Responsabilidad',
    description: 'Es un hombre muy joven y el más responsable. Su voz es un poco chillona (aguda).',
    voiceName: 'Puck', // Changed to Puck per user request
    color: 'bg-lime-500',
    gradient: 'from-lime-400 to-green-500',
    textColor: 'text-lime-300',
    avatarSeed: 'giro'
  }
];

export const DEFAULT_SCRIPT = `¡Hola educador/a! empezaste la Travesía Sociemocional y esta embarcación ya zarpó.
Bienvenido/a a un recorrido lleno de descubrimientos sobre un tema tan profundo como fascinante. Lo exploraremos paso a paso con calma y curiosidad.`;

export const MAIA_SYSTEM_INSTRUCTION = `Actúa como Maia, una instructora experta en educación virtual.

Tu Voz y Acento:
Eres mujer.
Tu acento es Español Latinoamericano Neutro (es-419). Es vital que mantengas este acento de forma consistente; no uses modismos de España (como "vosotros" o la distinción de "c"/"z") ni jerga coloquial de un solo país.
Tu tono es cálido, amigable, paciente y cercano, como una compañera que te guía, no como un robot o una profesora estricta. Sonríes mientras hablas.

Tu Misión:
Explicar a estudiantes latinoamericanos de qué se compone un curso virtual.
El ritmo debe ser pausado y claro, fácil de seguir.

Reglas de Consistencia:
Nunca cambies tu personalidad ni tu acento, incluso si el texto es técnico.
Si encuentras términos en inglés (como "LMS", "feedback", "webinar"), pronúncialos con naturalidad pero con fonética clara.
Usa pausas naturales para separar ideas importantes.`;