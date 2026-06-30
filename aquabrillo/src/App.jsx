import { useState, useEffect } from 'react';
import {
  Phone, MapPin, Instagram, Facebook, ChevronRight,
  Shield, Sparkles, Clock, Home, Award, Droplets,
  CheckCircle2, ArrowRight, Star, Quote, Car,
  Paintbrush, Gem, Zap, MessageCircle, LocateFixed
} from 'lucide-react';
import Navbar from './components/layout/Navbar';
import AdminPanelPage from './components/AdminPanelPage';
import BookingMvp from './components/BookingMvp';
import PreferencesForm from './components/PreferencesForm';
import MundialSection from './components/MundialSection';
import ScrollReveal from './components/ui/ScrollReveal';
import { saveCoverageContext } from './config/booking';
import { getWhatsAppLink, IMAGES, SOCIAL_LINKS, WHATSAPP_CAMPAIGNS } from './config/site';

const WHATSAPP_LINK = getWhatsAppLink;

const getDistanceKm = (origin, destination) => {
  const earthRadiusKm = 6371;
  const toRadians = (value) => (value * Math.PI) / 180;
  const deltaLat = toRadians(destination.lat - origin.lat);
  const deltaLng = toRadians(destination.lng - origin.lng);
  const lat1 = toRadians(origin.lat);
  const lat2 = toRadians(destination.lat);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
};

const COVERAGE_BASE = {
  name: 'Santa Fe Life Style',
  shortName: 'Santa Fe Life Style',
  postalCode: '62793',
  address: 'Santa Fe Life Style, 62793 Santa Fe, Morelos',
  lat: 18.746252663889244,
  lng: -99.2357657057617,
  priorityRadiusKm: 5,
  mainRadiusKm: 10,
  extendedRadiusKm: 15,
  consultRadiusKm: 20,
  mapsUrl: 'https://maps.app.goo.gl/w6oiZJE98n3tHcZA7',
};

// ============================================================
// COMPONENTES DEL SITIO
// ============================================================

