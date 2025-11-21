// src/data/narrativas.js (o donde lo guardes)

// ----------------------------------------------------
// IMPORTACIONES DE AUDIO
// Vite procesará estas rutas y nos devolverá la URL pública correcta
// La ruta '../assets/sounds/' debe ser la correcta relativa a la ubicación de este archivo.
// ----------------------------------------------------
import memoryAudio from "../assets/sounds/memory.mp3";
import globosAudio from "../assets/sounds/globos.mp3";
import quizAudio from "../assets/sounds/quiz.mp3";
import puzzleAudio from "../assets/sounds/puzzle.mp3";
import codigoAudio from "../assets/sounds/codigo.mp3";
import soplarAudio from "../assets/sounds/soplar.mp3";

// ----------------------------------------------------
// ESTRUCTURA DE DATOS FINAL (Array de Narrativas)
// ----------------------------------------------------
export const NARRATIVAS = [
  {
    id: 1,
    name: "Parque Central",
    lat: 41.663157, //41.68606,
    lng: 2.355549, //2.364537,
    riddle:
      "Teneis que pasaros el globo entre todos sin que se caiga al suelo durante 30 segundos.",
    game: "globos",
    narradorTexto:
      "Ah, aventurero… Aquí se guardan recuerdos ocultos del bosque mágico. Si consigues emparejar las imágenes correctas, liberarás un trocito de la magia del Tió.",
    narradorAudio: globosAudio,
    code: "ARBOL12",
  },
  {
    id: 2,
    name: "Estanque de las barcas",
    lat: 41.663377,
    lng: 2.355618,
    riddle:
      "Teneis coger al barquito usando la caña de pescar. Quien logre atraparlo una nueva pista desvelará",
    game: "memory",
    narradorTexto:
      "Shhh… escucha bien. Los patos del estanque susurran pistas escondidas. Atrapa los globos correctos y descifrarás su secreto.",
    narradorAudio: memoryAudio,
    code: "LIBRO",
  },
  {
    id: 3,
    name: "El arbol mágico",
    lat: 41.663126,
    lng: 2.356083,
    riddle:
      "El árbol mágico esconde entre su tronco o ramas un gran secreto. ¡El Tió ha escondido una nota cerca que revela la clave! ¡Búscala!",
    game: "quiz",
    narradorTexto:
      "Este viejo árbol ha visto pasar cientos de inviernos… y sólo comparte su sabiduría con quienes se atreven a escuchar. Responde a sus preguntas y te revelará otra parte de la magia del Tió.",
    narradorAudio: quizAudio,
    code: "MUÑECODENIEVE",
  },
  {
    id: 4,
    name: "Puente Pequeñito",
    lat: 41.663375,
    lng: 2.355762,
    riddle:
      "Cruzad el puente. Buscad y coged cada uno un papel. Al cruzar todos debeis intercambiar los papeles,  donde el explorador de mayor edad se queda el numero mayor, y el de menor edad el numero menor.",
    game: "puzzle",
    narradorTexto:
      "Este pequeño puente conecta mundos… pero la magia está rota. Ordena las piezas desordenadas y devolverás su brillo, acercándonos un paso más al misterio final.",
    narradorAudio: puzzleAudio,
    code: "KLAUS",
  },
  {
    id: 5,
    name: "Piedra Misteriosa",
    lat: 41.663139,
    lng: 2.356191,
    riddle:
      "Antes de continuar debeis pasar todos por debajo de la cuerda sin caeros al suelo. Cuando hayas pasado todos buscad la nota que el Tió escondió en la piedra misteriosa.",
    game: "codigo",
    narradorTexto:
      "Esta antigua piedra susurra códigos olvidados… Solo los aventureros más astutos pueden descifrarlos. Si logras resolver el mensaje, liberarás otro fragmento del poder del Tió.",
    narradorAudio: codigoAudio,
    code: "PIEDRA",
  },
  {
    id: 6,
    name: "Jardín de las Flores",
    lat: 41.662953,
    lng: 2.355687,
    riddle: "Las flores brillan cuando soplas… ¿Qué ocurrirá?",
    game: "soplar",
    narradorTexto:
      "En este jardín encantado, las flores despiertan con la magia del aliento. Sopla con fuerza, con alegría, y deja que la naturaleza revele la última letra de nuestro gran secreto.",
    narradorAudio: soplarAudio,
    code: "VIENTO",
  },
];
