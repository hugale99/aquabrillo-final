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
  Play,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Users,
  Video
} from 'lucide-react';

// ============================================================
// CONFIGURACION MUNDIAL AQUABRILLO
// ============================================================

const FECHA_INICIO_MUNDIAL = new Date('2026-06-10T00:00:00');
const FECHA_FIN_MUNDIAL = new Date('2026-07-19T23:59:59');

const WHATSAPP_NUMBER = '7773887690';
const WHATSAPP_MESSAGE = 'Hola AQUABRILLO, quiero aprovechar una promocion exclusiva del Mundial.';

const getWhatsAppLink = (text = WHATSAPP_MESSAGE) =>
  `https://wa.me/52${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// Videos no-FIFA verificados con oEmbed 200 y enlace de respaldo.
const WORLD_CUP_VIDEOS = [
  {
    title: 'Brasil 2014 - We Are One',
    label: 'PitbullVEVO',
    src: '',
    poster: 'https://img.youtube.com/vi/TGtWWb9emYI/hqdefault.jpg',
    youtubeId: 'TGtWWb9emYI',
    sourceUrl: 'https://www.youtube.com/watch?v=TGtWWb9emYI',
    cta: 'Ver en YouTube'
  },
  {
    title: 'Rusia 2018 - Live It Up',
    label: 'NickyJamTV',
    src: '',
    poster: 'https://img.youtube.com/vi/V15BYnSr0P8/hqdefault.jpg',
    youtubeId: 'V15BYnSr0P8',
    sourceUrl: 'https://www.youtube.com/watch?v=V15BYnSr0P8',
    cta: 'Ver en YouTube'
  },
  {
    title: 'Qatar 2022 - Hayya Hayya',
    label: 'Universal Music',
    src: '',
    poster: 'https://img.youtube.com/vi/keFzKYeUjfk/hqdefault.jpg',
    youtubeId: 'keFzKYeUjfk',
    sourceUrl: 'https://www.youtube.com/watch?v=keFzKYeUjfk',
    cta: 'Ver en YouTube'
  }
];

const PROMOS = [
  {
    icon: Sparkles,
    tag: 'Kickoff',
    title: 'Gol de Brillo',
    subtitle: 'Lavado exterior + aspirado express',
    price: '150',
    note: 'Ideal para llegar impecable al partido',
    features: ['Lavado exterior cuidadoso', 'Aspirado rapido', 'Cristales limpios'],
    accent: 'from-cyan-300 to-blue-400'
  },
  {
    icon: Trophy,
    tag: 'Mas elegido',
    title: 'Combo Mundialista',
    subtitle: 'Lavado premium completo',
    price: '349',
    note: 'Brillo, interior y aroma premium',
    features: ['Lavado premium', 'Hidratacion de plasticos', 'Aromatizacion premium'],
    accent: 'from-amber-200 to-yellow-500'
  },
  {
    icon: Shield,
    tag: 'Edicion limitada',
    title: 'Hat-Trick AQUABRILLO',
    subtitle: 'Brillo extremo + proteccion',
    price: '599',
    note: 'Para autos que merecen final',
    features: ['Lavado premium', 'Descontaminado de cristales', 'Terminacion ceramica'],
    accent: 'from-emerald-300 to-teal-500'
  }
];

const MATCHES = [
  {
    kickoff: '2026-06-11T13:00:00-06:00',
    stage: 'Grupo A',
    venue: 'Ciudad de Mexico',
    home: { name: 'Mexico', code: 'MEX', flag: 'mx' },
    away: { name: 'Sudafrica', code: 'RSA', flag: 'za' },
    homeScore: null,
    awayScore: null,
    featured: true,
    reward: 'Si le atinas al equipo ganador: Descontaminado gratis de cristales'
  },
  {
    kickoff: '2026-06-11T19:00:00-06:00',
    stage: 'Grupo A',
    venue: 'Guadalajara',
    home: { name: 'Corea Republica', code: 'KOR', flag: 'kr' },
    away: { name: 'Chequia', code: 'CZE', flag: 'cz' },
    homeScore: null,
    awayScore: null,
    featured: false,
    reward: 'Pronostico correcto: 15% OFF'
  },
  {
    kickoff: '2026-06-12T13:00:00-06:00',
    stage: 'Grupo B',
    venue: 'Toronto',
    home: { name: 'Canada', code: 'CAN', flag: 'ca' },
    away: { name: 'Bosnia y Herzegovina', code: 'BIH', flag: 'ba' },
    homeScore: null,
    awayScore: null,
    featured: false,
    reward: 'Agenda antes del juego: aromatizante gratis'
  },
  {
    kickoff: '2026-06-12T19:00:00-06:00',
    stage: 'Grupo D',
    venue: 'Los Angeles',
    home: { name: 'Estados Unidos', code: 'USA', flag: 'us' },
    away: { name: 'Paraguay', code: 'PAR', flag: 'py' },
    homeScore: null,
    awayScore: null,
    featured: false,
    reward: 'Comparte marcador: participa por upgrade'
  },
  {
    kickoff: '2026-06-18T20:00:00-06:00',
    stage: 'Grupo A',
    venue: 'Guadalajara',
    home: { name: 'Mexico', code: 'MEX', flag: 'mx' },
    away: { name: 'Corea Republica', code: 'KOR', flag: 'kr' },
    homeScore: null,
    awayScore: null,
    featured: true,
    reward: 'Gol de Mexico: hidratacion de plasticos'
  },
  {
    kickoff: '2026-06-24T19:00:00-06:00',
    stage: 'Grupo A',
    venue: 'Ciudad de Mexico',
    home: { name: 'Mexico', code: 'MEX', flag: 'mx' },
    away: { name: 'Chequia', code: 'CZE', flag: 'cz' },
    homeScore: null,
    awayScore: null,
    featured: true,
    reward: 'Cierre de grupo: paquete premium limitado'
  },
  {
    kickoff: '2026-07-19T16:00:00-06:00',
    stage: 'Final',
    venue: 'New York/New Jersey',
    home: { name: 'Ganador SF1', code: 'SF1', flag: null },
    away: { name: 'Ganador SF2', code: 'SF2', flag: null },
    homeScore: null,
    awayScore: null,
    featured: false,
    reward: 'Gran cierre: sorteo de detallado interior'
  }
];

const DYNAMICS = [
  {
    icon: Trophy,
    title: 'Adivina el marcador',
    description: 'Agenda tu lavado, manda tu pronostico antes del silbatazo y participa por descuento en tu siguiente servicio.',
    reward: 'Hasta 25% OFF'
  },
  {
    icon: Star,
    title: 'Gol de Mexico',
    description: 'Si Mexico gana, quienes agenden ese dia reciben un upgrade de hidratacion de plasticos o cristales premium.',
    reward: 'Upgrade gratis'
  },
  {
    icon: Users,
    title: 'Cliente MVP',
    description: 'Recomienda a un amigo durante el Mundial. Si ambos agendan, los dos reciben beneficio en su proxima visita.',
    reward: 'Beneficio doble'
  },
  {
    icon: Gift,
    title: 'Historia campeona',
    description: 'Sube una historia de tu auto limpio, etiqueta a AQUABRILLO y participa por una limpieza interior completa.',
    reward: 'Sorteo semanal'
  }
];

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
  const now = new Date();
  const kickoff = new Date(match.kickoff);
  const matchEnd = new Date(kickoff.getTime() + 120 * 60 * 1000);

  if (now >= kickoff && now <= matchEnd) return 'En vivo';
  if (now > matchEnd) return 'Final';
  return 'Proximo';
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
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition duration-300 hover:scale-[1.02] hover:bg-cyan-100"
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

  return (
    <div className={`rounded-2xl border p-3 transition duration-300 hover:bg-white/[0.06] ${
      match.featured ? 'border-cyan-300/25 bg-cyan-300/[0.06]' : 'border-white/10 bg-white/[0.035]'
    }`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-2.5 py-1 text-[0.68rem] font-bold capitalize text-slate-950">{formatMatchDate(match.kickoff)}</span>
          <span className="text-xs font-medium text-slate-400">{formatMatchTime(match.kickoff)} CDMX</span>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold ${
          isLive ? 'bg-red-500 text-white' : match.featured ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-slate-300'
        }`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2">
        <div className="min-w-0 text-left">
          <TeamFlag team={match.home} />
          <p className="mt-2 text-xs text-slate-500">{match.stage}</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-white">{match.home.name}</p>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-500">{match.home.code}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-center shadow-inner shadow-black/20">
          {hasScore ? (
            <span className="font-mono text-lg font-bold text-white">{match.homeScore} - {match.awayScore}</span>
          ) : (
            <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-slate-400">VS</span>
          )}
        </div>

        <div className="min-w-0 text-right">
          <div className="flex justify-end">
            <TeamFlag team={match.away} />
          </div>
          <p className="mt-2 truncate text-xs text-slate-500">{match.venue}</p>
          <p className="mt-0.5 truncate text-sm font-semibold text-white">{match.away.name}</p>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-500">{match.away.code}</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-xs leading-5 text-slate-300">
        {match.reward}
      </div>
    </div>
  );
};

