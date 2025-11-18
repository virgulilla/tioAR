// src/data/narrativas.js (o donde lo guardes)

// ----------------------------------------------------
// IMPORTACIONES DE AUDIO
// Vite procesará estas rutas y nos devolverá la URL pública correcta
// La ruta '../assets/sounds/' debe ser la correcta relativa a la ubicación de este archivo.
// ----------------------------------------------------
import memoryAudio from '../assets/sounds/memory.mp3';
import globosAudio from '../assets/sounds/globos.mp3';
import quizAudio from '../assets/sounds/quiz.mp3';
import puzzleAudio from '../assets/sounds/puzzle.mp3';
import codigoAudio from '../assets/sounds/codigo.mp3';
import soplarAudio from '../assets/sounds/soplar.mp3';


// ----------------------------------------------------
// ESTRUCTURA DE DATOS FINAL (Array de Narrativas)
// ----------------------------------------------------
export const NARRATIVAS = [
  {
    "id": 1,
    "name": "Parque Central",
    "lat": 41.392,
    "lng": 2.163,
    "riddle": "Antes de jugar, todos los participantes teneis que pintaros la cara.",
    "game": "memory",
    "letra": "H",
    "narradorTexto": "Ah, aventurero… Aquí se guardan recuerdos ocultos del bosque mágico. Si consigues emparejar las imágenes correctas, liberarás un trocito de la magia del Tió.",
    "narradorAudio": memoryAudio, // <-- ¡USAMOS LA VARIABLE IMPORTADA!
  },
  {
    "id": 2,
    "name": "Fuente de los Patos",
    "lat": 41.3921,
    "lng": 2.1632,
    "riddle": "Teneis que demostrar vuestra habilidad de pesca antes de permitiros jugar. Veis la caña de pescar? Quien se atreve a coger el patito?",
    "game": "globos",
    "letra": "U",
    "narradorTexto": "Shhh… escucha bien. Los patos del estanque susurran pistas escondidas. Atrapa los globos correctos y descifrarás su secreto.",
    "narradorAudio": globosAudio, // <-- ¡USAMOS LA VARIABLE IMPORTADA!
  },
  {
    "id": 3,
    "name": "Banco del Gran Árbol",
    "lat": 41.3922,
    "lng": 2.1633,
    "riddle": "Para poder acceder al siguiente juego, debeis reunir 10 hojas magicas del arbol",
    "game": "quiz",
    "letra": "E",
    "narradorTexto": "Este viejo árbol ha visto pasar cientos de inviernos… y sólo comparte su sabiduría con quienes se atreven a escuchar. Responde a sus preguntas y te revelará otra parte de la magia del Tió.",
    "narradorAudio": quizAudio, // <-- ¡USAMOS LA VARIABLE IMPORTADA!
  },
  {
    "id": 4,
    "name": "Puente Pequeñito",
    "lat": 41.3923,
    "lng": 2.1634,
    "riddle": "Adivinad que teneis que hacer. Correcto, debeis cruzar todos el puente sin caeros al agua.",
    "game": "puzzle",
    "letra": "R",
    "narradorTexto": "Este pequeño puente conecta mundos… pero la magia está rota. Ordena las piezas desordenadas y devolverás su brillo, acercándonos un paso más al misterio final.",
    "narradorAudio": puzzleAudio, // <-- ¡USAMOS LA VARIABLE IMPORTADA!
  },
  {
    "id": 5,
    "name": "Piedra Misteriosa",
    "lat": 41.3924,
    "lng": 2.1635,
    "riddle": "Antes de jugar, teneis que cruzar todos por debajo de la cuerda sin tocarla ni caer de culo al suelo",
    "game": "codigo",
    "letra": "T",
    "narradorTexto": "Esta antigua piedra susurra códigos olvidados… Solo los aventureros más astutos pueden descifrarlos. Si logras resolver el mensaje, liberarás otro fragmento del poder del Tió.",
    "narradorAudio": codigoAudio, // <-- ¡USAMOS LA VARIABLE IMPORTADA!
  },
  {
    "id": 6,
    "name": "Jardín de las Flores",
    "lat": 41.3925,
    "lng": 2.1636,
    "riddle": "Las flores brillan cuando soplas… ¿Qué ocurrirá?",
    "game": "soplar",
    "letra": "O",
    "narradorTexto": "En este jardín encantado, las flores despiertan con la magia del aliento. Sopla con fuerza, con alegría, y deja que la naturaleza revele la última letra de nuestro gran secreto.",
    "narradorAudio": soplarAudio, // <-- ¡USAMOS LA VARIABLE IMPORTADA!
  }
];