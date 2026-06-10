import { useState, useEffect, useRef } from 'react';
import { MessageCircle, ArrowRight, Clock, Trophy, Star, Camera, Share2, Users } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURACIÓN - MODIFICA ESTAS VARIABLES SEGÚN EL MUNDIAL
// ═══════════════════════════════════════════════════════════════════════

// Fechas del Mundial (formato ISO: "YYYY-MM-DDTHH:MM:SS")
const FECHA_INICIO_MUNDIAL = new Date("2026-06-11T00:00:00");  // ← MODIFICA: Inicio del Mundial
const FECHA_FIN_MUNDIAL    = new Date("2026-07-19T23:59:59");  // ← MODIFICA: Fin del Mundial

// Número de WhatsApp (código de país sin el '+', ej: 5215512345678)
const WHATSAPP_NUMBER = "7773887690";  // ← MODIFICA: Tu número de WhatsApp

// Mensaje predeterminado para WhatsApp
const WHATSAPP_MESSAGE = "Hola AQUABRILLO, quiero aprovechar una promoción mundialista para mi auto.";

// Función helper para generar link de WhatsApp
const getWhatsAppLink = (text = WHATSAPP_MESSAGE) => 
  `https://wa.me/52${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE: CONTADOR REGRESIVO
// ═══════════════════════════════════════════════════════════════════════

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n) => String(n).padStart(2, '0');

  const timeBlocks = [
    { value: timeLeft.days, label: 'Días' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Min' },
    { value: timeLeft.seconds, label: 'Seg' }
  ];

  return (
    <div className="flex items-center gap-3 md:gap-4 justify-center">
      {timeBlocks.map((block, index) => (
        <div key={index} className="flex items-center gap-3 md:gap-4">
          <div className="text-center min-w-[55px] md:min-w-[70px]">
            <span className="block text-3xl md:text-5xl font-black text-white leading-none tracking-tight drop-shadow-[0_2px_10px_rgba(0,180,216,0.3)]">
              {pad(block.value)}
            </span>
            <span className="block text-[0.6rem] md:text-xs font-semibold uppercase tracking-[2px] text-slate-400 mt-1 md:mt-2">
              {block.label}
            </span>
          </div>
          {index < timeBlocks.length - 1 && (
            <span className="text-2xl md:text-4xl font-bold text-amber-400 self-start pt-1">:</span>
          )}
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE: TARJETA DE PROMOCIÓN
// ═══════════════════════════════════════════════════════════════════════

const PromoCard = ({ promo, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const tagStyles = {
    offer: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    popular: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    limited: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
    gift: 'bg-violet-500/15 text-violet-400 border-violet-500/25'
  };

  const iconBgStyles = [
    'bg-cyan-500/10 border-cyan-500/20',
    'bg-emerald-500/10 border-emerald-500/20',
    'bg-amber-500/10 border-amber-500/20',
    'bg-blue-500/10 border-blue-500/20'
  ];

  return (
    <div 
      className="group relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] p-6 md:p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-amber-500/30 hover:shadow-[0_8px_40px_rgba(212,175,55,0.15)]"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Barra superior animada */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 transition-transform duration-500 origin-left"
        style={{ transform: isHovered ? 'scaleX(1)' : 'scaleX(0)' }}
      />

      {/* Icono */}
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 ${iconBgStyles[index % iconBgStyles.length]} border`}>
        {promo.icon}
      </div>

      {/* Tag */}
      <span className={`inline-block px-3 py-1 rounded-full text-[0.65rem] font-extrabold uppercase tracking-[2px] border mb-3 ${tagStyles[promo.tagType]}`}>
        {promo.tag}
      </span>

      {/* Título */}
      <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3 leading-tight">
        {promo.title}
      </h3>

      {/* Descripción */}
      <p className="text-slate-400 text-sm leading-relaxed mb-5">
        {promo.description}
      </p>

      {/* Precio */}
      <div className="mb-5">
        <div className="flex items-baseline gap-1">
          <span className="text-amber-400 font-bold text-lg">$</span>
          <span className="text-3xl md:text-4xl font-black text-amber-400 leading-none">
            {promo.price}
          </span>
          <span className="text-amber-300/70 font-semibold text-sm ml-1">MXN</span>
        </div>
        <p className="text-slate-500 text-xs mt-1">{promo.priceNote}</p>
      </div>

      {/* Servicios incluidos */}
      <ul className="space-y-2 mb-6">
        {promo.services.map((service, i) => (
          <li key={i} className="flex items-center gap-3 text-sm text-slate-300 py-1 border-b border-white/[0.03] last:border-0">
            <span className="text-emerald-400 font-bold text-sm flex-shrink-0">✓</span>
            {service}
          </li>
        ))}
      </ul>

      {/* Botón CTA */}
      <a
        href={getWhatsAppLink(`Hola AQUABRILLO, quiero la promoción "${promo.title}" para mi auto.`)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-extrabold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_6px_30px_rgba(212,175,55,0.35)] hover:scale-[1.02] transition-all duration-300"
      >
        {promo.ctaIcon}
        {promo.ctaText}
      </a>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE: TARJETA DE DINÁMICA