const VideoCard = ({ video, index }) => {
  const [videoError, setVideoError] = useState(false);

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="relative aspect-[9/14] overflow-hidden bg-slate-900">
        {video.youtubeId ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : !videoError ? (
          <video
            className="h-full w-full object-cover"
            src={video.src}
            poster={video.poster}
            muted
            loop
            playsInline
            preload="metadata"
            onMouseEnter={(event) => event.currentTarget.play().catch(() => {})}
            onMouseLeave={(event) => event.currentTarget.pause()}
            onError={() => setVideoError(true)}
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
            index === 0 ? 'from-cyan-500/25 via-slate-950 to-blue-900/30' : index === 1 ? 'from-emerald-400/20 via-slate-950 to-cyan-900/30' : 'from-amber-300/20 via-slate-950 to-cyan-900/30'
          }`}>
            <div className="text-center">
              <Video className="mx-auto mb-4 h-10 w-10 text-white/60" />
              <p className="mx-auto max-w-[11rem] text-sm font-medium text-white/70">Agrega el video en public/videos/mundial</p>
            </div>
          </div>
        )}

        {!video.youtubeId && <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />}
        <div className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-xs font-bold text-white backdrop-blur-xl">
          {video.label}
        </div>
        <div className={`absolute inset-x-4 bottom-4 ${video.youtubeId ? 'pointer-events-none' : ''}`}>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950 shadow-xl transition duration-300 group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </div>
          <h4 className="text-xl font-semibold text-white">{video.title}</h4>
          <p className="mt-1 text-sm text-slate-300">{video.cta}</p>
        </div>
      </div>
      {video.sourceUrl && (
        <div className="border-t border-white/10 p-4">
          <a
            href={video.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-slate-950 transition duration-300 hover:bg-cyan-100"
          >
            {video.cta}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </article>
  );
};

const DynamicCard = ({ dynamic }) => {
  const Icon = dynamic.icon;

  return (
    <article className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950">
          <Icon className="h-5 w-5" />
        </div>
        <span className="rounded-full bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-200">
          {dynamic.reward}
        </span>
      </div>
      <h4 className="text-lg font-semibold text-white">{dynamic.title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{dynamic.description}</p>
    </article>
  );
};

const MundialSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const featuredMatch = useMemo(() => MATCHES.find((match) => match.featured) ?? MATCHES[0], []);
  const featuredStatus = getMatchStatus(featuredMatch);

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
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-slate-300">Ofertas exclusivas del Mundial</span>
            </div>

            <h2 className="max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              El partido se vive mejor con tu auto impecable.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Agenda antes del silbatazo, desbloquea dinamicas por marcador y recibe beneficios premium durante todo el Mundial.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-bold text-slate-950 transition duration-300 hover:scale-[1.02] hover:bg-cyan-100"
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
                <div className="rounded-2xl bg-white px-5 py-4 font-mono text-lg font-black text-slate-950">VS</div>
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

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {MATCHES.map((match) => (
              <MatchRow key={`${match.kickoff}-${match.home.code}-${match.away.code}`} match={match} />
            ))}
          </div>
        </div>

        <div className="mundial-reveal mt-20" style={{ transitionDelay: '340ms' }}>
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

          <div className="grid gap-5 sm:grid-cols-3">
            {WORLD_CUP_VIDEOS.map((video, index) => (
              <VideoCard key={video.title} video={video} index={index} />
            ))}
          </div>
        </div>

        <div id="dinamicas-mundialistas" className="mundial-reveal mt-20" style={{ transitionDelay: '420ms' }}>
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-200">Dinamicas para clientes</p>
            <h3 className="mt-4 text-4xl font-semibold tracking-tight text-white">Cada partido abre una nueva recompensa.</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DYNAMICS.map((dynamic) => (
              <DynamicCard key={dynamic.title} dynamic={dynamic} />
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
              className="inline-flex flex-none items-center justify-center gap-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-green-500/20 transition duration-300 hover:scale-[1.02]"
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
