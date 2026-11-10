export type FloorId =
  | "coroa"
  | "residencia"
  | "lazer"
  | "reunioes"
  | "garagem"
  | "terreo"
  | "ponte";

export type FloorTone = "wind" | "room" | "water" | "hush" | "dry" | "lobby";

export type Floor = {
  id: FloorId;
  name: string;
  from: number;
  to: number;
  text: string;
  image: string;
  imageAlt: string;
  study: boolean;
  tone: FloorTone;
  video?: string;
};

export const brand = {
  name: "Palais Tower",
  markAlt: "Palais. Inmueble Deluxxu.",
  place: "Ciudad del Este",
  country: "Paraguai",
  logo: "/brand/logo.jpg",
  facade: "/brand/fachada-shaft.jpg",
  facadeAlt:
    "Estudo da fachada da Palais Tower ao anoitecer, com arcos no térreo e luz quente no coroamento.",
  map: "/brand/mapa.jpg",
  mapAlt:
    "Mapa do terreno indicado para a Palais, junto ao Lago da República, à Ponte da Amizade e ao Shopping China.",
};

export const floors: Floor[] = [
  {
    id: "coroa",
    name: "Torre",
    from: 0,
    to: 0.16,
    tone: "wind",
    study: true,
    video: "/film/fachada2.mp4",
    image: "/brand/poster-fachada.jpg",
    imageAlt: "Fachada da Palais Tower.",
    text: "A torre.",
  },
  {
    id: "terreo",
    name: "Entrada",
    from: 0.16,
    to: 0.33,
    tone: "lobby",
    study: true,
    video: "/film/entrada2.mp4",
    image: "/brand/poster-entrada.jpg",
    imageAlt: "Hall de entrada da Palais Tower.",
    text: "O hall de entrada.",
  },
  {
    id: "residencia",
    name: "Residências",
    from: 0.33,
    to: 0.5,
    tone: "room",
    study: true,
    video: "/film/sala2.mp4",
    image: "/brand/poster-sala.jpg",
    imageAlt: "Sala da residência.",
    text: "A sala.",
  },
  {
    id: "lazer",
    name: "Lazer",
    from: 0.5,
    to: 0.67,
    tone: "water",
    study: true,
    video: "/film/lazer2.mp4",
    image: "/brand/poster-lazer.jpg",
    imageAlt: "Salão de lazer.",
    text: "O lazer.",
  },
  {
    id: "reunioes",
    name: "Reuniões",
    from: 0.67,
    to: 0.84,
    tone: "hush",
    study: true,
    video: "/film/reuniao2.mp4",
    image: "/brand/poster-reuniao.jpg",
    imageAlt: "Sala de reuniões.",
    text: "A sala de reuniões.",
  },
  {
    id: "garagem",
    name: "Garagem",
    from: 0.84,
    to: 1,
    tone: "dry",
    study: true,
    video: "/film/garagem2.mp4",
    image: "/brand/poster-garagem.jpg",
    imageAlt: "Garagem.",
    text: "A garagem.",
  },
];

export const places = [
  {
    name: "Lago da República",
    note: "O mapa entregue coloca o terreno junto ao lago.",
  },
  {
    name: "Ponte da Amizade",
    note: "A ponte aparece ao norte do terreno, no mesmo mapa.",
  },
  {
    name: "Shopping China",
    note: "O shopping aparece ao lado do terreno, no mesmo mapa.",
  },
];

export const requestCopy = {
  title: "Pedir a apresentação",
  text: "Deixe nome e contato. O pedido fica registrado nesta máquina, até existir um canal oficial.",
  nome: "Nome",
  contato: "E-mail ou telefone",
  mensagem: "Mensagem",
  submit: "Enviar pedido",
  pending: "Enviando…",
  success: "Pedido registrado.",
  error: "Não foi possível registrar agora.",
};

export function floorAt(progress: number): Floor {
  const value = Math.min(1, Math.max(0, progress));
  return (
    floors.find((floor) => value >= floor.from && value < floor.to) ??
    floors[floors.length - 1]
  );
}