// ═══════════════════════════════════════════════════════════════════════

const DynamicCard = ({ dynamic, index }) => {
  const iconMap = {
    dice: <Trophy className="w-8 h-8 text-amber-400" />,
    mexico: <Star className="w-8 h-8 text-emerald-400" />,
    mvp: <Users className="w-8 h-8 text-cyan-400" />,
    photo: <Camera className="w-8 h-8 text-violet-400" />
  };

  return (
    <div 
      className="text-center p-6 md:p-7 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-amber-500/20 hover:-translate-y-1 transition-all duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
        {iconMap[dynamic.icon]}
      </div>
      <h4 className="text-lg font-bold text-white mb-2">{dynamic.title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: dynamic.description }} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL: SECCIÓN MUNDIALISTA
// ═══════════════════════════════════════════════════════════════════════

const MundialSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Verificar si estamos dentro del rango de fechas del Mundial
  useEffect(() => {
    const now = new Date();
    const shouldShow = now >= FECHA_INICIO_MUNDIAL && now <= FECHA_FIN_MUNDIAL;
    setIsVisible(shouldShow);

    // Re-verificar cada hora
    const interval = setInterval(() => {
      const current = new Date();
      setIsVisible(current >= FECHA_INICIO_MUNDIAL && current <= FECHA_FIN_MUNDIAL);
    }, 3600000);

    return () => clearInterval(interval);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    if (!isVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aquabrillo-visible');
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Si no está en rango de fechas, no renderizar nada
  if (!isVisible) return null;

  // ─── DATOS DE PROMOCIONES ───
  // ← MODIFICA: Precios, servicios y textos de las promociones aquí
  const promociones = [
    {
      icon: '⚽',
      tag: 'Oferta Mundial',
      tagType: 'offer',
      title: 'Gol de Brillo',
      description: 'Ideal para dejar tu auto limpio antes del partido. ¡No pierdas ni un segundo del juego!',
      price: '120',
      priceNote: 'Lavado básico interior y exterior',
      services: ['Lavado básico interior y exterior', 'Aspirado rápido', 'Limpieza de cristales básica'],
      ctaText: 'Agendar ahora',
      ctaIcon: '⚡'
    },
    {
      icon: '🏆',
      tag: 'Más Popular',
      tagType: 'popular',
      title: 'Combo Mundialista',
      description: 'El combo perfecto para que tu auto luzca como campeón. Brillo, protección y cuidado total.',
      price: '349',
      priceNote: 'Precio promocional especial',
      services: ['Lavado premium completo', 'Hidratación de plásticos', 'Limpieza de cristales profesional', 'Aromatización premium'],
      ctaText: 'Elegir combo',
      ctaIcon: '🏆'
    },
    {
      icon: '🎯',
      tag: 'Edición Limitada',
      tagType: 'limited',
      title: 'Hat-Trick AQUABRILLO',
      description: 'Triple impacto: brillo extremo, protección cerámica y visibilidad perfecta. ¡El MVP de los lavados!',
      price: '599',
      priceNote: 'La mejor inversión para tu auto',
      services: ['Lavado completo premium', 'Descontaminado de cristales', 'Terminación cerámica', 'Protección UV 6 meses'],
      ctaText: 'Quiero el Hat-Trick',
      ctaIcon: '🎯'
    },
    {
      icon: '🌟',
      tag: 'Incluye regalo',
      tagType: 'gift',
      title: 'Fan Interior Premium',
      description: 'Disfruta tu auto como nuevo. Detallado interior completo con eliminación de olores ¡GRATIS!',
      price: '450',
      priceNote: 'Eliminación de olores incluido',
      services: ['Detallado interior completo', 'Limpieza de tapicería profunda', 'Eliminación de olores GRATIS', 'Aromatización premium'],
      ctaText: 'Reservar ahora',
      ctaIcon: '🌟'
    }
  ];

  // ─── DATOS DE DINÁMICAS ───
  // ← MODIFICA: Textos de las dinámicas aquí
  const dinamicas = [
    {
      icon: 'dice',
      title: 'Adivina el Marcador',
      description: 'Agenda tu lavado, manda tu pronóstico del partido y participa por un <strong class="text-amber-400">descuento especial</strong> en tu siguiente servicio.'
    },
    {
      icon: 'mexico',
      title: 'Gol de México',
      description: 'Si México gana, los clientes que agenden ese día reciben <strong class="text-emerald-400">hidratación de plásticos o limpieza de cristales GRATIS</strong>.'
    },
    {
      icon: 'mvp',
      title: 'Cliente MVP',
      description: 'Recomienda a un amigo durante el Mundial y ambos reciben <strong class="text-cyan-400">descuento o servicio adicional</strong> en su siguiente visita.'
    },
    {
      icon: 'photo',
      title: 'Sube tu Foto',
      description: 'Sube una historia de tu auto limpio etiquetando a <strong class="text-violet-400">@AQUABRILLO</strong> y participa por una <strong class="text-violet-400">limpieza interior completa GRATIS</strong>.'
    }
  ];

  // ─── SERVICIOS DESTACADOS ───
  // ← MODIFICA: Lista de servicios aquí
  const servicios = [
    { icon: '💧', name: 'Lavado básico' },
    { icon: '✨', name: 'Lavado premium' },
    { icon: '🪑', name: 'Detallado interior' },
    { icon: '🔮', name: 'Descontaminado de cristales' },
    { icon: '🛡️', name: 'Terminación cerámica' },
    { icon: '🌿', name: 'Eliminación de olores' },
    { icon: '🧴', name: 'Hidratación de plásticos' },
    { icon: '🧽', name: 'Limpieza de tapicería' },
    { icon: '🏠', name: 'Servicio a domicilio' }
  ];

  return (
    <section 
      ref={sectionRef}
      id="promociones-mundialistas"
      className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-[#0A1A3A] via-[#0f1f45] to-[#0A1A3A]"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_20%_30%,rgba(0,180,216,0.06)_0%,transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(27,138,60,0.06)_0%,transparent_50%),radial-gradient(ellipse_at_50%_50%,rgba(212,175,55,0.04)_0%,transparent_60%)]" 
          style={{ animation: 'aquabrillo-float-bg 20s ease-in-out infinite' }} 
        />
        {/* Líneas de cancha */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-1/2 left-[5%] right-[5%] h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="absolute top-[20%] bottom-[20%] left-1/2 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent" />
        </div>
      </div>

      {/* Confeti animado */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-sm opacity-30"
            style={{
              left: `${5 + i * 10}%`,
              backgroundColor: ['#D4AF37', '#00B4D8', '#1B8A3C', '#D4AF37', '#FFFFFF'][i % 5],
              borderRadius: i % 3 === 0 ? '50%' : '2px',
              width: `${5 + (i % 3) * 2}px`,
              height: `${5 + (i % 3) * 2}px`,
              animation: `aquabrillo-confetti-fall ${10 + i * 2}s linear infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes aquabrillo-float-bg {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-2%, 1%) rotate(1deg); }
          66% { transform: translate(1%, -2%) rotate(-1deg); }
        }
        @keyframes aquabrillo-confetti-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(calc(100vh + 100px)) rotate(720deg); opacity: 0; }
        }
        @keyframes aquabrillo-pulse-gold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,55,0.35); }
          50% { box-shadow: 0 0 0 12px rgba(212,175,55,0); }
        }
        #promociones-mundialistas .aquabrillo-visible .animate-in {
          animation: aquabrillo-fade-in-up 0.8s ease-out forwards;
        }
        @keyframes aquabrillo-fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ═══ HEADER ═══ */}
        <div className="text-center mb-12 md:mb-16 animate-in" style={{ animationDelay: '0ms' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm mb-6">
            <span className="text-lg">⚽</span>
            <span className="text-xs md:text-sm font-bold text-amber-400 uppercase tracking-[3px]">
              Promociones por tiempo limitado
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] mb-6 tracking-tight">
            ¡Que tu auto también<br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              juegue limpio
            </span><br />
            <span className="text-3xl md:text-5xl lg:text-6xl font-light text-slate-400">
              este Mundial!
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-400 leading-relaxed">
            Celebra cada partido con tu auto impecable. Aprovecha promociones exclusivas, 
            dinámicas mundialistas y servicios a domicilio por tiempo limitado.
          </p>
        </div>

        {/* ═══ CONTADOR REGRESIVO ═══ */}
        <div className="flex justify-center mb-12 md:mb-16 animate-in" style={{ animationDelay: '200ms' }}>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl px-6 py-5 md:px-10 md:py-6 text-center shadow-xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs md:text-sm font-bold text-amber-400 uppercase tracking-[3px]">
                Terminan las promociones en:
              </span>
            </div>
            <CountdownTimer targetDate={FECHA_FIN_MUNDIAL} />
          </div>
        </div>

        {/* ═══ GRID DE PROMOCIONES ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mb-16 md:mb-20">
          {promociones.map((promo, index) => (
            <div key={index} className="animate-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
              <PromoCard promo={promo} index={index} />
            </div>
          ))}
        </div>

        {/* ═══ DINÁMICAS MUNDIALISTAS ═══ */}
        <div className="mb-16 md:mb-20 animate-in" style={{ animationDelay: '500ms' }}>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white text-center mb-8 md:mb-10">
            ⚡ <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">Dinámicas Mundialistas</span> ⚡
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {dinamicas.map((dynamic, index) => (
              <div key={index} className="animate-in" style={{ animationDelay: `${(index + 6) * 100}ms` }}>
                <DynamicCard dynamic={dynamic} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* ═══ SERVICIOS DESTACADOS ═══ */}
        <div className="mb-16 md:mb-20 animate-in" style={{ animationDelay: '700ms' }}>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white text-center mb-8 md:mb-10">
            🚗 <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Servicios AQUABRILLO</span> 🚗
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {servicios.map((service, index) => (
              <span 
                key={index}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 hover:border-cyan-500/40 hover:scale-105 transition-all duration-300 cursor-default"
              >
                <span className="text-base">{service.icon}</span>
                {service.name}
              </span>
            ))}
          </div>
        </div>

        {/* ═══ CTA FINAL ═══ */}
        <div className="text-center bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 md:p-12 animate-in" style={{ animationDelay: '900ms' }}>
          <h3 className="text-xl md:text-3xl font-extrabold text-white mb-3">
            ¿Listo para dejar tu auto impecable?
          </h3>
          <p className="text-slate-400 text-base md:text-lg mb-8 max-w-xl mx-auto">
            Agenda ahora por WhatsApp y aprovecha las promociones mundialistas antes de que terminen.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-extrabold rounded-full hover:shadow-[0_6px_30px_rgba(37,211,102,0.35)] hover:scale-105 transition-all duration-300 text-base md:text-lg"
              style={{ animation: 'aquabrillo-pulse-gold 2s ease-in-out infinite' }}
            >
              <MessageCircle className="w-6 h-6" />
              Agendar promoción por WhatsApp
            </a>
            <a
              href="#dinamicas-mundialistas"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('dinamicas-mundialistas')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-8 py-4 border-2 border-amber-400 text-amber-400 font-extrabold rounded-full hover:bg-amber-400 hover:text-slate-900 transition-all duration-300"
            >
              Ver dinámicas mundialistas
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default MundialSection;
