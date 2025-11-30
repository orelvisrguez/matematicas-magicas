
import { WorldConfig, WorldId, StoreItem, GrimoirePage, MiniGameConfig, Race, Achievement } from './types';
import { 
  Map, 
  Calculator, 
  X, 
  Divide, 
  Shapes, 
  Clock, 
  BrainCircuit 
} from 'lucide-react';

export const WORLDS: WorldConfig[] = [
  {
    id: WorldId.NUMBERS,
    title: "Isla de los Números",
    description: "El puente del Golem se ha derrumbado.",
    storyPlot: "Una tormenta mágica ha desordenado las Piedras del Orden. El Golem Guardián no puede reconstruir su puente para cruzar el Río del Olvido sin la secuencia correcta de números.",
    color: "bg-green-500",
    icon: "Map",
    requiredLevel: 0,
    totalQuestions: 5,
    orionIntro: "¡Bienvenido, Aprendiz! El caos ha llegado a la Isla. Debemos ordenar las piedras numéricas para que el Golem nos permita continuar nuestro viaje.",
    guardian: {
      name: "Golem de Piedra",
      avatar: "🗿",
      message: "¡Mis piedras están perdidas! Si no completas la secuencia, el puente caerá al abismo.",
      themeColor: "bg-stone-600"
    }
  },
  {
    id: WorldId.ADD_SUB,
    title: "Valle de Suma y Resta",
    description: "Las puertas mágicas han perdido su energía.",
    storyPlot: "El flujo de magia vital está bloqueado. Para abrir las Grandes Puertas del Valle y restaurar el río, debemos equilibrar las energías sumando lo que falta y restando lo que sobra.",
    color: "bg-blue-500",
    icon: "Calculator",
    requiredLevel: 1,
    totalQuestions: 5,
    orionIntro: "La energía de este valle es inestable. Sumar crea caminos, restar elimina obstáculos. ¡Usa tu mente para equilibrar la balanza mágica!",
    guardian: {
      name: "Troll del Puente",
      avatar: "👹",
      message: "¡Nadie pasa sin pagar el peaje exacto! Suma bien tus monedas o te quedarás aquí para siempre.",
      themeColor: "bg-emerald-800"
    }
  },
  {
    id: WorldId.MULT,
    title: "Bosque de Multiplicación",
    description: "Los cultivos mágicos han dejado de crecer.",
    storyPlot: "Un hechizo de sequía ha caído sobre el bosque. Los duendes granjeros necesitan multiplicar sus pocas semillas rápidamente para alimentar a la aldea antes de que llegue el invierno eterno.",
    color: "bg-emerald-600",
    icon: "X",
    requiredLevel: 2,
    totalQuestions: 5,
    orionIntro: "Aquí la magia debe ser veloz. Plantar de uno en uno es muy lento; usaremos el poder de la Multiplicación para crear bosques enteros en segundos.",
    guardian: {
      name: "Araña Tejedora",
      avatar: "🕷️",
      message: "Mis hijos tienen mucha hambre... ¡Resuelve mis redes de multiplicación o serás tú la cena!",
      themeColor: "bg-slate-800"
    }
  },
  {
    id: WorldId.DIV,
    title: "Cascadas de División",
    description: "Los piratas están peleando por el tesoro maldito.",
    storyPlot: "La tripulación del Capitán Barbarroja está a punto de amotinarse. Han encontrado un tesoro maldito pero no saben cómo repartirlo justamente. Si no los ayudas, el caos inundará el reino.",
    color: "bg-cyan-500",
    icon: "Divide",
    requiredLevel: 3,
    totalQuestions: 5,
    orionIntro: "El caos nace de la injusticia. Tu misión es usar la División para asegurar que cada pirata reciba su parte exacta y calmar las aguas turbulentas.",
    guardian: {
      name: "Pirata Repartidor",
      avatar: "🏴‍☠️",
      message: "¡Arrr! ¡Si sobra una sola moneda, te haré caminar por la plancha! ¡Divide el botín ahora!",
      themeColor: "bg-red-900"
    }
  },
  {
    id: WorldId.GEO,
    title: "Ciudad de Formas",
    description: "Los planos de la ciudad se están borrando.",
    storyPlot: "La Ciudad de Cristal se desmorona porque el Gran Arquitecto ha olvidado las formas sagradas. Debes identificar las figuras correctas para reconstruir los edificios antes de que colapsen.",
    color: "bg-purple-500",
    icon: "Shapes",
    requiredLevel: 4,
    totalQuestions: 5,
    orionIntro: "Todo en el universo tiene una forma. Sin geometría, la realidad se derrumba. Ayuda al Arquitecto a ver los patrones y sostener el mundo.",
    guardian: {
      name: "Arquitecto Cúbico",
      avatar: "🤖",
      message: "Mis cálculos deben ser precisos. ¿Encaja esta forma en mi diseño final o se caerá la torre?",
      themeColor: "bg-indigo-900"
    }
  },
  {
    id: WorldId.TIME,
    title: "Reino del Tiempo",
    description: "El Gran Reloj se ha detenido.",
    storyPlot: "El tiempo se ha congelado en un atardecer eterno. Los engranajes del Gran Reloj están atascados. Debes leer la hora exacta para sincronizarlos de nuevo y dejar que el mañana llegue.",
    color: "bg-orange-500",
    icon: "Clock",
    requiredLevel: 5,
    totalQuestions: 5,
    orionIntro: "El tiempo es la magia más antigua y peligrosa. Si no reparamos el Reloj, el sol nunca volverá a salir. ¡Atento a las manecillas!",
    guardian: {
      name: "Crono-Búho",
      avatar: "🦉",
      message: "Tic-tac... el tiempo se acaba. Dime la hora exacta para liberar el último segundo atrapado.",
      themeColor: "bg-amber-900"
    }
  },
  {
    id: WorldId.CHALLENGE,
    title: "Cueva de Desafíos",
    description: "Recupera las páginas perdidas del Gran Libro.",
    storyPlot: "El Dragón del Caos ha robado las páginas finales del Grimorio Matemático y se esconde en el Vórtice. Sin ellas, el equilibrio nunca se restaurará. ¡Es la prueba final para convertirte en Maestro!",
    color: "bg-rose-600",
    icon: "BrainCircuit",
    requiredLevel: 6,
    totalQuestions: 5,
    orionIntro: "Has recorrido un largo camino, Sabio Numérico. El Dragón es astuto y usará todos los trucos que has aprendido en tu contra. ¡Restaura el equilibrio!",
    guardian: {
      name: "Dragón del Caos",
      avatar: "🐲",
      message: "¡ROAARR! ¿Crees que unos simples números pueden vencerme? ¡Soy el desorden eterno! ¡Demuéstralo!",
      themeColor: "bg-neutral-900"
    }
  }
];

