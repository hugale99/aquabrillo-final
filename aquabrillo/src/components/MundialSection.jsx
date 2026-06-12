import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Gift,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Users
} from 'lucide-react';

// ============================================================
// CONFIGURACION MUNDIAL AQUABRILLO
// ============================================================

const FECHA_INICIO_MUNDIAL = new Date('2026-06-10T00:00:00');
const FECHA_FIN_MUNDIAL = new Date('2026-07-19T23:59:59');

const WHATSAPP_NUMBER = '7773887690';
const WHATSAPP_MESSAGE = 'Hola AQUABRILLO, quiero aprovechar una promocion exclusiva del Mundial.';
const LIVE_SCORE_ENDPOINT = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard';

const TEAM_CODE_ALIASES = {
  KSA: 'KSA',
  RSA: 'RSA',
  ZAF: 'RSA',
  KOR: 'KOR',
  ROK: 'KOR',
  USA: 'USA',
  USMNT: 'USA'
};

const getWhatsAppLink = (text = WHATSAPP_MESSAGE) =>
  `https://wa.me/52${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const formatScoreboardDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

const getLiveScoreUrl = () => {
  const start = new Date();
  start.setDate(start.getDate() - 1);

  const end = new Date();
  end.setDate(end.getDate() + 1);

  return `${LIVE_SCORE_ENDPOINT}?dates=${formatScoreboardDate(start)}-${formatScoreboardDate(end)}`;
};

const getEspnMatchStatus = (statusName) => {
  if (statusName === 'STATUS_FULL_TIME' || statusName === 'STATUS_FINAL') return 'Final';
  if (statusName === 'STATUS_SCHEDULED' || statusName === 'STATUS_PRE_GAME') return 'Proximo';
  return 'En vivo';
};

const normalizeTeamCode = (code) => TEAM_CODE_ALIASES[code] || code;

const getMatchDateKey = (dateValue) => {
  const date = new Date(dateValue);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Mexico_City',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return formatter.format(date);
};

const getMatchupKey = (dateValue, homeCode, awayCode) =>
  `${getMatchDateKey(dateValue)}-${normalizeTeamCode(homeCode)}-${normalizeTeamCode(awayCode)}`;

const getReverseMatchupKey = (dateValue, homeCode, awayCode) =>
  `${getMatchDateKey(dateValue)}-${normalizeTeamCode(awayCode)}-${normalizeTeamCode(homeCode)}`;

const PROMOS = [
  {
    icon: Sparkles,
    tag: 'Data Gol',
    title: 'Gol de Brillo',
    subtitle: 'Combo premium ',
    price: '999',
    note: 'Detallado completo interior + exterior',
    features: ['Limpieza profunda', 'Tratamiento para interiorres, Piel/Plasticos', 'Eliminación de olores'],
    accent: 'from-cyan-300 to-blue-400'
  },
  {
    icon: Trophy,
    tag: 'Míster Fútbol',
    title: 'Combo Mundialista',
    subtitle: 'Recubrimiento cerámico',
    price: '1999',
    note: 'Protección de larga duración. Repelencia al agua y contaminantes ambientales.',
    features: ['Brillo profundo', 'Protección total en pintura', 'Efecto hidrofóbico'],
    accent: 'from-amber-200 to-yellow-500'
  },
  {
    icon: Shield,
    tag: 'Pizarra Deportiva',
    title: 'Hat-Trick AQUABRILLO',
    subtitle: 'Paquetes a tu medida',
    price: 'Cotizar',
    note: 'Combinaciones personalizadas de servicios para todo tipo de autos/cammionetas, clásicos o para ocasiones especiales.',
    features: ['Detallado premium', 'Limpieza profunda', 'Terminacion ceramica'],
    accent: 'from-emerald-300 to-teal-500'
  }
];

const TEAMS = {
  ALG: { name: 'Argelia', code: 'ALG', flag: 'dz' },
  ARG: { name: 'Argentina', code: 'ARG', flag: 'ar' },
  AUS: { name: 'Australia', code: 'AUS', flag: 'au' },
  AUT: { name: 'Austria', code: 'AUT', flag: 'at' },
  BEL: { name: 'Belgica', code: 'BEL', flag: 'be' },
  BIH: { name: 'Bosnia y Herzegovina', code: 'BIH', flag: 'ba' },
  BRA: { name: 'Brasil', code: 'BRA', flag: 'br' },
  CAN: { name: 'Canada', code: 'CAN', flag: 'ca' },
  CIV: { name: 'Costa de Marfil', code: 'CIV', flag: 'ci' },
  COL: { name: 'Colombia', code: 'COL', flag: 'co' },
  COD: { name: 'RD Congo', code: 'COD', flag: 'cd' },
  CPV: { name: 'Cabo Verde', code: 'CPV', flag: 'cv' },
  CRO: { name: 'Croacia', code: 'CRO', flag: 'hr' },
  CUW: { name: 'Curacao', code: 'CUW', flag: 'cw' },
  CZE: { name: 'Chequia', code: 'CZE', flag: 'cz' },
  ECU: { name: 'Ecuador', code: 'ECU', flag: 'ec' },
  EGY: { name: 'Egipto', code: 'EGY', flag: 'eg' },
  ENG: { name: 'Inglaterra', code: 'ENG', flag: 'gb-eng' },
  FRA: { name: 'Francia', code: 'FRA', flag: 'fr' },
  GER: { name: 'Alemania', code: 'GER', flag: 'de' },
  GHA: { name: 'Ghana', code: 'GHA', flag: 'gh' },
  HAI: { name: 'Haiti', code: 'HAI', flag: 'ht' },
  IRN: { name: 'Iran', code: 'IRN', flag: 'ir' },
  IRQ: { name: 'Irak', code: 'IRQ', flag: 'iq' },
  JOR: { name: 'Jordania', code: 'JOR', flag: 'jo' },
  JPN: { name: 'Japon', code: 'JPN', flag: 'jp' },
  KOR: { name: 'Corea Republica', code: 'KOR', flag: 'kr' },
  MAR: { name: 'Marruecos', code: 'MAR', flag: 'ma' },
  MEX: { name: 'Mexico', code: 'MEX', flag: 'mx' },
  NED: { name: 'Paises Bajos', code: 'NED', flag: 'nl' },
  NOR: { name: 'Noruega', code: 'NOR', flag: 'no' },
  NZL: { name: 'Nueva Zelanda', code: 'NZL', flag: 'nz' },
  PAN: { name: 'Panama', code: 'PAN', flag: 'pa' },
  PAR: { name: 'Paraguay', code: 'PAR', flag: 'py' },
  POR: { name: 'Portugal', code: 'POR', flag: 'pt' },
  QAT: { name: 'Qatar', code: 'QAT', flag: 'qa' },
  RSA: { name: 'Sudafrica', code: 'RSA', flag: 'za' },
  KSA: { name: 'Arabia Saudita', code: 'KSA', flag: 'sa' },
  SCO: { name: 'Escocia', code: 'SCO', flag: 'gb-sct' },
  SEN: { name: 'Senegal', code: 'SEN', flag: 'sn' },
  ESP: { name: 'Espana', code: 'ESP', flag: 'es' },
  SUI: { name: 'Suiza', code: 'SUI', flag: 'ch' },
  SWE: { name: 'Suecia', code: 'SWE', flag: 'se' },
  TUN: { name: 'Tunez', code: 'TUN', flag: 'tn' },
  TUR: { name: 'Turquia', code: 'TUR', flag: 'tr' },
  URU: { name: 'Uruguay', code: 'URU', flag: 'uy' },
  USA: { name: 'Estados Unidos', code: 'USA', flag: 'us' },
  UZB: { name: 'Uzbekistan', code: 'UZB', flag: 'uz' }
};

const makeMatch = (
  kickoff,
  stage,
  venue,
  home,
  away,
  featured = false,
  reward = 'Pronostico correcto: beneficio especial AQUABRILLO',
  homeScore = null,
  awayScore = null,
  liveStatus = undefined
) => ({
  id: `${new Date(kickoff).toISOString()}-${home}-${away}`,
  kickoff,
  stage,
  venue,
  home: TEAMS[home],
  away: TEAMS[away],
  homeScore,
  awayScore,
  liveStatus,
  featured,
  reward
});

const MATCHES = [
  makeMatch('2026-06-11T13:00:00-06:00', 'Grupo A', 'Ciudad de Mexico', 'MEX', 'RSA', true, 'Si le atinas al equipo ganador: Descontaminado gratis de cristales', 2, 0, 'Final'),
  makeMatch('2026-06-11T20:00:00-06:00', 'Grupo A', 'Guadalajara', 'KOR', 'CZE'),
  makeMatch('2026-06-12T13:00:00-06:00', 'Grupo B', 'Toronto', 'CAN', 'BIH'),
  makeMatch('2026-06-12T19:00:00-06:00', 'Grupo D', 'Los Angeles', 'USA', 'PAR'),
  makeMatch('2026-06-13T13:00:00-06:00', 'Grupo B', 'San Francisco Bay Area', 'QAT', 'SUI'),
  makeMatch('2026-06-13T16:00:00-06:00', 'Grupo C', 'New York/New Jersey', 'BRA', 'MAR'),
  makeMatch('2026-06-13T19:00:00-06:00', 'Grupo C', 'Boston', 'HAI', 'SCO'),
  makeMatch('2026-06-13T22:00:00-06:00', 'Grupo D', 'Vancouver', 'AUS', 'TUR'),
  makeMatch('2026-06-14T11:00:00-06:00', 'Grupo E', 'Houston', 'GER', 'CUW'),
  makeMatch('2026-06-14T14:00:00-06:00', 'Grupo F', 'Dallas', 'NED', 'JPN'),
  makeMatch('2026-06-14T17:00:00-06:00', 'Grupo E', 'Philadelphia', 'CIV', 'ECU'),
  makeMatch('2026-06-14T20:00:00-06:00', 'Grupo F', 'Monterrey', 'SWE', 'TUN'),
  makeMatch('2026-06-15T10:00:00-06:00', 'Grupo H', 'Atlanta', 'ESP', 'CPV'),
  makeMatch('2026-06-15T13:00:00-06:00', 'Grupo G', 'Seattle', 'BEL', 'EGY'),
  makeMatch('2026-06-15T16:00:00-06:00', 'Grupo H', 'Miami', 'KSA', 'URU'),
  makeMatch('2026-06-15T19:00:00-06:00', 'Grupo G', 'Los Angeles', 'IRN', 'NZL'),
  makeMatch('2026-06-16T13:00:00-06:00', 'Grupo I', 'New York/New Jersey', 'FRA', 'SEN'),
  makeMatch('2026-06-16T16:00:00-06:00', 'Grupo I', 'Boston', 'IRQ', 'NOR'),
  makeMatch('2026-06-16T19:00:00-06:00', 'Grupo J', 'Kansas City', 'ARG', 'ALG'),
  makeMatch('2026-06-16T22:00:00-06:00', 'Grupo J', 'San Francisco Bay Area', 'AUT', 'JOR'),
  makeMatch('2026-06-17T11:00:00-06:00', 'Grupo K', 'Miami', 'POR', 'COD'),
  makeMatch('2026-06-17T14:00:00-06:00', 'Grupo L', 'Dallas', 'ENG', 'CRO'),
  makeMatch('2026-06-17T17:00:00-06:00', 'Grupo L', 'Toronto', 'GHA', 'PAN'),
  makeMatch('2026-06-17T20:00:00-06:00', 'Grupo K', 'Houston', 'UZB', 'COL'),
  makeMatch('2026-06-18T10:00:00-06:00', 'Grupo A', 'Sede Mundial 2026', 'CZE', 'RSA'),
  makeMatch('2026-06-18T13:00:00-06:00', 'Grupo B', 'Sede Mundial 2026', 'SUI', 'BIH'),
  makeMatch('2026-06-18T16:00:00-06:00', 'Grupo B', 'Sede Mundial 2026', 'CAN', 'QAT'),
  makeMatch('2026-06-18T19:00:00-06:00', 'Grupo A', 'Guadalajara', 'MEX', 'KOR', true, 'Gol de Mexico: hidratacion de plasticos'),
  makeMatch('2026-06-19T13:00:00-06:00', 'Grupo D', 'Sede Mundial 2026', 'USA', 'AUS'),
  makeMatch('2026-06-19T16:00:00-06:00', 'Grupo C', 'Sede Mundial 2026', 'SCO', 'MAR'),
  makeMatch('2026-06-19T18:30:00-06:00', 'Grupo C', 'Sede Mundial 2026', 'BRA', 'HAI'),
  makeMatch('2026-06-19T21:00:00-06:00', 'Grupo D', 'Sede Mundial 2026', 'TUR', 'PAR'),
  makeMatch('2026-06-20T11:00:00-06:00', 'Grupo F', 'Sede Mundial 2026', 'NED', 'SWE'),
  makeMatch('2026-06-20T14:00:00-06:00', 'Grupo E', 'Sede Mundial 2026', 'GER', 'CIV'),
  makeMatch('2026-06-20T18:00:00-06:00', 'Grupo E', 'Sede Mundial 2026', 'ECU', 'CUW'),
  makeMatch('2026-06-20T22:00:00-06:00', 'Grupo F', 'Sede Mundial 2026', 'TUN', 'JPN'),
  makeMatch('2026-06-21T10:00:00-06:00', 'Grupo H', 'Sede Mundial 2026', 'ESP', 'KSA'),
  makeMatch('2026-06-21T13:00:00-06:00', 'Grupo G', 'Sede Mundial 2026', 'BEL', 'IRN'),
  makeMatch('2026-06-21T16:00:00-06:00', 'Grupo H', 'Sede Mundial 2026', 'URU', 'CPV'),
  makeMatch('2026-06-21T19:00:00-06:00', 'Grupo G', 'Sede Mundial 2026', 'NZL', 'EGY'),
  makeMatch('2026-06-22T11:00:00-06:00', 'Grupo J', 'Sede Mundial 2026', 'ARG', 'AUT'),
  makeMatch('2026-06-22T15:00:00-06:00', 'Grupo I', 'Sede Mundial 2026', 'FRA', 'IRQ'),
  makeMatch('2026-06-22T18:00:00-06:00', 'Grupo I', 'Sede Mundial 2026', 'NOR', 'SEN'),
  makeMatch('2026-06-22T21:00:00-06:00', 'Grupo J', 'Sede Mundial 2026', 'JOR', 'ALG'),
  makeMatch('2026-06-23T11:00:00-06:00', 'Grupo K', 'Sede Mundial 2026', 'POR', 'UZB'),
  makeMatch('2026-06-23T14:00:00-06:00', 'Grupo L', 'Sede Mundial 2026', 'ENG', 'GHA'),
  makeMatch('2026-06-23T17:00:00-06:00', 'Grupo L', 'Sede Mundial 2026', 'PAN', 'CRO'),
  makeMatch('2026-06-23T20:00:00-06:00', 'Grupo K', 'Sede Mundial 2026', 'COL', 'COD'),
  makeMatch('2026-06-24T13:00:00-06:00', 'Grupo B', 'Sede Mundial 2026', 'SUI', 'CAN'),
  makeMatch('2026-06-24T13:00:00-06:00', 'Grupo B', 'Sede Mundial 2026', 'BIH', 'QAT'),
  makeMatch('2026-06-24T16:00:00-06:00', 'Grupo C', 'Sede Mundial 2026', 'MAR', 'HAI'),
  makeMatch('2026-06-24T16:00:00-06:00', 'Grupo C', 'Sede Mundial 2026', 'SCO', 'BRA'),
  makeMatch('2026-06-24T19:00:00-06:00', 'Grupo A', 'Sede Mundial 2026', 'RSA', 'KOR'),
  makeMatch('2026-06-24T19:00:00-06:00', 'Grupo A', 'Ciudad de Mexico', 'CZE', 'MEX', true, 'Cierre de grupo: paquete premium limitado'),
  makeMatch('2026-06-25T14:00:00-06:00', 'Grupo E', 'Sede Mundial 2026', 'CUW', 'CIV'),
  makeMatch('2026-06-25T14:00:00-06:00', 'Grupo E', 'Sede Mundial 2026', 'ECU', 'GER'),
  makeMatch('2026-06-25T17:00:00-06:00', 'Grupo F', 'Sede Mundial 2026', 'TUN', 'NED'),
  makeMatch('2026-06-25T17:00:00-06:00', 'Grupo F', 'Sede Mundial 2026', 'JPN', 'SWE'),
  makeMatch('2026-06-25T20:00:00-06:00', 'Grupo D', 'Sede Mundial 2026', 'TUR', 'USA'),
  makeMatch('2026-06-25T20:00:00-06:00', 'Grupo D', 'Sede Mundial 2026', 'PAR', 'AUS'),
  makeMatch('2026-06-26T13:00:00-06:00', 'Grupo I', 'Sede Mundial 2026', 'NOR', 'FRA'),
  makeMatch('2026-06-26T13:00:00-06:00', 'Grupo I', 'Sede Mundial 2026', 'SEN', 'IRQ'),
  makeMatch('2026-06-26T18:00:00-06:00', 'Grupo H', 'Sede Mundial 2026', 'CPV', 'KSA'),
  makeMatch('2026-06-26T18:00:00-06:00', 'Grupo H', 'Sede Mundial 2026', 'URU', 'ESP'),
  makeMatch('2026-06-26T21:00:00-06:00', 'Grupo G', 'Sede Mundial 2026', 'NZL', 'BEL'),
  makeMatch('2026-06-26T21:00:00-06:00', 'Grupo G', 'Sede Mundial 2026', 'EGY', 'IRN'),
  makeMatch('2026-06-27T15:00:00-06:00', 'Grupo L', 'Sede Mundial 2026', 'PAN', 'ENG'),
  makeMatch('2026-06-27T15:00:00-06:00', 'Grupo L', 'Sede Mundial 2026', 'CRO', 'GHA'),
  makeMatch('2026-06-27T17:30:00-06:00', 'Grupo K', 'Sede Mundial 2026', 'COL', 'POR'),
  makeMatch('2026-06-27T17:30:00-06:00', 'Grupo K', 'Sede Mundial 2026', 'COD', 'UZB'),
  makeMatch('2026-06-27T20:00:00-06:00', 'Grupo J', 'Sede Mundial 2026', 'ALG', 'AUT'),
  makeMatch('2026-06-27T20:00:00-06:00', 'Grupo J', 'Sede Mundial 2026', 'JOR', 'ARG')
];

const DYNAMICS = [
  {
    id: 'Adivina el marcador',
    automationTag: 'MUNDIAL_PREDICCION_MARCADOR',
    icon: Trophy,
    title: 'Adivina el marcador',
    description: 'Agenda tu lavado, manda tu pronostico antes del silbatazo y participa por descuento en tu siguiente servicio.',
    reward: 'Hasta 25% OFF',
    requiredFormat: 'MEX[0-9]-[0-9]',
    whatsappIntent: 'participar_prediccion_marcador'
  },
  {
    id: 'Gol de Mexico',
    automationTag: 'MUNDIAL_GOL_MEXICO',
    icon: Star,
    title: 'Gol de Mexico',
    description: 'Si Mexico gana, quienes agenden ese dia reciben un upgrade de hidratacion de plasticos o cristales premium.',
    reward: 'Upgrade gratis',
    requiredFormat: 'MEX[0-9]-[0-9]',
    whatsappIntent: 'participar_gol_mexico'
  },
  {
    id: 'Cliente MVP',
    automationTag: 'MUNDIAL_CLIENTE_MVP',
    icon: Users,
    title: 'Cliente MVP',
    description: 'Recomienda a un amigo durante el Mundial. Si ambos agendan, los dos reciben beneficio en su proxima visita.',
    reward: 'Beneficio doble',
    requiredFormat: 'REFERIDO_NOMBRE',
    whatsappIntent: 'participar_cliente_mvp'
  },
  {
    id: 'Historia campeona',
    automationTag: 'MUNDIAL_HISTORIA_CAMPEONA',
    icon: Gift,
    title: 'Historia campeona',
    description: 'Sube una historia de tu auto limpio, etiqueta a AQUABRILLO y participa por una limpieza interior completa.',
    reward: 'Sorteo semanal',
    requiredFormat: 'INSTAGRAM_STORY_TAG',
    whatsappIntent: 'participar_historia_campeona'
  }
];

const getDynamicWhatsAppMessage = (dynamic) => [
  'Quiero participar en la dinamica mundialista de AQUABRILLO.',
  `Dinamica: ${dynamic.title}`
].join('\n');

const registerDynamicSelection = (dynamic) => {
  if (typeof window === 'undefined') return;

  const storageKey = 'aquabrillo_mundial_dynamic_selections';
  const currentSelections = JSON.parse(window.localStorage.getItem(storageKey) || '[]');
  const selection = {
    id: `${dynamic.id}_${Date.now()}`,
    dynamicId: dynamic.id,
    automationTag: dynamic.automationTag,
    whatsappIntent: dynamic.whatsappIntent,
    title: dynamic.title,
    selectedAt: new Date().toISOString(),
    channel: 'web_whatsapp_cta',
    status: 'Seleccion iniciada'
  };

  window.localStorage.setItem(storageKey, JSON.stringify([selection, ...currentSelections].slice(0, 100)));
};

const getTimeLeft = (targetDate) => {
  const diff = targetDate - new Date();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60)
  };
};

const formatMatchDate = (kickoff) =>
  new Intl.DateTimeFormat('es-MX', {
    weekday: 'short',
    day: '2-digit',
    month: 'short'
  }).format(new Date(kickoff));

const formatMatchTime = (kickoff) =>
  new Intl.DateTimeFormat('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(kickoff));

const getMatchStatus = (match) => {
  if (match.liveStatus) return match.liveStatus;

  const now = new Date();
  const kickoff = new Date(match.kickoff);
  const matchEnd = new Date(kickoff.getTime() + 120 * 60 * 1000);

  if (now >= kickoff && now <= matchEnd) return 'En vivo';
  if (now > matchEnd) return 'Final';
  return 'Proximo';
};

const applyLiveScore = (match, liveScores) => {
  const liveScore =
    liveScores.byId?.[match.id] ||
    liveScores.byMatchup?.[getMatchupKey(match.kickoff, match.home.code, match.away.code)] ||
    liveScores.byMatchup?.[getReverseMatchupKey(match.kickoff, match.home.code, match.away.code)];

  if (!liveScore) return match;

  return {
    ...match,
    homeScore: Number.isInteger(liveScore.homeScore) ? liveScore.homeScore : match.homeScore,
    awayScore: Number.isInteger(liveScore.awayScore) ? liveScore.awayScore : match.awayScore,
    liveStatus: liveScore.status || match.liveStatus
  };
};

const getFeaturedMatch = (matches) => {
  const now = new Date();
  const liveMatch = matches.find((match) => getMatchStatus(match) === 'En vivo');
  if (liveMatch) return liveMatch;

  const upcomingMatch = matches.find((match) => {
    const matchEnd = new Date(new Date(match.kickoff).getTime() + 120 * 60 * 1000);
    return matchEnd >= now;
  });

  return upcomingMatch ?? matches[matches.length - 1];
};

const getMatchWeek = (match) => {
  const date = new Date(match.kickoff);
  const day = date.getDate();

  if (day <= 17) return 'Semana 1 - Jornada 1';
  if (day <= 23) return 'Semana 2 - Jornada 2';
  return 'Semana 3 - Cierre de grupos';
};

const getCurrentCalendarWeek = (matchesByWeek) => {
  const now = new Date();
  const entries = Object.entries(matchesByWeek);

  const activeEntry = entries.find(([, matches]) => {
    const firstMatch = new Date(matches[0].kickoff);
    const lastMatch = new Date(matches[matches.length - 1].kickoff);
    lastMatch.setHours(23, 59, 59, 999);

    return now >= firstMatch && now <= lastMatch;
  });

  if (activeEntry) return activeEntry[0];

  const nextEntry = entries.find(([, matches]) => new Date(matches[matches.length - 1].kickoff) >= now);
  return nextEntry?.[0] ?? entries[entries.length - 1]?.[0];
};

const TeamFlag = ({ team, large = false }) => (
  <span className={`${large ? 'h-12 w-12' : 'h-7 w-7'} flex flex-none items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10`}>
    {team.flag ? (
      <img
        src={`https://flagcdn.com/w80/${team.flag}.png`}
        srcSet={`https://flagcdn.com/w160/${team.flag}.png 2x`}
        alt={`Bandera de ${team.name}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    ) : (
      <span className={`${large ? 'text-sm' : 'text-xs'} font-black text-white/70`}>{team.code}</span>
    )}
  </span>
);

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const blocks = [
    ['Dias', timeLeft.days, 'from-emerald-500 to-green-700', 'text-emerald-100'],
    ['Horas', timeLeft.hours, 'from-white to-slate-200', 'text-slate-950'],
    ['Min', timeLeft.minutes, 'from-red-500 to-red-700', 'text-red-50'],
    ['Seg', timeLeft.seconds, 'from-amber-300 to-yellow-500', 'text-slate-950']
  ];

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-3 shadow-2xl shadow-black/20 backdrop-blur-2xl">
      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="h-1.5 w-10 rounded-full bg-emerald-500" />
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-200/40 bg-gradient-to-br from-emerald-500 via-white to-red-500 shadow-lg shadow-amber-300/10">
          <Trophy className="h-5 w-5 text-slate-950" />
        </div>
        <span className="h-1.5 w-10 rounded-full bg-red-500" />
      </div>

      <p className="mb-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.24em] text-amber-100/80">
        Mexico cuenta regresiva
      </p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {blocks.map(([label, value, gradient, textColor]) => (
          <div
            key={label}
            className={`rounded-2xl border border-white/20 bg-gradient-to-br ${gradient} px-3 py-4 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]`}
          >
            <span className={`block text-2xl font-black leading-none ${textColor} sm:text-4xl`}>
              {String(value).padStart(2, '0')}
            </span>
            <span className={`mt-2 block text-[0.6rem] font-black uppercase tracking-[0.2em] ${textColor} opacity-70`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-full border border-white/10">
        <span className="h-2 bg-emerald-500" />
        <span className="h-2 bg-white" />
        <span className="h-2 bg-red-500" />
      </div>
    </div>
  );
};

const PromoCard = ({ promo }) => {
  const Icon = promo.icon;

  return (
    <article className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/20 backdrop-blur-2xl transition duration-500 hover:-translate-y-1 hover:border-white/20">
      <div className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r ${promo.accent} opacity-80`} />
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl transition duration-700 group-hover:bg-white/15" />

      <div className="relative mb-8 flex items-center justify-between">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${promo.accent} text-slate-950 shadow-lg`}>
          <Icon className="h-6 w-6" />
        </div>
        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/70">
          {promo.tag}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col">
        <p className="mb-3 text-sm font-medium text-slate-400">{promo.subtitle}</p>
        <h3 className="text-3xl font-semibold tracking-tight text-white">{promo.title}</h3>

        <div className="my-8">
          <div className="flex items-end gap-1">
            <span className="pb-1 text-lg font-semibold text-slate-400">$</span>
            <span className="text-6xl font-semibold tracking-tight text-white">{promo.price}</span>
            <span className="pb-2 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">MXN</span>
          </div>
          <p className="mt-2 text-sm text-slate-500">{promo.note}</p>
        </div>

        <ul className="mb-8 space-y-3">
          {promo.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle2 className="h-4 w-4 flex-none text-emerald-300" />
              {feature}
            </li>
          ))}
        </ul>

        <a
          href={getWhatsAppLink(`Hola AQUABRILLO, quiero la promocion mundialista "${promo.title}".`)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition duration-300 hover:scale-[1.02] hover:bg-[#1EBE5D] hover:shadow-[#25D366]/30"
        >
          Reservar paquete
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
};

const MatchRow = ({ match }) => {
  const hasScore = Number.isInteger(match.homeScore) && Number.isInteger(match.awayScore);
  const status = getMatchStatus(match);
  const isLive = status === 'En vivo';
  const shouldRenderScoreboard = hasScore || isLive;

  return (
    <div className={`rounded-2xl border p-3 text-slate-950 shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(0,0,0,0.24)] ${
      match.featured ? 'border-cyan-200 bg-cyan-50' : 'border-white/80 bg-white'
    }`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[0.68rem] font-bold capitalize text-slate-700">{formatMatchDate(match.kickoff)}</span>
          <span className="text-xs font-semibold text-slate-500">{formatMatchTime(match.kickoff)} CDMX</span>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${
          isLive ? 'bg-red-500 text-white' : match.featured ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-600'
        }`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className="min-w-0 text-left">
          <TeamFlag team={match.home} />
          <p className="mt-2 text-xs font-semibold text-slate-400">{match.stage}</p>
          <p className="mt-0.5 truncate text-sm font-bold text-slate-950">{match.home.name}</p>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-500">{match.home.code}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
          {shouldRenderScoreboard ? (
            <span className="font-mono text-lg font-black text-slate-950">{match.homeScore ?? 0} - {match.awayScore ?? 0}</span>
          ) : (
            <span className="font-mono text-xs font-black uppercase tracking-[0.16em] text-slate-500">VS</span>
          )}
        </div>

        <div className="min-w-0 text-right">
          <div className="flex justify-end">
            <TeamFlag team={match.away} />
          </div>
          <p className="mt-2 truncate text-xs text-slate-500">{match.venue}</p>
          <p className="mt-0.5 truncate text-sm font-bold text-slate-950">{match.away.name}</p>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-500">{match.away.code}</p>
        </div>
      </div>

    </div>
  );
};