const Hero = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="inicio" className="relative min-h-[100svh] overflow-hidden bg-brand-night">
      <div className="absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-80 w-80 rounded-full bg-brand-orange/12 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-brand-rust/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(40,40,40,0.88)_100%)]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-5 pb-14 pt-28 text-center sm:px-6 sm:pt-32 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12 lg:px-8 lg:pb-20 lg:pt-36 lg:text-left">
        <div>
        <ScrollReveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-brand-orange" />
            <span className="text-sm font-medium text-slate-300">Lavado y Detallado a Domicilio</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="mb-6 text-4xl font-bold leading-[0.94] tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
            Tu auto <br />
            <span className="bg-gradient-to-r from-brand-orange via-orange-200 to-brand-rust bg-clip-text text-transparent">
              impecable
            </span>
            <br />
            <span className="text-2xl font-light text-slate-400 sm:text-4xl md:text-5xl xl:text-6xl">
              sin salir de casa
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0">
            Protección, brillo y detalle profesional para quienes valoran 
            la excelencia. Servicio premium a domicilio en Santa Fe Lifestyle 
            y alrededores de Xochitepec.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start">
            <a
              href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.carService)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 rounded-full bg-[#25D366] px-7 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#1EBE5D] hover:shadow-2xl hover:shadow-[#25D366]/25 sm:text-lg"
            >
              <MessageCircle className="h-5 w-5" />
              Cotizar por WhatsApp
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              onClick={() => document.querySelector('#servicios')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 font-medium text-white transition-all duration-300 hover:bg-white/5"
            >
              Ver servicios
            </button>
          </div>
        </ScrollReveal>
        </div>

        <ScrollReveal delay={400} className="w-full">
          <div className="relative">
            <div className="relative mx-auto h-[280px] w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#242424] shadow-2xl shadow-brand-orange/10 group sm:h-[360px] lg:h-[560px] xl:h-[620px]">
              {!imgError ? (
                <img 
                  src={IMAGES.hero} 
                  alt="Auto premium con acabado de espejo y reflejos cinematográficos"
                  className="h-full w-full object-cover object-center"
                  fetchPriority="high"
                  decoding="async"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
                  <div className="text-center">
                    <Car className="w-20 h-20 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm font-medium">Agrega tu imagen en:</p>
                    <p className="text-brand-orange text-xs mt-2 font-mono">public/images/hero/hero-car.jpg</p>
                    <p className="text-slate-600 text-xs mt-2">Recomendado: Auto oscuro, fondo negro, reflejos</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-night via-transparent to-transparent opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-night/35 via-transparent to-brand-night/35" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 sm:bottom-5 sm:left-5 sm:right-auto sm:w-[24rem]">
              {[
                ['Premium', 'Productos'],
                ['Domicilio', 'Servicio'],
                ['Brillo', 'Final']
              ].map(([value, label]) => (
                <div key={value} className="rounded-2xl border border-white/10 bg-slate-950/55 px-3 py-2 text-center backdrop-blur-xl">
                  <div className="text-sm font-black text-white">{value}</div>
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-brand-orange/70">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
const Credibility = () => {
  const items = [
    { icon: Home, label: "Atención a Domicilio", desc: "Vamos donde estés" },
    { icon: Gem, label: "Productos Premium", desc: "Calidad profesional" },
    { icon: Award, label: "Servicio de Alto Nivel", desc: "Estándares exigentes" },
    { icon: Shield, label: "Cuidado Detallado", desc: "Cada milímetro importa" },
    { icon: Clock, label: "Atención Personalizada", desc: "Horario flexible" },
    { icon: Sparkles, label: "Resultados Visibles", desc: "Diferencia real" },
  ];

  return (
    <section className="py-20 bg-slate-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {items.map((item, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition-all duration-300">
                  <item.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{item.label}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    {
      icon: Droplets,
      title: "Lavado Premium a Domicilio",
      desc: "Limpieza profunda exterior con técnicas profesionales y productos de alta gama que respetan la pintura de tu vehículo.",
      benefit: "Brillo intenso sin rayar",
      tag: "Más solicitado",
      price: "Cotizar",
      image: IMAGES.servicios.lavado,
      imageAlt: "Proceso de lavado premium con espuma y microfibra"
    },
    {
      icon: Car,
      title: "Detallado Interior Premium",
      desc: "Restauración completa del habitáculo. Limpieza de tapicería, paneles, alfombras y tratamiento de olores.",
      benefit: "Interior como nuevo",
      tag: "Premium",
      price: "Desde $650",
      image: IMAGES.servicios.interior,
      imageAlt: "Interior de auto con tapicería de cuero limpia y brillante"
    },
    {
      icon: Paintbrush,
      title: "Detallado Exterior",
      desc: "Limpieza de llantas, salpicaderas, motor superficial y tratamiento de superficies exteriores con acabado profesional.",
      benefit: "Presentación impecable",
      tag: "Popular",
      price: "Desde $650",
      image: IMAGES.servicios.exterior,
      imageAlt: "Auto con llantas brillantes y carrocería impecable"
    },
    {
      icon: Zap,
      title: "Pulido & Corrección",
      desc: "Eliminación de swirl marks, hologramas y micro-rayones. Recuperación del brillo original de la pintura.",
      benefit: "Pintura restaurada",
      tag: "Especializado",
      price: "Desde $1,200",
      image: IMAGES.servicios.pulido,
      imageAlt: "Proceso de pulido con máquina rotativa sobre pintura"
    },
    {
      icon: Shield,
      title: "Recubrimiento Cerámico",
      desc: "Protección de larga duración con acabado de espejo. Repelencia al agua, UV y contaminantes ambientales.",
      benefit: "Protección 12-24 meses",
      tag: "Flagship",
      price: "Desde $2,500",
      image: IMAGES.servicios.ceramico,
      imageAlt: "Capó de auto con gotas de agua repelidas por cerámico"
    },
    {
      icon: Gem,
      title: "Paquetes Especiales",
      desc: "Combinaciones personalizadas de servicios para autos premium, clásicos o para ocasiones especiales.",
      benefit: "Solución integral",
      tag: "Personalizado",
      price: "Cotizar",
      image: IMAGES.servicios.paquetes,
      imageAlt: "Auto premium completamente detallado en entrada residencial"
    }
  ];

  return (
    <section id="servicios" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">Nuestros Servicios</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Cada detalle, <span className="text-slate-400">una obra de arte</span></h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Servicios diseñados para quienes entienden que un auto impecable
              es una extensión de su estilo de vida.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard = ({ service, index }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <ScrollReveal delay={index * 100}>
      <div className="group relative rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-500 h-full flex flex-col overflow-hidden">
        
        <div className="relative h-48 overflow-hidden bg-slate-900">
          {!imgError ? (
            <img 
              src={service.image} 
              alt={service.imageAlt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <service.icon className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-600 text-xs font-mono">{service.image.split('/').pop()}</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
          
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium backdrop-blur-sm">
              {service.tag}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">{service.desc}</p>
          
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">{service.benefit}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-lg font-bold text-white">{service.price}</span>
            <a
              href={WHATSAPP_LINK(`Hola, me interesa cotizar: ${service.title}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Cotizar <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Ahorra Tiempo",
      desc: "No pierdas horas en un autolavado. Nosotros vamos a tu domicilio y trabajamos mientras tú sigues con tu día."
    },
    {
      icon: Home,
      title: "Servicio a Domicilio",
      desc: "Atención en Santa Fe Lifestyle, Xochitepec y zonas aledañas. Tu comodidad es nuestra prioridad."
    },
    {
      icon: Award,
      title: "Atención Cuidadosa",
      desc: "Cada vehículo recibe tratamiento personalizado según su estado, tipo de pintura y necesidades específicas."
    },
    {
      icon: Sparkles,
      title: "Imagen Impecable",
      desc: "Un auto limpio y brillante eleva tu presencia profesional y personal en cada llegada."
    },
    {
      icon: Shield,
      title: "Protección Estética",
      desc: "Nuestros tratamientos protegen la pintura y el interior, preservando el valor de tu inversión."
    },
    {
      icon: Car,
      title: "Experiencia Superior",
      desc: "Conducir un auto detallado profesionalmente transforma cada trayecto en una experiencia placentera."
    }
  ];

  return (
    <section id="beneficios" className="py-24 bg-slate-900/50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">¿Por qué elegirnos?</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Más que un lavado, <span className="text-slate-400">una experiencia</span></h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="flex gap-5 p-6 rounded-xl hover:bg-white/5 transition-colors duration-300">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================
// CARRUSEL DE RESULTADOS - ANTES Y DESPUES PREMIUM
// ============================================================

const ResultsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const [showAfter, setShowAfter] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const trabajos = [
    {
      id: 1,
      servicio: "Limpieza completa interior",
      /*vehiculo: "BMW X5 2023",*/
      /*cliente: "Carlos M.",*/
      descripcion: "Limpieza completa de tapicería de cuero, limpieza profunda de paneles.",
      before: "/images/resultados/interior-before.jpg",
      after: "/images/resultados/interior-after.jpg",
      beforeAlt: "Interior BMW X5 antes: asientos de cuero opacos, paneles con polvo, alfombras sucias",
      afterAlt: "Interior BMW X5 después: cuero hidratado y brillante, paneles impecables, olor fresco",
      duracion: "2 hrs",
      productos: ["APC"],
      rating: 5,
      testimonio: "El interior de mi camioneta quedo muy limpio."
    },
    {
      id: 2,
      servicio: "Corrección de Pintura + Cerámico",
      /*vehiculo: "Mercedes-Benz C-Class",
      cliente: "Mariana R.",*/
      descripcion: "Eliminación de swirl marks y hologramas en pintura, pulido y aplicación de cerámico.",
      before: "/images/resultados/pintura-before.jpg",
      after: "/images/resultados/pintura-after.jpg",
      beforeAlt: "Pintura Mercedes antes: swirl marks visibles bajo luz, opacidad en capó",
      afterAlt: "Pintura Mercedes después: brillo de espejo, profundidad de color, reflejos perfectos",
      duracion: "6 hrs",
      productos: [ "Polish", "Ceramic Coating"],
      rating: 5,
      testimonio: "El brillo es espectacular."
    },
    {
      id: 3,
      servicio: "Recubrimiento Cerámico",
      /*vehiculo: "Passat",
      cliente: "Alejandro G.",*/
      descripcion: "Aplicación de recubrimiento cerámico profesional en carrocería completa, vidrios y llantas. Efecto hidrofóbico activo.",
      before: "/images/resultados/ceramico-before.jpeg",
      after: "/images/resultados/ceramico-after.jpg",
      beforeAlt: "Passat antes: suciedad adherida a la pintura",
      afterAlt: "Passat después: Brillo en superficie, pintura protegida",
      duracion: "6 hrs",
      productos: ["Ceramic Coating Meguiars", "Shampoo APC", "Caly Bar"],
      rating: 5,
      testimonio: "El brillo es mucho más profundo y el acabado se ve como nuevo, sobre todo siendo un auto color negro."
    },
    {
      id: 4,
      servicio: "Lavado Premium + Detallado Exterior",
      /*vehiculo: "Porsche 911",
      cliente: "Roberto S.",*/
      descripcion: "Lavado de carrocería con cera, limpieza de llantas y rines, limpieza de acabados cromados.",
      before: "/images/resultados/exterior-before.jpg",
      after: "/images/resultados/exterior-after.jpg",
      beforeAlt: "Porsche 911 antes: contaminación en pintura, llantas con polvo de frenos opacas",
      afterAlt: "Porsche 911 después: pintura lisa como vidrio, llantas negras brillantes, cromos reflejantes",
      duracion: "3 hrs",
      productos: ["Cera", "Shampoo APC", "Carnauba"],
      rating: 5,
      testimonio: "El nivel de detalle es impresionante. Hasta las llantas parecen nuevas."
    },
    {
      id: 5,
      servicio: "Lavado completo premium",
      /*vehiculo: "Honda CR-V 2020",
      cliente: "Agencia Seminuevos",*/
      descripcion: "Servicio completo: interior, exterior.",
      before: "/images/resultados/previa-before.jpg",
      after: "/images/resultados/previa-after.jpg",
      beforeAlt: "Honda CR-V antes: interior desgastado, pintura opaca, faros amarillentos",
      afterAlt: "Honda CR-V después: interior revitalizado, pintura con brillo comercial, faros transparentes",
      duracion: "5 hrs",
      productos: ["Shampoo APC", "Abrillantador de llantas", "Spray Wax"],
      rating: 5,
      testimonio: "El auto quedo super limpio."
    },
    /*{
      id: 6,
      servicio: "Paquetes Especiales",
      vehiculo: "Passat",
      cliente: "Brillo",
      descripcion: "Combinación personalizada de servicios.",
      before: "/images/resultados/express-before.jpg",
      after: "/images/resultados/express-after.jpg",
      beforeAlt: "Tesla Model 3 antes: huellas dactilares en pantalla, polvo en superficies, marcas de agua",
      afterAlt: "Tesla Model 3 después: interior impecable, pantalla sin huellas, exterior brillante listo para exhibición",
      duracion: "45 min",
      productos: ["Quick Detailer", "Glass Cleaner", "Interior Dressing"],
      rating: 5,
      testimonio: "Puntualidad y calidad excepcional. Los autos quedaron listos justo a tiempo para el evento."
    }*/
  ];

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) goNext();
    if (isRightSwipe) goPrev();
  };

  const goNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('next');
    setShowAfter(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % trabajos.length);
      setIsAnimating(false);
    }, 300);
  };

  const goPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection('prev');
    setShowAfter(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + trabajos.length) % trabajos.length);
      setIsAnimating(false);
    }, 300);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setDirection(index > currentIndex ? 'next' : 'prev');
    setShowAfter(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  const toggleBeforeAfter = () => {
    setShowAfter(!showAfter);
  };

  const trabajo = trabajos[currentIndex];

  return (
    <section id="resultados" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="mb-4 block text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Galería de Resultados
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Transformaciones <span className="text-slate-400">reales</span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg">
              Cada vehículo cuenta una historia. Estos son los resultados que 
              nuestros clientes experimentan.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div 
            className="relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative bg-slate-900/50 rounded-3xl border border-white/10 overflow-hidden">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-white/10 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                      {trabajo.servicio}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(trabajo.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <p className="text-slate-500 text-xs">Duración</p>
                    <p className="text-white font-semibold text-sm">{trabajo.duracion}</p>
                  </div>
                  <button
                    onClick={toggleBeforeAfter}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all duration-300"
                  >
                    {showAfter ? (
                      <>
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Ver Antes
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Ver Después
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-slate-800">
                <div className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isAnimating 
                    ? direction === 'next' 
                      ? '-translate-x-full opacity-0' 
                      : 'translate-x-full opacity-0'
                    : 'translate-x-0 opacity-100'
                }`}>
                  <div className={`absolute inset-0 transition-opacity duration-500 ${showAfter ? 'opacity-0' : 'opacity-100'}`}>
                    <img 
                      src={trabajo.before} 
                      alt={trabajo.beforeAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 960px, 100vw"
                    />
                    <div className="absolute top-4 left-4 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full backdrop-blur-sm">
                      <span className="text-red-400 font-bold text-sm uppercase tracking-wider">Antes</span>
                    </div>
                  </div>
                  
                  <div className={`absolute inset-0 transition-opacity duration-500 ${showAfter ? 'opacity-100' : 'opacity-0'}`}>
                    <img 
                      src={trabajo.after} 
                      alt={trabajo.afterAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      sizes="(min-width: 1024px) 960px, 100vw"
                    />
                    <div className="absolute top-4 right-4 px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full backdrop-blur-sm">
                      <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider">Después</span>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40" />
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{trabajo.descripcion}</p>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-500 text-xs">Productos:</span>
                      {trabajo.productos.map((prod, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 rounded text-xs text-slate-400 border border-white/5">
                          {prod}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                    <Quote className="w-6 h-6 text-cyan-500/20 mb-2" />
                    <p className="text-slate-300 text-sm italic mb-2">"{trabajo.testimonio}"</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={goPrev}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300"
                      disabled={isAnimating}
                      aria-label="Ver resultado anterior"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                    </button>
                    <button
                      onClick={goNext}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300"
                      disabled={isAnimating}
                      aria-label="Ver siguiente resultado"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {trabajos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Ver resultado ${index + 1}`}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentIndex 
                            ? 'w-8 h-2 bg-cyan-400' 
                            : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-slate-500 text-sm font-mono">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(trabajos.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={goPrev}
              className="hidden lg:flex absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900 border border-white/10 items-center justify-center text-white hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300 shadow-2xl"
              aria-label="Ver resultado anterior"
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            <button
              onClick={goNext}
              className="hidden lg:flex absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-slate-900 border border-white/10 items-center justify-center text-white hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all duration-300 shadow-2xl"
              aria-label="Ver siguiente resultado"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="mt-8 grid grid-cols-3 md:grid-cols-6 gap-3">
            {trabajos.map((t, index) => (
              <button
                key={t.id}
                onClick={() => goToSlide(index)}
                aria-label={`Ver resultado de ${t.servicio}`}
                className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  index === currentIndex 
                    ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' 
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                <img 
                  src={t.after} 
                  alt={t.servicio}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 768px) 16vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute bottom-1 left-2 right-2">
                  <p className="text-white text-[10px] font-medium truncate">{t.servicio}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-4">
              ¿Quieres que tu auto sea nuestro próximo caso de éxito?
            </p>
            <a
              href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.results)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-green-500/25 hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5" />
              Quiero resultados como estos
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const CeramicCoating = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.08)_0%,_transparent_50%)]" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal>
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <Gem className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-400 font-medium">Servicio Flagship</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Recubrimiento <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Cerámico Premium
                </span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                La protección definitiva para la pintura de tu vehículo. Una capa invisible 
                que transforma la superficie en un escudo repelente con brillo de espejo 
                que dura meses.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { icon: Shield, text: "Protección contra rayos UV y oxidación" },
                  { icon: Droplets, text: "Repelencia extrema al agua y suciedad" },
                  { icon: Sparkles, text: "Brillo profundo tipo espejo" },
                  { icon: Clock, text: "Durabilidad de 12 a 24 meses" },
                  { icon: Zap, text: "Facilidad de limpieza diaria" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="text-slate-300">{feature.text}</span>
                  </div>
                ))}
              </div>

              <a
                href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.ceramic)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-green-500/25 hover:scale-105 transition-all duration-300"
              >
                <Gem className="w-5 h-5" />
                Solicitar evaluación gratuita
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 bg-slate-800 shadow-2xl shadow-cyan-500/10">
                {!imgError ? (
                  <img 
                    src={IMAGES.ceramico} 
                    alt="Capó negro con recubrimiento cerámico mostrando efecto hidrofóbico"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Shield className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 text-sm">Agrega tu imagen en:</p>
                      <p className="text-cyan-400 text-xs mt-1 font-mono">public/images/ceramico/coating-close.jpg</p>
                      <p className="text-slate-600 text-xs mt-2">Close-up gotas repelidas en capó</p>
                    </div>
                  </div>
                )}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-cyan-500/20 via-transparent to-blue-500/20 opacity-50" />
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Hidrofóbico</p>
                    <p className="text-slate-400 text-xs">Efecto loto activo</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      icon: MessageCircle,
      title: "Escríbenos por WhatsApp",
      desc: "Cuéntanos sobre tu vehículo y el servicio que necesitas. Responderemos en minutos."
    },
    {
      num: "02",
      icon: Car,
      title: "Evaluamos tu Vehículo",
      desc: "Agendamos una visita para evaluar el estado actual y definir el tratamiento ideal."
    },
    {
      num: "03",
      icon: Sparkles,
      title: "Recomendamos el Servicio",
      desc: "Te proponemos la solución perfecta según tus necesidades y presupuesto."
    },
    {
      num: "04",
      icon: Home,
      title: "Vamos a tu Domicilio",
      desc: "Llegamos a tu ubicación y transformamos tu auto en el lugar."
    }
  ];

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">Proceso Simple</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Así de <span className="text-slate-400">fácil</span></h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg">
              Cuatro pasos para transformar tu vehículo sin complicaciones.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <ScrollReveal key={index} delay={index * 150}>
              <div className="relative text-center group">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                  <step.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <div className="absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-500/20 to-transparent hidden lg:block" style={{ width: index < 3 ? '100%' : '0' }} />
                <span className="text-5xl font-bold text-white/5 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  {step.num}
                </span>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const CoverageMap = () => {
  const [activeZone, setActiveZone] = useState("santa-fe");
  const [coverageArea, setCoverageArea] = useState("");
  const [userDistanceKm, setUserDistanceKm] = useState(null);
  const [locationStatus, setLocationStatus] = useState('idle');

  const serviceBase = COVERAGE_BASE;

  const zonas = [
    {
      id: "santa-fe",
      nombre: "Santa Fe Life Style y alrededores",
      label: "Santa Fe Life Style y alrededores",
      tipo: "Principal",
      descripcion: "Zona base y cobertura prioritaria de 0 a 5 km.",
      disponibilidad: "0-5 km",
      badge: "Prioritaria",
     /* tiempo: "30-45 min",*/
      coordenadas: { cx: 280, cy: 180, r: 35 },
      mobilePosition: { left: "58%", top: "45%" },
      color: "#06b6d4",
      glowColor: "rgba(6, 182, 212, 0.4)",
      icon: Home
    },
    {
      id: "xochitepec-centro",
      nombre: "Xochitepec Centro",
      label: "Xochitepec Centro",
      tipo: "Principal",
      descripcion: "Cobertura principal de 5 a 10 km sujeta a agenda.",
      disponibilidad: "5-10 km",
      badge: "Principal",
      /* tiempo: "10-15 min", */
      coordenadas: { cx: 220, cy: 220, r: 30 },
      mobilePosition: { left: "43%", top: "56%" },
      color: "#3b82f6",
      glowColor: "rgba(59, 130, 246, 0.4)",
      icon: MapPin
    },
    {
      id: "Zona habitacional",
      nombre: "Alpuyeca",
      label: "Alpuyeca",
      tipo: "Urbana",
      descripcion: "Cobertura extendida de 10 a 15 km con confirmación de ruta.",
      disponibilidad: "10-15 km",
      badge: "Extendida",
      /* tiempo: "15-25 min", */
      coordenadas: { cx: 320, cy: 140, r: 25 },
      mobilePosition: { left: "67%", top: "29%" },
      color: "#8b5cf6",
      glowColor: "rgba(139, 92, 246, 0.3)",
      icon: Home
    },
    {
      id: "benito-juarez",
      label: "Col. Benito Juarez",
      nombre: "Col. Benito Juárez",
      tipo: "Urbana",
      descripcion: "Cobertura principal o extendida según ubicación exacta.",
      disponibilidad: "5-15 km",
      badge: "Ruta",
      /* tiempo: "10-20 min", */
      coordenadas: { cx: 180, cy: 200, r: 22 },
      mobilePosition: { left: "31%", top: "50%" },
      color: "#10b981",
      glowColor: "rgba(16, 185, 129, 0.3)",
      icon: MapPin
    },
    {
      id: "jardines",
      nombre: "Fracc. Jardines",
      label: "Fracc. Jardines",
      tipo: "Residencial",
      descripcion: "Residencial con acceso controlado; confirmar caseta y horario.",
      disponibilidad: "Confirmar",
      badge: "Residencial",
      /* tiempo: "20-30 min", */
      coordenadas: { cx: 340, cy: 240, r: 25 },
      mobilePosition: { left: "72%", top: "63%" },
      color: "#f59e0b",
      glowColor: "rgba(245, 158, 11, 0.3)",
      icon: Home
    },
    {
      id: "CuernDistribuidores y zonas aledañas",
      nombre: "Cuernavaca",
      label: "Cuernavaca",
      tipo: "Expansión",
      descripcion: "Cuernavaca se atiende como ruta programada o servicio especial.",
      disponibilidad: "Programada",
      badge: "Expansion",
      /* tiempo: "Consultar", */
      coordenadas: { cx: 200, cy: 280, r: 28 },
      mobilePosition: { left: "38%", top: "75%" },
      color: "#64748b",
      glowColor: "rgba(100, 116, 139, 0.3)",
      icon: Clock
    }
  ];

  const rutasPrincipales = [
    { nombre: "Autopista México-Cuernavaca", path: "M 50,150 Q 200,120 450,180" },
    { nombre: "Carretera Federal 95D", path: "M 80,200 Q 250,180 420,220" },
    { nombre: "Acceso Santa Fe Life Style", path: "M 250,100 Q 280,140 280,180" }
  ];

  const referenciasLimpias = [
    { icon: "CP", text: "Código postal base 62793" },
    { icon: "5", text: "Cobertura prioritaria hasta 5 km" },
    { icon: "15", text: "Cobertura extendida hasta 15 km" },
    { icon: "CV", text: "Cuernavaca bajo ruta programada" }
  ];

  const zonaActiva = zonas.find(z => z.id === activeZone);
  const coverageResult = (() => {
    if (userDistanceKm === null) {
      return {
        label: 'Verifica cobertura',
        description: 'Usa tu ubicación o escribe tu colonia para confirmar la zona de servicio.',
        color: 'text-cyan-100',
        tier: 'Sin validar',
      };
    }

    if (userDistanceKm <= serviceBase.priorityRadiusKm) {
      return {
        label: 'Cobertura prioritaria',
        description: `Estás aprox. a ${userDistanceKm.toFixed(1)} km de ${serviceBase.shortName}.`,
        color: 'text-emerald-300',
        tier: '0-5 km',
      };
    }

    if (userDistanceKm <= serviceBase.mainRadiusKm) {
      return {
        label: 'Cobertura principal',
        description: `Estás aprox. a ${userDistanceKm.toFixed(1)} km. Servicio sujeto a agenda disponible.`,
        color: 'text-cyan-200',
        tier: '5-10 km',
      };
    }

    if (userDistanceKm <= serviceBase.extendedRadiusKm) {
      return {
        label: 'Cobertura extendida',
        description: `Estás aprox. a ${userDistanceKm.toFixed(1)} km. Confirmamos ruta y horario por WhatsApp.`,
        color: 'text-amber-200',
        tier: '10-15 km',
      };
    }

    if (userDistanceKm <= serviceBase.consultRadiusKm) {
      return {
        label: 'Zona bajo consulta',
        description: `Estás aprox. a ${userDistanceKm.toFixed(1)} km. Revisamos disponibilidad especial.`,
        color: 'text-orange-200',
        tier: '15-20 km',
      };
    }

    return {
      label: 'Fuera de zona principal',
      description: `Estás aprox. a ${userDistanceKm.toFixed(1)} km. Podemos revisar servicio programado.`,
      color: 'text-slate-300',
      tier: '+20 km',
    };
  })();
  const coverageWhatsAppMessage = coverageArea.trim()
    ? `Hola, vivo en ${coverageArea.trim()}. ¿Tienen cobertura para un servicio AQUABRILLO cerca de ${serviceBase.shortName}, CP ${serviceBase.postalCode}?`
    : userDistanceKm !== null
      ? `Hola, quiero confirmar cobertura AQUABRILLO. ${coverageResult.label} (${coverageResult.tier}). Estoy aproximadamente a ${userDistanceKm.toFixed(1)} km de ${serviceBase.shortName}, CP ${serviceBase.postalCode}.`
    : WHATSAPP_CAMPAIGNS.coverage;

  const persistCoverageContext = (overrides = {}) => saveCoverageContext({
    area: coverageArea.trim(),
    baseName: serviceBase.shortName,
    postalCode: serviceBase.postalCode,
    status: coverageResult.label,
    tier: coverageResult.tier,
    distanceKm: userDistanceKm,
    activeZone: zonaActiva?.label || zonaActiva?.nombre || '',
    ...overrides,
  });

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unsupported');
      return;
    }

    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const distance = getDistanceKm(
          { lat: serviceBase.lat, lng: serviceBase.lng },
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
        );
        setUserDistanceKm(distance);
        setLocationStatus('ready');
        const nextResult = (() => {
          if (distance <= serviceBase.priorityRadiusKm) return { label: 'Cobertura prioritaria', tier: '0-5 km' };
          if (distance <= serviceBase.mainRadiusKm) return { label: 'Cobertura principal', tier: '5-10 km' };
          if (distance <= serviceBase.extendedRadiusKm) return { label: 'Cobertura extendida', tier: '10-15 km' };
          if (distance <= serviceBase.consultRadiusKm) return { label: 'Zona bajo consulta', tier: '15-20 km' };
          return { label: 'Fuera de zona principal', tier: '+20 km' };
        })();
        persistCoverageContext({
          status: nextResult.label,
          tier: nextResult.tier,
          distanceKm: distance,
        });
      },
      () => setLocationStatus('error'),
      {
        enableHighAccuracy: true,
        maximumAge: 60000,
        timeout: 10000,
      }
    );
  };

  return (
    <section id="cobertura" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="mb-4 block text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Radar de Cobertura
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Cobertura desde <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Santa Fe, CP 62793
              </span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              Verifica si estás dentro del radio principal de servicio y confirma disponibilidad por WhatsApp.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 lg:grid-cols-5 lg:gap-8 lg:items-start">
          <ScrollReveal className="hidden lg:order-1 lg:col-span-3 lg:block">
            <div className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-slate-900/55 p-3 shadow-2xl shadow-cyan-950/20 sm:p-6">
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Mapa de referencia
                </h3>
                <span className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                  Xochitepec, Morelos
                </span>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                <div>
                <svg 
                  viewBox="0 0 500 400" 
                  className="aspect-[4/3] h-auto w-full"
                  style={{ filter: "drop-shadow(0 0 30px rgba(6,182,212,0.1))" }}
                >
                  <defs>
                    <radialGradient id="glow-cyan" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(6,182,212,0.3)" />
                      <stop offset="100%" stopColor="rgba(6,182,212,0)" />
                    </radialGradient>
                    <filter id="pulse">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <path 
                    d="M 80,80 Q 150,60 250,70 Q 350,50 420,90 Q 460,150 450,220 Q 440,300 380,340 Q 300,370 200,360 Q 100,350 60,280 Q 40,200 60,140 Q 70,100 80,80 Z" 
                    fill="rgba(15, 23, 42, 0.6)" 
                    stroke="rgba(6, 182, 212, 0.2)" 
                    strokeWidth="1"
                  />

                  {rutasPrincipales.map((ruta, i) => (
                    <g key={i}>
                      <path 
                        d={ruta.path} 
                        fill="none" 
                        stroke="rgba(100, 116, 139, 0.3)" 
                        strokeWidth="2" 
                        strokeDasharray="8,4"
                      />
                      <path 
                        d={ruta.path} 
                        fill="none" 
                        stroke="rgba(6, 182, 212, 0.15)" 
                        strokeWidth="4"
                      />
                    </g>
                  ))}

                  <text x="200" y="115" fill="rgba(148, 163, 184, 0.5)" fontSize="8" fontFamily="Inter">
                    Autopista México-Cuernavaca
                  </text>
                  <text x="220" y="195" fill="rgba(148, 163, 184, 0.5)" fontSize="8" fontFamily="Inter">
                    Carretera 95D
                  </text>

                  {zonas.map((zona) => (
                    <g 
                      key={zona.id}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setActiveZone(zona.id)}
                      onClick={() => setActiveZone(zona.id)}
                      style={{ transformOrigin: `${zona.coordenadas.cx}px ${zona.coordenadas.cy}px` }}
                    >
                      <circle
                        cx={zona.coordenadas.cx}
                        cy={zona.coordenadas.cy}
                        r={zona.coordenadas.r * 1.8}
                        fill={zona.glowColor}
                        opacity={activeZone === zona.id ? 0.6 : 0.2}
                        className="transition-opacity duration-300"
                      />
                      
                      <circle
                        cx={zona.coordenadas.cx}
                        cy={zona.coordenadas.cy}
                        r={zona.coordenadas.r}
                        fill={activeZone === zona.id ? zona.color : "rgba(30, 41, 59, 0.8)"}
                        stroke={zona.color}
                        strokeWidth={activeZone === zona.id ? 3 : 1.5}
                        className="transition-all duration-300"
                        filter={activeZone === zona.id ? "url(#pulse)" : ""}
                      />
                      
                      <circle
                        cx={zona.coordenadas.cx}
                        cy={zona.coordenadas.cy}
                        r={6}
                        fill={zona.color}
                        className="transition-all duration-300"
                      />
                      
                      {zona.tipo === "Principal" && (
                        <>
                          <circle
                            cx={zona.coordenadas.cx}
                            cy={zona.coordenadas.cy}
                            r={zona.coordenadas.r}
                            fill="none"
                            stroke={zona.color}
                            strokeWidth={1}
                            opacity={0.5}
                          >
                            <animate
                              attributeName="r"
                              values={`${zona.coordenadas.r};${zona.coordenadas.r * 1.5};${zona.coordenadas.r}`}
                              dur="3s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.5;0;0.5"
                              dur="3s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        </>
                      )}

                      <text
                        x={zona.coordenadas.cx}
                        y={zona.coordenadas.cy + zona.coordenadas.r + 15}
                        textAnchor="middle"
                        fill={activeZone === zona.id ? "#fff" : "rgba(148, 163, 184, 0.7)"}
                        fontSize="9"
                        fontWeight={activeZone === zona.id ? "600" : "400"}
                        fontFamily="Inter"
                        className="transition-all duration-300"
                      >
                        {zona.label || zona.nombre}
                      </text>
                    </g>
                  ))}

                  <g transform="translate(280, 180)">
                    <circle r="4" fill="#ef4444">
                      <animate
                        attributeName="r"
                        values="4;8;4"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="1;0.3;1"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="2" fill="#ef4444" />
                  </g>
                </svg>
                </div>

                {zonaActiva && (
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-slate-900/95 p-4 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div 
                        className="flex h-9 w-9 flex-none items-center justify-center rounded-lg sm:h-10 sm:w-10"
                        style={{ backgroundColor: `${zonaActiva.color}20` }}
                      >
                        <zonaActiva.icon className="w-5 h-5" style={{ color: zonaActiva.color }} />
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h4 className="text-white font-bold text-sm">{zonaActiva.label || zonaActiva.nombre}</h4>
                        <p className="line-clamp-2 text-xs text-slate-400">{zonaActiva.descripcion}</p>
                      </div>
                      <div className="flex-none text-right">
                        <span className="text-xs text-slate-500 block">Estado</span>
                        <span className="text-cyan-400 font-bold text-sm">{zonaActiva.badge}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-slate-400">Cobertura principal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  <span className="text-slate-400">Residencial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-slate-400">Zona bajo consulta</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-8 h-0.5 bg-slate-600 border-dashed" style={{ borderTop: "1px dashed rgba(100,116,139,0.5)" }} />
                  <span className="text-slate-500">Ruta de acceso</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} className="order-1 lg:order-2 lg:col-span-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-cyan-300/15 bg-slate-900/70 p-4 shadow-2xl shadow-cyan-950/20 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-100/70">Zona base</p>
                    <h3 className="mt-1 text-lg font-black text-white">{serviceBase.shortName}</h3>
                    <p className="mt-1 text-xs text-slate-500">{serviceBase.address}</p>
                  </div>
                  <span className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                    5 / 10 / 15 km
                  </span>
                </div>

                <div className="relative mb-4 h-44 overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.18),_rgba(15,23,42,0.35)_38%,_rgba(15,23,42,0.92)_100%)] lg:hidden">
                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30 bg-cyan-300/5" />
                  <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/20" />
                  <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#25D366] shadow-[0_0_28px_rgba(37,211,102,0.45)]">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-slate-950/80 px-3 py-1 text-[0.68rem] font-bold text-white">
                    Santa Fe Life Style
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/55 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className={`text-sm font-black ${coverageResult.color}`}>{coverageResult.label}</p>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[0.65rem] font-bold text-slate-300">
                      {coverageResult.tier}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{coverageResult.description}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[0.68rem] font-bold text-slate-300">
                  {[
                    ['0-5 km', 'Prioritaria'],
                    ['5-10 km', 'Principal'],
                    ['10-15 km', 'Extendida'],
                    ['15-20 km', 'Consulta'],
                  ].map(([range, label]) => (
                    <div key={range} className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2">
                      <span className="block text-cyan-100">{range}</span>
                      <span className="text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={locationStatus === 'loading'}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-300/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LocateFixed className="h-5 w-5" />
                  {locationStatus === 'loading' ? 'Detectando ubicación...' : 'Usar mi ubicación'}
                </button>
                <a
                  href={serviceBase.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-cyan-300/20 hover:bg-cyan-300/10 hover:text-white"
                >
                  <MapPin className="h-4 w-4 text-cyan-200" />
                  Ver punto base en Maps
                </a>
                {locationStatus === 'error' && (
                  <p className="mt-3 text-xs font-bold text-amber-200">
                    No pudimos acceder a tu ubicación. Puedes escribir tu colonia abajo.
                  </p>
                )}
                {locationStatus === 'unsupported' && (
                  <p className="mt-3 text-xs font-bold text-amber-200">
                    Tu navegador no permite geolocalización. Escribe tu colonia para confirmar.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
                <h3 className="mb-4 flex items-center gap-2 text-white font-bold">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Zonas Cubiertas
                </h3>
                
                <div className="grid gap-3 sm:grid-cols-2 lg:block lg:space-y-3">
                  {zonas.map((zona) => (
                    <button
                      key={zona.id}
                      type="button"
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-xl p-3 text-left transition-all duration-300 ${
                        activeZone === zona.id 
                          ? 'bg-cyan-500/10 border border-cyan-500/25 shadow-lg shadow-cyan-950/20' 
                          : 'bg-white/5 border border-transparent hover:bg-white/[0.03]'
                      }`}
                      onMouseEnter={() => setActiveZone(zona.id)}
                      onClick={() => setActiveZone(zona.id)}
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: zona.color }}
                      />
                      <div className="flex-grow">
                        <p className="text-white text-sm font-medium">{zona.label || zona.nombre}</p>
                        <p className="text-slate-500 text-xs">{zona.tipo}</p>
                      </div>
                      <span className="max-w-[6.75rem] rounded-full border border-cyan-300/15 bg-cyan-300/10 px-2.5 py-1 text-center text-[0.62rem] font-bold leading-tight text-cyan-100">
                        {zona.disponibilidad}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {zonaActiva && (
                <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-4 lg:hidden">
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 flex-none items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${zonaActiva.color}20` }}
                    >
                      <zonaActiva.icon className="h-5 w-5" style={{ color: zonaActiva.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white">{zonaActiva.label || zonaActiva.nombre}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan-100/70">{zonaActiva.badge}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">{zonaActiva.descripcion}</p>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
                <h3 className="mb-4 text-sm font-bold text-white">Referencias de ruta</h3>
                <div className="space-y-3">
                  {referenciasLimpias.map((ref, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/15 bg-cyan-300/10 text-[0.62rem] font-black text-cyan-100">{ref.icon}</span>
                      <span className="text-slate-400 text-sm">{ref.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <label className="block rounded-2xl border border-cyan-300/15 bg-cyan-300/5 p-4">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-cyan-100">
                  Tu colonia o fraccionamiento
                </span>
                <input
                  type="text"
                  value={coverageArea}
                  onChange={(event) => {
                    const nextArea = event.target.value;
                    setCoverageArea(nextArea);
                    saveCoverageContext({
                      area: nextArea.trim(),
                      baseName: serviceBase.shortName,
                      postalCode: serviceBase.postalCode,
                      status: coverageResult.label,
                      tier: coverageResult.tier,
                      distanceKm: userDistanceKm,
                      activeZone: zonaActiva?.label || zonaActiva?.nombre || '',
                    });
                  }}
                  placeholder="Ej. Santa Fe, Xochitepec Centro, Alpuyeca"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/50"
                />
              </label>

              <a
                href={WHATSAPP_LINK(coverageWhatsAppMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => persistCoverageContext()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#1EBE5D] hover:shadow-lg hover:shadow-[#25D366]/25"
              >
                <MessageCircle className="w-5 h-5" />
                Verificar mi ubicación
              </a>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={300}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { valor: "62793", label: "Código postal base", icon: MapPin },
              { valor: "5 km", label: "Prioritaria", icon: Clock },
              { valor: "15 km", label: "Extendida", icon: Home },
              { valor: "20 km", label: "Bajo consulta", icon: Award }
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white mb-1">{stat.valor}</p>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

// ============================================================
// SECCION B2B - SERVICIOS PARA AGENCIAS Y EXPOSICIONES
// ============================================================

const B2BServices = () => {
  const [activeService, setActiveService] = useState(null);

  const serviciosB2B = [
    {
      id: "unidades-nuevas",
      icon: Sparkles,
      titulo: "Preparación de Unidades Nuevas",
      descripcion: "Limpieza profunda exterior e interior, descontaminación de pintura, aplicación de sellador cerámico o cera de alto brillo. Ideal para vehículos nuevos o de arribo a agencia.",
      precio: "$850",
      duracion: "2 hrs",
      frecuencia: "Por lote / entrega",
      color: "from-green-500 to-green-600",
      tag: "Más solicitado"
    },
    {
      id: "exhibicion",
      icon: Award,
      titulo: "Mantenimiento de Unidades de Exhibición",
      descripcion: "Limpieza exterior rápida, desempolvado interior, retoque de acabados plásticos y cromados. Conserva brillo y presentación en piso de venta diario.",
      precio: "$300",
      duracion: "45 min",
      frecuencia: "Semanal / diario",
      color: "from-emerald-500 to-teal-600",
      tag: "Recurrente"
    },
    {
      id: "pre-venta",
      icon: Car,
      titulo: "Detallado Pre-Venta (Seminuevos/Demo)",
      descripcion: "Lavado detallado, pulido de pintura, restauración de faros, limpieza profunda de tapicería. Mejora la percepción y valor del vehículo.",
      precio: "$1,400",
      duracion: "3 hrs",
      frecuencia: "Según rotación",
      color: "from-violet-500 to-purple-600",
      tag: "Integral"
    },
    {
      id: "ceramico",
      icon: Shield,
      titulo: "Protección de Superficies Cerámica",
      descripcion: "Aplicación de recubrimientos cerámicos, selladores y protectores interiores (cuero, vinil, plásticos). Aumenta durabilidad de materiales y brillo.",
      precio: "$2,800",
      duracion: "4 hrs",
      frecuencia: "Anual / semestral",
      color: "from-amber-500 to-orange-600",
      tag: "Premium"
    },
    {
      id: "express-vip",
      icon: Zap,
      titulo: "Servicio Express VIP",
      descripcion: "Atención inmediata de autos de clientes o eventos, limpieza premium rápida. Ideal para entregas especiales, lanzamientos o eventos de agencia.",
      precio: "$450",
      duracion: "1 hr",
      frecuencia: "A solicitud",
      color: "from-rose-500 to-pink-600",
      tag: "Express"
    }
  ];

  const metodologia = [
    {
      num: "01",
      titulo: "Diagnóstico Inicial",
      desc: "Evaluación del estado de la unidad por nuestro especialista certificado."
    },
    {
      num: "02",
      titulo: "Selección de Tratamiento",
      desc: "Según tipo de superficie y objetivo: exhibición, entrega o reventa."
    },
    {
      num: "03",
      titulo: "Ejecución Profesional",
      desc: "Procedimientos controlados con productos y herramientas profesionales."
    },
    {
      num: "04",
      titulo: "Inspección Final",
      desc: "Validación visual y técnica por el especialista GT Detailing MX."
    },
    {
      num: "05",
      titulo: "Entrega con Garantía",
      desc: "Certificado de trabajo realizado y recomendaciones de mantenimiento."
    }
  ];

  const diferenciadores = [
    { icon: Shield, titulo: "Productos de Grado Profesional", desc: "Chemical Guys®, Meguiar's®, Sonax®, Turtle Wax Pro" },
    { icon: Award, titulo: "Personal Certificado", desc: "Protocolos de limpieza sin residuos ni micro-rayones" },
    { icon: Home, titulo: "Servicio Móvil", desc: "A domicilio o directo en tu agencia" },
    { icon: Clock, titulo: "Cumplimiento Garantizado", desc: "Tiempos de entrega estrictos y calidad visual" }
  ];

  const descuentosVolumen = [
    { unidades: "5+ por semana", descuento: "10%", color: "text-cyan-400" },
    { unidades: "20+ mensuales", descuento: "15%", color: "text-blue-400" },
    { unidades: "Contrato anual", descuento: "Preferencial", color: "text-emerald-400" }
  ];

  return (
    <section id="b2b" className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Award className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400 font-medium">Servicios Corporativos</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Soluciones para <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Agencias y Exposiciones
              </span>
            </h2>
            <p className="max-w-3xl mx-auto text-slate-400 text-lg">
              GT Detailing MX / AQUABRILLO es aliado estratégico de agencias automotrices 
              que buscan elevar la presentación y satisfacción del cliente final. 
              Servicios profesionales para piso de venta, entregas especiales y procesos de reventa.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                <Phone className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-bold">Contacto directo para agencias</p>
                <p className="text-slate-400 text-sm">Hugo Franco - Especialista en Detallado Automotriz</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.b2b)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Cotizar para agencia
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            Catálogo de Servicios Corporativos
          </h3>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {serviciosB2B.map((servicio, index) => (
            <ScrollReveal key={servicio.id} delay={index * 100}>
              <div 
                className={`group relative rounded-2xl bg-white/[0.02] border transition-all duration-500 h-full flex flex-col overflow-hidden ${
                  activeService === servicio.id 
                    ? 'border-cyan-500/40 bg-white/[0.04]' 
                    : 'border-white/10 hover:border-white/20'
                }`}
                onMouseEnter={() => setActiveService(servicio.id)}
                onMouseLeave={() => setActiveService(null)}
              >
                <div className={`h-2 bg-gradient-to-r ${servicio.color}`} />
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${servicio.color} bg-opacity-20 flex items-center justify-center`}>
                      <servicio.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      servicio.tag === "Más solicitado" 
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                        : "bg-white/5 text-slate-400 border border-white/10"
                    }`}>
                      {servicio.tag}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2">{servicio.titulo}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">{servicio.descripcion}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Precio unitario</span>
                      <span className="text-white font-bold text-lg">{servicio.precio} <span className="text-slate-500 text-xs font-normal">MXN</span></span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Duración</span>
                      <span className="text-slate-300">{servicio.duracion}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Frecuencia</span>
                      <span className="text-slate-300">{servicio.frecuencia}</span>
                    </div>
                  </div>

                  <a
                    href={WHATSAPP_LINK(`Hola, me interesa cotizar el servicio: ${servicio.titulo} para mi agencia.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:border-transparent transition-all duration-300"
                  >
                    Solicitar cotización
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-cyan-400" />
              Nuestra Metodología
            </h3>
            <div className="grid md:grid-cols-5 gap-4">
              {metodologia.map((paso, index) => (
                <ScrollReveal key={index} delay={index * 100}>
                  <div className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 h-full text-center group hover:border-cyan-500/30 transition-all duration-300">
                    <span className="text-4xl font-bold text-white/5 absolute top-2 right-4">
                      {paso.num}
                    </span>
                    <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                      <span className="text-cyan-400 font-bold text-sm">{paso.num}</span>
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-2">{paso.titulo}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">{paso.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">
              ¿Por qué elegirnos como aliado?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {diferenciadores.map((diff, index) => (
                <div key={index} className="text-center group">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <diff.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-2">{diff.titulo}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{diff.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-8 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Descuentos por Volumen</h3>
              <p className="text-slate-400">Mayor rotación, mejores precios</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {descuentosVolumen.map((desc, index) => (
                <div key={index} className="text-center p-6 rounded-xl bg-slate-950/50 border border-white/10">
                  <p className="text-slate-400 text-sm mb-2">A partir de</p>
                  <p className="text-white font-bold mb-3">{desc.unidades}</p>
                  <div className={`text-3xl font-bold ${desc.color} mb-2`}>{desc.descuento}</div>
                  <p className="text-slate-500 text-xs">de descuento</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="text-center">
            <div className="max-w-3xl mx-auto bg-white/[0.02] border border-white/10 rounded-3xl p-10">
              <h3 className="text-3xl font-bold text-white mb-4">
                Demostración sin costo
              </h3>
              <p className="text-slate-400 mb-8">
                Agenda una demostración gratuita en tu agencia y descubre por qué 
                las principales concesionarias confían en GT Detailing MX / AQUABRILLO 
                para la presentación de sus unidades.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.b2bDemo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-green-500/25 hover:scale-105 transition-all duration-300 text-lg"
                >
                  <Sparkles className="w-5 h-5" />
                  Agendar demostración gratuita
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Sin compromiso
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  En tu agencia
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Resultados visibles
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-16 grid md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Clock, label: "Horario", valor: "Martes a Sábado 8am-6pm" },
              { icon: Shield, label: "Garantía", valor: "15 días en cerámicos" },
              { icon: Phone, label: "Pago", valor: "Transferencia, efectivo, terminal" },
              { icon: Award, label: "Vigencia", valor: "Precio sujeto a cambio" }
            ].map((cond, i) => (
              <div key={i} className="p-4">
                <cond.icon className="w-5 h-5 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{cond.label}</p>
                <p className="text-white text-sm font-medium">{cond.valor}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Juan Manuel",
      role: "BYD King",
      text: "Increíble el nivel de detalle. El servicio a domicilio es un lujo que vale cada peso.",
      rating: 5
    },
    {
      name: "Ivonne B",
      role: "JEEP Renegade",
      text: "Profesionalismo absoluto. Llegaron puntual, trabajaron con cuidado y el resultado superó mis expectativas. Totalmente recomendable.",
      rating: 5
    },
    {
      name: "Luis Alonso",
      role: "MG ONE",
      text: "El recubrimiento cerámico cambió por completo la apariencia de mi auto. El brillo es espectacular y la protección se nota al instante.",
      rating: 5,
    },
    {
      name: "Anonimo",
      role: "VW Passat",
      text: "Satisfecho con el trabajo que realizaron en mi auto. El cambio en la pintura es impresionante, el brillo es más profundo, incluso siendo un auto color negro.",
      rating: 5,
    }
  ];

  return (
    <section id="testimonios" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">Testimonios</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Lo que dicen <span className="text-slate-400">nuestros clientes</span></h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <TestimonialCard key={index} item={item} index={index} />
          ))}
        </div>
        <ScrollReveal delay={250}>
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('aquabrillo:open-review-form'))}
              className="inline-flex items-center gap-3 rounded-full border border-brand-orange/25 bg-brand-orange/10 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-orange-100 transition hover:border-brand-orange/45 hover:bg-brand-orange/15"
            >
              <Quote className="h-4 w-4 text-brand-orange" />
              Dejar mi opinión
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const TestimonialCard = ({ item, index }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <ScrollReveal delay={index * 150}>
      <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/20 transition-all duration-300 h-full flex flex-col">
        <Quote className="w-10 h-10 text-cyan-500/20 mb-4" />
        <p className="text-slate-300 leading-relaxed mb-6 flex-grow italic">
          "{item.text}"
        </p>
        <div className="flex items-center gap-1 mb-4">
          {[...Array(item.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-cyan-400 text-cyan-400" />
          ))}
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-white/10">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center flex-shrink-0">
            <img 
              src={IMAGES.testimonios[`cliente${index + 1}`]} 
              alt={`Auto de ${item.name}`}
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
            />
            <span className={`text-white font-bold text-sm ${imgError ? '' : 'hidden'}`}>
              {item.name[0]}
            </span>
          </div>
          <div>
            <h4 className="text-white font-semibold">{item.name}</h4>
            <p className="text-slate-400 text-sm">{item.role}</p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const FinalCTA = () => {
  return (
    <section id="contacto" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.1)_0%,_transparent_60%)]" />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Tu auto merece <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              lo mejor
            </span>
          </h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Agenda hoy mismo y descubre por qué nuestros clientes no vuelven 
            a lavar su auto en ningún otro lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.evaluation)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-green-500/25 hover:scale-105 transition-all duration-300 text-lg"
            >
              <MessageCircle className="w-6 h-6" />
              Agendar evaluación gratuita
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <span className="text-sm">Sin compromiso</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <span className="text-sm">Cotización inmediata</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <span className="text-sm">Garantía de satisfacción</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src={IMAGES.logo} alt="AQUABRILLO" className="h-10 w-auto" loading="lazy" decoding="async" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              <div className="hidden w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                AQUABRILLO /<span className="text-cyan-400">GT DETAILING MX</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
              Lavado y detallado premium a domicilio. Transformamos tu vehículo 
              con la precisión y el cuidado que solo los verdaderos apasionados 
              entienden.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.generalService)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contactar a AQUABRILLO por WhatsApp"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all"
              >
                <Phone className="w-5 h-5 text-cyan-400" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir Instagram de AQUABRILLO"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all"
              >
                <Instagram className="w-5 h-5 text-cyan-400" />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir Facebook de GT Detailing MX"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all"
              >
                <Facebook className="w-5 h-5 text-cyan-400" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Servicios</h4>
            <ul className="space-y-3">
              {["Lavado Premium", "Detallado Interior", "Detallado Exterior", "Pulido", "Cerámico", "Paquetes"].map((item) => (
                <li key={item}>
                  <a href="#servicios" className="text-slate-400 hover:text-cyan-400 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-cyan-400" />
                777 388 7690
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Santa Fe Lifestyle, Xochitepec
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Instagram className="w-4 h-4 text-cyan-400" />
                @santafecarwashexpress
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Facebook className="w-4 h-4 text-cyan-400" />
                /gtdetailingmx
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 AQUABRILLO. Todos los derechos reservados.
          </p>
          <p className="text-slate-600 text-xs">
            Lavado y detallado premium a domicilio.
          </p>
          <a
            href="/admin"
            className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600 transition hover:text-brand-orange"
          >
            Panel operativo
          </a>
        </div>
      </div>
    </footer>
  );
};

const FloatingWhatsApp = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.generalQuote)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar servicio por WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-2xl shadow-green-500/30 hover:scale-105 transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
};

function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return <AdminPanelPage />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <PreferencesForm />
      <Hero />
      <MundialSection />
      <Credibility />
      <Services />
      <BookingMvp />
      <Benefits />
      <ResultsCarousel />
      <CeramicCoating />
      <HowItWorks />
      <CoverageMap />
      <B2BServices />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default App;