export const SUCCESS_MESSAGES = [
  "¡Genial!",
  "¡Lo lograste!",
  "¡Poder Numérico!",
  "¡Magia Pura!",
  "¡Increíble!"
];

export const ERROR_MESSAGES = [
  "No te preocupes, inténtalo de nuevo",
  "¡Casi! Revisa los números",
  "Mmm... dale otra vuelta",
  "¡Tú puedes! Intenta otra vez"
];

export const SPARKY_QUOTES = [
  "¡Hola! Soy Sparky. ¡Vamos a jugar con números!",
  "¡Tú puedes! La magia está en tu mente.",
  "¡Woow! Eso fue rápido.",
  "Si te atascas, ¡pídeme ayuda!",
  "¡Las matemáticas son divertidas!"
];

// --- SOUNDS ---

// Using Google Sound Library sounds as placeholders for different themes
export const BGM_URLS: Record<string, string> = {
  // Calm nature for map
  map: "https://actions.google.com/sounds/v1/ambiences/forest_morning.ogg", 
  // Mystical/Shop
  shop: "https://actions.google.com/sounds/v1/science_fiction/scifi_drone.ogg",
  // Worlds
  [WorldId.NUMBERS]: "https://actions.google.com/sounds/v1/ambiences/barnyard_with_animals.ogg", // Happy/Nature
  [WorldId.ADD_SUB]: "https://actions.google.com/sounds/v1/water/stream_water_flowing.ogg", // Flowing
  [WorldId.MULT]: "https://actions.google.com/sounds/v1/ambiences/night_in_forest.ogg", // Mysterious forest
  [WorldId.DIV]: "https://actions.google.com/sounds/v1/water/waves_crashing_on_rocks_1.ogg", // Sea/Pirate
  [WorldId.GEO]: "https://actions.google.com/sounds/v1/science_fiction/scifi_hum_low.ogg", // Tech/Structure
  [WorldId.TIME]: "https://actions.google.com/sounds/v1/alarms/mechanical_clock_ticking.ogg", // Ticking
  [WorldId.CHALLENGE]: "https://actions.google.com/sounds/v1/weather/thunderstorm.ogg", // Intense
};