const DynamicCard = ({ dynamic }) => {
  const Icon = dynamic.icon;

  return (
    <article
      className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30"
      data-dynamic-id={dynamic.id}
      data-automation-tag={dynamic.automationTag}
      data-whatsapp-intent={dynamic.whatsappIntent}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
          {dynamic.reward}
        </span>
      </div>
      <h4 className="text-lg font-semibold text-white">{dynamic.title}</h4>
      <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100/70">
        Dinamica seleccionada: {dynamic.title}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{dynamic.description}</p>
      <a
        href={getWhatsAppLink(getDynamicWhatsAppMessage(dynamic))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => registerDynamicSelection(dynamic)}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition duration-300 hover:bg-[#1EBE5D] hover:shadow-[#25D366]/30"
      >
        Participar por WhatsApp
        <MessageCircle className="h-4 w-4" />
      </a>
    </article>
  );
};

const MundialSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [calendarPage, setCalendarPage] = useState(0);
  const [liveScores, setLiveScores] = useState({});
  const sectionRef = useRef(null);

  const matchesWithLiveScores = useMemo(
    () => MATCHES.map((match) => applyLiveScore(match, liveScores)),
    [liveScores]
  );
  const featuredMatch = useMemo(() => getFeaturedMatch(matchesWithLiveScores), [matchesWithLiveScores]);
  const featuredStatus = getMatchStatus(featuredMatch);
  const featuredHasScore = Number.isInteger(featuredMatch.homeScore) && Number.isInteger(featuredMatch.awayScore);
  const shouldRenderFeaturedScore = featuredHasScore || featuredStatus === 'En vivo';
  const matchesByWeek = useMemo(() => (
    matchesWithLiveScores.reduce((weeks, match) => {
      const week = getMatchWeek(match);
      if (!weeks[week]) weeks[week] = [];
      weeks[week].push(match);
      return weeks;
    }, {})
  ), [matchesWithLiveScores]);
  const currentCalendarWeek = useMemo(() => getCurrentCalendarWeek(matchesByWeek), [matchesByWeek]);
  const matchesPerPage = 6;
  const totalCalendarPages = Math.ceil(matchesWithLiveScores.length / matchesPerPage);
  const visibleCalendarMatches = matchesWithLiveScores.slice(
    calendarPage * matchesPerPage,
    calendarPage * matchesPerPage + matchesPerPage
  );
  const firstVisibleMatch = visibleCalendarMatches[0];
  const lastVisibleMatch = visibleCalendarMatches[visibleCalendarMatches.length - 1];
  const showFullCalendar = false;
  const hiddenWeekEntries = [];
  const setShowFullCalendar = () => {};

  const goToCalendarPage = (direction) => {
    setCalendarPage((current) => Math.min(Math.max(current + direction, 0), totalCalendarPages - 1));
  };

  useEffect(() => {
    const updateVisibility = () => {
      const now = new Date();
      setIsVisible(now >= FECHA_INICIO_MUNDIAL && now <= FECHA_FIN_MUNDIAL);
    };

    updateVisibility();
    const interval = setInterval(updateVisibility, 3600000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!LIVE_SCORE_ENDPOINT) return undefined;

    const fetchLiveScores = async () => {
      try {
        const response = await fetch(getLiveScoreUrl());
        if (!response.ok) return;

        const payload = await response.json();
        const events = Array.isArray(payload.events) ? payload.events : [];

        setLiveScores(events.reduce((scoreMap, event) => {
          const competition = event.competitions?.[0];
          const competitors = competition?.competitors ?? [];
          const home = competitors.find((competitor) => competitor.homeAway === 'home');
          const away = competitors.find((competitor) => competitor.homeAway === 'away');
          const status = getEspnMatchStatus(event.status?.type?.name);
          const shouldShowScore = status === 'En vivo' || status === 'Final';

          if (!home?.team?.abbreviation || !away?.team?.abbreviation || !event.date) {
            return scoreMap;
          }

          const homeCode = normalizeTeamCode(home.team.abbreviation);
          const awayCode = normalizeTeamCode(away.team.abbreviation);
          const matchId = `${new Date(event.date).toISOString()}-${homeCode}-${awayCode}`;
          const matchupKey = getMatchupKey(event.date, homeCode, awayCode);
          const reverseMatchupKey = getReverseMatchupKey(event.date, homeCode, awayCode);
          const score = {
            homeScore: shouldShowScore ? Number(home.score) : null,
            awayScore: shouldShowScore ? Number(away.score) : null,
            status
          };
          const reverseScore = {
            homeScore: score.awayScore,
            awayScore: score.homeScore,
            status
          };

          return {
            ...scoreMap,
            byId: {
              ...scoreMap.byId,
              [matchId]: score
            },
            byMatchup: {
              ...scoreMap.byMatchup,
              [matchupKey]: score,
              [reverseMatchupKey]: reverseScore
            }
          };
        }, { byId: {}, byMatchup: {} }));
      } catch {
        // Keep the local schedule if the live score feed is unavailable.
      }
    };

    fetchLiveScores();
    const interval = setInterval(fetchLiveScores, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isVisible || !sectionRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aquabrillo-mundial-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section
      ref={sectionRef}
      id="promociones-mundialistas"
      className="relative overflow-hidden bg-[#05070d] py-20 text-white md:py-28"
    >
      <style>{`
        #promociones-mundialistas .mundial-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 800ms ease, transform 800ms ease;
        }

        #promociones-mundialistas.aquabrillo-mundial-visible .mundial-reveal {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes aquabrillo-score-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(103, 232, 249, 0.28); }
          50% { box-shadow: 0 0 0 12px rgba(103, 232, 249, 0); }
        }

      `}</style>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,145,178,0.16),transparent_35%,rgba(234,179,8,0.10)_70%,transparent)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:72px_72px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mundial-reveal grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
              <Sparkles className="h-4 w-4 text-cyan-200" />
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-300">Por tiempo limitado, ofertas exclusivas del Mundial</span>
            </div>

            <h2 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-4xl">
              Disfruta del Mundial sin distracciones y con tu auto reluciente.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Agenda tu lavado y detallado a domicilio antes del partido, desbloquea dinámicas según el marcador y disfruta de beneficios premium durante todo el Mundial.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition duration-300 hover:scale-[1.02] hover:bg-[#1EBE5D] hover:shadow-[#25D366]/30"
              >
                <MessageCircle className="h-5 w-5" />
                Agendar promocion
              </a>
              <a
                href="#calendario-mundial"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-4 text-sm font-bold text-white transition duration-300 hover:bg-white/10"
              >
                Ver calendario
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/25 backdrop-blur-2xl">
            <div className="rounded-[1.75rem] border border-cyan-200/15 bg-slate-950/70 p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">Partido destacado</p>
                  <p className="mt-1 text-sm text-slate-500">{featuredMatch.stage} - {featuredMatch.venue}</p>
                </div>
                <span className="rounded-full bg-cyan-300 px-3 py-1 text-xs font-bold text-slate-950" style={{ animation: 'aquabrillo-score-pulse 2.4s ease-in-out infinite' }}>
                  {featuredStatus}
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                <div className="min-w-0">
                  <TeamFlag team={featuredMatch.home} large />
                  <p className="mt-3 truncate text-xl font-semibold text-white">{featuredMatch.home.name}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{featuredMatch.home.code}</p>
                </div>
                <div className="rounded-2xl bg-white px-5 py-4 text-center font-mono text-lg font-black text-slate-950">
                  {shouldRenderFeaturedScore
                    ? `${featuredMatch.homeScore ?? 0} - ${featuredMatch.awayScore ?? 0}`
                    : 'VS'}
                </div>
                <div className="min-w-0">
                  <div className="flex justify-center">
                    <TeamFlag team={featuredMatch.away} large />
                  </div>
                  <p className="mt-3 truncate text-xl font-semibold text-white">{featuredMatch.away.name}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{featuredMatch.away.code}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-center gap-3 text-sm text-slate-400">
                <CalendarDays className="h-4 w-4 text-cyan-200" />
                <span className="capitalize">{formatMatchDate(featuredMatch.kickoff)}</span>
                <Clock className="h-4 w-4 text-cyan-200" />
                <span>{formatMatchTime(featuredMatch.kickoff)} CDMX</span>
              </div>
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm text-slate-300">
                {featuredMatch.reward}
              </div>
            </div>
          </div>
        </div>

        <div className="mundial-reveal mt-10 max-w-xl" style={{ transitionDelay: '120ms' }}>
          <CountdownTimer targetDate={FECHA_FIN_MUNDIAL} />
        </div>

        <div className="mundial-reveal mt-14 grid gap-5 md:grid-cols-3" style={{ transitionDelay: '180ms' }}>
          {PROMOS.map((promo) => (
            <PromoCard key={promo.title} promo={promo} />
          ))}
        </div>

        <div id="calendario-mundial" className="mundial-reveal mt-20" style={{ transitionDelay: '260ms' }}>
          <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Calendario en vivo</p>
              <h3 className="mt-4 text-4xl font-semibold tracking-tight text-white">Próximos partidos.</h3>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-400">
              Tú pones la pasión, nosotros ponemos el brillo. Adivina los resultados de los próximos partidos y participa por una promoción especial en nuestro servicio de lavado y detallado a domicilio. ¡Sin moverte de tu casa!.
            </p>
          </div>

          <div className="space-y-8">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-3 sm:p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-xl font-semibold tracking-tight text-white">{currentCalendarWeek}</h4>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                  Mostrando {calendarPage * matchesPerPage + 1}-{calendarPage * matchesPerPage + visibleCalendarMatches.length} de {matchesWithLiveScores.length} partidos
                    {firstVisibleMatch && lastVisibleMatch ? ` - ${formatMatchDate(firstVisibleMatch.kickoff)} a ${formatMatchDate(lastVisibleMatch.kickoff)}` : ''}
                  </p>
                </div>
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
                  <button
                    type="button"
                    onClick={() => goToCalendarPage(-1)}
                    disabled={calendarPage === 0}
                    aria-label="Ver partidos anteriores"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-5 w-5 rotate-180" />
                  </button>
                  <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                    Pagina {calendarPage + 1} / {totalCalendarPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToCalendarPage(1)}
                    disabled={calendarPage >= totalCalendarPages - 1}
                    aria-label="Ver siguientes partidos"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cyan-200 bg-cyan-300 text-slate-950 shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visibleCalendarMatches.map((match) => (
                  <MatchRow key={`${match.kickoff}-${match.home.code}-${match.away.code}`} match={match} />
                ))}
              </div>
              <div className="mt-4 flex justify-center gap-1.5">
                {Array.from({ length: totalCalendarPages }).map((_, index) => (
                  <span
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${index === calendarPage ? 'w-7 bg-cyan-300' : 'w-2 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>

            {showFullCalendar && hiddenWeekEntries.map(([week, matches]) => (
              <div key={week} className="rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-3 sm:p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-semibold tracking-tight text-white">{week}</h4>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Horario CDMX - {matches.length} partidos
                    </p>
                  </div>
                  <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">
                    Estilo resultados
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {matches.map((match) => (
                    <MatchRow key={`${match.kickoff}-${match.home.code}-${match.away.code}`} match={match} />
                  ))}
                </div>
              </div>
            ))}

            {!showFullCalendar && hiddenWeekEntries.length > 0 && (
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowFullCalendar(true)}
                  className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-slate-50 sm:w-auto"
                >
                  Ver más partidos
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden" style={{ transitionDelay: '340ms' }}>
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">AQUAVIDEOS</p>
              <h3 className="mt-4 text-4xl font-semibold tracking-tight text-white">Disfruta de los mejores goles de los últimos mundiales.</h3>
            </div>
            <a
              href={getWhatsAppLink('Hola AQUABRILLO, quiero ver las promociones en video del Mundial.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-cyan-100 hover:text-white"
            >
              Pedir recomendacion
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-3" />
        </div>

        <div id="dinamicas-mundialistas" className="mundial-reveal mt-20" style={{ transitionDelay: '420ms' }}>
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Dinamicas para clientes</p>
            <h3 className="mt-4 text-4xl font-semibold tracking-tight text-white">Cada partido abre una nueva recompensa.</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DYNAMICS.map((dynamic) => (
              <DynamicCard key={dynamic.id} dynamic={dynamic} />
            ))}
          </div>
        </div>

        <div className="mundial-reveal mt-16 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-2xl md:p-8" style={{ transitionDelay: '500ms' }}>
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-white text-slate-950">
                <Car className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-white">Agenda en minutos, nosotros vamos a domicilio.</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Reserva por WhatsApp, elige tu paquete mundialista y participa automaticamente en las dinamicas vigentes.
                </p>
              </div>
            </div>
            <a
              href={getWhatsAppLink('Hola AQUABRILLO, quiero reservar una promocion mundialista y participar en las dinamicas.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-none items-center justify-center gap-3 rounded-full bg-[#25D366] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-[#25D366]/20 transition duration-300 hover:scale-[1.02] hover:bg-[#1EBE5D] hover:shadow-[#25D366]/30"
            >
              <MessageCircle className="h-5 w-5" />
              Reservar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MundialSection;