export const SFX_URLS = {
  click: "https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/click.mp3",
  success: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3",
  error: "https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/click.mp3", // Soft thud
  win: "https://codeskulptor-demos.commondatastorage.googleapis.com/pang/arrow.mp3", // Swoosh/Win feeling
  buy: "https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/button.mp3",
  unlock: "https://codeskulptor-demos.commondatastorage.googleapis.com/assets/soundboard/wood-crash.mp3" // Heavy thud
};

// --- CUSTOMIZATION CONSTANTS ---

export const RACES: { id: Race, name: string, emoji: string }[] = [
  { id: 'human', name: 'Humano', emoji: '🧒' },
  { id: 'elf', name: 'Elfo', emoji: '🧝' },
  { id: 'goblin', name: 'Duende', emoji: '👺' }
];

export const STORE_ITEMS: StoreItem[] = [
  // Hats
  { id: 'hat_novice', name: "Gorro de Aprendiz", type: 'hat', cost: 0, icon: "🧢", description: "Un gorro sencillo para empezar." },
  { id: 'hat_wizard', name: "Sombrero Estrellado", type: 'hat', cost: 100, icon: "🎩", description: "Clásico sombrero de mago azul." },
  { id: 'hat_crown', name: "Corona Solar", type: 'hat', cost: 300, icon: "👑", description: "Brilla como el sol." },
  
  // Wands
  { id: 'wand_wood', name: "Varita de Roble", type: 'wand', cost: 0, icon: "🥢", description: "Madera resistente." },
  { id: 'wand_star', name: "Varita Estelar", type: 'wand', cost: 150, icon: "⭐", description: "Lanza chispas mágicas." },
  { id: 'wand_crystal', name: "Cetro de Cristal", type: 'wand', cost: 400, icon: "💎", description: "Poder puro concentrado." },
  
  // Outfits (New)
  { id: 'outfit_novice', name: "Túnica Gris", type: 'outfit', cost: 0, icon: "👕", description: "Ropa cómoda para estudiar." },
  { id: 'outfit_robe', name: "Toga de Maestro", type: 'outfit', cost: 120, icon: "👘", description: "Elegante y misteriosa." },
  { id: 'outfit_armor', name: "Armadura Ligera", type: 'outfit', cost: 250, icon: "🛡️", description: "Protección para aventuras." },
  
  // Pets
  { id: 'pet_cat', name: "Gato Negro", type: 'pet', cost: 200, icon: "🐈‍⬛", description: "Siempre cae de pie." },
  { id: 'pet_owl', name: "Búho Sabio", type: 'pet', cost: 250, icon: "🦉", description: "Te ayuda con las tareas." },
  { id: 'pet_dragon', name: "Bebé Dragón", type: 'pet', cost: 500, icon: "🐉", description: "¡Cuidado, escupe fuego!" },
  
  // Furniture
  { id: 'furn_books', name: "Libros Antiguos", type: 'furniture', cost: 50, icon: "📚", description: "Conocimiento infinito." },
  { id: 'furn_potions', name: "Mesa de Pociones", type: 'furniture', cost: 150, icon: "⚗️", description: "Para experimentos mágicos." },
  { id: 'furn_chest', name: "Cofre del Tesoro", type: 'furniture', cost: 100, icon: "🧳", description: "Guarda tus secretos." },
];

export const GRIMOIRE_PAGES: GrimoirePage[] = [
  {
    id: 'page_numbers',
    worldId: WorldId.NUMBERS,
    title: "El Secreto de los Pares",
    content: "Los números pares tienen pareja y terminan en 0, 2, 4, 6, 8. Los impares siempre dejan a uno solo.",
    visualSummary: "2, 4, 6... ¡Parejas! 👯‍♂️"
  },
  {
    id: 'page_addsub',
    worldId: WorldId.ADD_SUB,
    title: "Magia de Unir y Separar",
    content: "Sumar (+) es invocar más cosas. Restar (-) es hacerlas desaparecer. Son fuerzas opuestas que mantienen el equilibrio.",
    visualSummary: "🍎 + 🍎 = 🍎🍎"
  },
  {
    id: 'page_mult',
    worldId: WorldId.MULT,
    title: "Hechizo de Multiplicación",
    content: "Multiplicar es sumar el mismo número muchas veces muy rápido. 3 x 4 es decir 'tres veces cuatro'.",
    visualSummary: "3 x 4 = 12 ✨"
  },
  {
    id: 'page_div',
    worldId: WorldId.DIV,
    title: "El Arte de Compartir",
    content: "Dividir (÷) es repartir un tesoro para que todos tengan la misma cantidad. ¡La justicia es mágica!",
    visualSummary: "💎💎 ÷ 👤👤 = 💎"
  },
  {
    id: 'page_geo',
    worldId: WorldId.GEO,
    title: "Geometría Sagrada",
    content: "Las formas construyen el mundo. Los Cuadrados tienen 4 lados iguales, los Triángulos 3 lados.",
    visualSummary: "🟦 🔺 🟢"
  },
  {
    id: 'page_time',
    worldId: WorldId.TIME,
    title: "Controlando el Tiempo",
    content: "La aguja pequeña dice la Hora, la grande los Minutos. Cada número vale 5 minutos.",
    visualSummary: "🕒 Tic-Tac"
  }
];

export const MINI_GAMES: MiniGameConfig[] = [
  {
    id: 'dragon_race',
    title: "Carrera de Dragones",
    description: "¡Responde rápido para que tu dragón vuele más rápido que el rival!",
    icon: "🐉",
    unlockWorldId: WorldId.NUMBERS, // Unlocked early
    color: "bg-red-500"
  },
  {
    id: 'potion_lab',
    title: "Pociones de Multiplicación",
    description: "Combina los ingredientes correctos para crear la poción perfecta.",
    icon: "⚗️",
    unlockWorldId: WorldId.MULT,
    color: "bg-purple-500"
  },
  {
    id: 'shape_garden',
    title: "Jardín de Formas",
    description: "Completa la secuencia de plantas mágicas siguiendo el patrón.",
    icon: "🌻",
    unlockWorldId: WorldId.GEO,
    color: "bg-green-500"
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'novice_explorer',
    title: "Novato Curioso",
    description: "Completa tu primer nivel en cualquier mundo.",
    icon: "🧭",
    color: "bg-blue-400"
  },
  {
    id: 'master_add',
    title: "Maestro de la Suma",
    description: "Completa el Valle de Suma en modo 'Archimago' con 3 estrellas.",
    icon: "➕",
    color: "bg-emerald-500"
  },
  {
    id: 'speedster',
    title: "Velocista Numérico",
    description: "Completa cualquier nivel con puntuación perfecta en menos de 45 segundos.",
    icon: "⚡",
    color: "bg-yellow-400"
  },
  {
    id: 'geo_detective',
    title: "Detective Geométrico",
    description: "Completa la Ciudad de Formas con 3 estrellas.",
    icon: "📐",
    color: "bg-purple-400"
  },
  {
    id: 'collector',
    title: "Gran Coleccionista",
    description: "Compra 5 artículos en la Tienda Mágica.",
    icon: "🎒",
    color: "bg-pink-400"
  }
];
