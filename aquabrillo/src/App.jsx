import { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Phone, MapPin, Instagram, ChevronRight, 
  Shield, Sparkles, Clock, Home, Award, Droplets, 
  CheckCircle2, ArrowRight, Star, Quote, Car, 
  Paintbrush, Gem, Zap, MessageCircle
} from 'lucide-react';

const WHATSAPP_NUMBER = "7773887690";
const WHATSAPP_LINK = (text) => `https://wa.me/52${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
const INSTAGRAM_URL = "https://www.instagram.com/santafecarwashexpress?igsh=MW4ydm03c3Jxa2Jvbw==";

// ============================================================
// CONFIGURACIÓN DE IMÁGENES PROPIAS
// Instrucciones:
// 1. Crea la carpeta public/images/ en tu proyecto
// 2. Dentro de public/images/ crea las subcarpetas: hero, servicios, resultados, ceramico, cobertura, testimonios
// 3. Copia tus fotos con los nombres exactos de abajo
// 4. Las imágenes se cargan automáticamente desde /images/... (ruta relativa a public/)
// ============================================================

const IMAGES = {
  // HERO: Tu mejor foto de auto premium
  // Recomendación: Auto oscuro, fondo oscuro, reflejos de agua o luz dramática
  // Formato: JPG o PNG, preferiblemente 1920x1080 o mayor
  hero: "/hero/hero-car.jpg",
  
  // SERVICIOS: 6 fotos de tus trabajos reales
  servicios: {
    lavado: "/servicios/lavado.jpg",         // Espuma, microfibra, agua en acción
    interior: "/servicios/interior.jpg",     // Tapicería limpia, cuero brillante
    exterior: "/servicios/exterior.jpg",     // Llantas, carrocería, detalles
    pulido: "/servicios/pulido.JPG",         // Máquina pulidora trabajando
    ceramico: "/servicios/ceramico.jpg",     // Gotas repelidas en capó
    paquetes: "/servicios/paquetes.png"      // Auto completo, toma amplia
  },
  
  // RESULTADOS: Fotos antes/después de trabajos reales
  // IMPORTANTE: Usa el MISMO ÁNGULO y MISMA ILUMINACIÓN para before y after
  resultados: {
    interior: {
      before: "/resultados/interior-before.jpg",   // Asientos sucios/manchados
      after: "/resultados/interior-after.jpg"      // Mismo ángulo, limpios
    },
    pintura: {
      before: "/resultados/pintura-before.jpg",    // Pintura opaca/rayada
      after: "/resultados/pintura-after.jpg"       // Mismo panel, brillante
    },
    ceramico: {
      before: "/resultados/ceramico-before.jpg",   // Agua extendida en superficie
      after: "/resultados/ceramico-after.jpg"      // Gotas formando esferas
    }
  },
  
  // CERÁMICO: Tu mejor foto de efecto hidrofóbico
  ceramico: "/ceramico/coating-close.jpg",
  
  // COBERTURA: Mapa personalizado o screenshot de Google Maps estilizado
  cobertura: "/cobertura/mapa.jpg",
  
  // TESTIMONIOS: Fotos de autos de clientes (con su permiso)
  // Si no tienes fotos, deja null y se mostrará avatar con inicial
  testimonios: {
    cliente1: "/testimonios/cliente-1.jpg",  // Auto del cliente 1 después de servicio
    cliente2: "/testimonios/cliente-2.jpg",  // Auto del cliente 2
    cliente3: "/testimonios/cliente-3.jpg"   // Auto del cliente 3
  }
};

// ============================================================
// COMPONENTES DEL SITIO
// ============================================================

const ScrollReveal = ({ children, delay = 0, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${className} ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Beneficios', href: '#beneficios' },
    { name: 'Resultados', href: '#resultados' },
    { name: 'Cobertura', href: '#cobertura' },
    { name: 'Testimonios', href: '#testimonios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  const scrollToSection = (href) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#inicio" onClick={() => scrollToSection('#inicio')} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              AQUA<span className="text-cyan-400">BRILLO</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <a
            href={WHATSAPP_LINK("Hola, me interesa cotizar un servicio de AQUABRILLO.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
            Agendar por WhatsApp
          </a>

          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-white">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden transition-all duration-500 overflow-hidden ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-slate-950/95 backdrop-blur-xl border-t border-white/5 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="block w-full text-left text-slate-300 hover:text-white py-2 transition-colors"
            >
              {link.name}
            </button>
          ))}
          <a
            href={WHATSAPP_LINK("Hola, me interesa cotizar un servicio de AQUABRILLO.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full mt-4"
          >
            <Phone className="w-4 h-4" />
            Agendar por WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(2,6,23,0.8)_100%)]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300 font-medium">Detailing Premium a Domicilio</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[0.9] mb-8">
            Tu auto <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              impecable
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl font-light text-slate-400">
              sin salir de casa
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
            Protección, brillo y detalle profesional para quienes valoran 
            la excelencia. Servicio premium a domicilio en Santa Fe Lifestyle 
            y alrededores de Xochitepec.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={WHATSAPP_LINK("Hola, quiero agendar un servicio para mi auto.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 text-lg"
            >
              <MessageCircle className="w-5 h-5" />
              Cotizar por WhatsApp
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <button
              onClick={() => document.querySelector('#servicios').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium rounded-full hover:bg-white/5 transition-all duration-300"
            >
              Ver servicios
            </button>
          </div>
        </ScrollReveal>

        {/* HERO IMAGE - Tu foto principal */}
        <ScrollReveal delay={400}>
          <div className="mt-16 relative">
            <div className="relative mx-auto max-w-4xl aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/5 group">
              {!imgError ? (
                <img 
                  src={IMAGES.hero} 
                  alt="Auto premium con acabado de espejo y reflejos cinematográficos"
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
                  <div className="text-center">
                    <Car className="w-20 h-20 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 text-sm font-medium">Agrega tu imagen en:</p>
                    <p className="text-cyan-400 text-xs mt-2 font-mono">public/images/hero/hero-car.jpg</p>
                    <p className="text-slate-600 text-xs mt-1">Recomendado: Auto oscuro, fondo negro, reflejos</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/30" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
      price: "Desde $350",
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
      price: "Desde $450",
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
            <p className="max-w-2xl mx-auto text-slate-400 text-lg">
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

// Componente auxiliar para manejar error de imagen en servicios
const ServiceCard = ({ service, index }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <ScrollReveal delay={index * 100}>
      <div className="group relative rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-500 h-full flex flex-col overflow-hidden">
        
        {/* SERVICE IMAGE - Tu foto de servicio */}
        <div className="relative h-48 overflow-hidden bg-slate-900">
          {!imgError ? (
            <img 
              src={service.image} 
              alt={service.imageAlt}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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

const BeforeAfter = () => {
  const cases = [
    {
      title: "Detallado Interior",
      desc: "Eliminación de manchas, olores y restauración de tapicería",
      before: IMAGES.resultados.interior.before,
      after: IMAGES.resultados.interior.after,
      beforeAlt: "Interior de auto antes: asientos sucios con manchas",
      afterAlt: "Interior de auto después: tapicería restaurada y limpia"
    },
    {
      title: "Corrección de Pintura",
      desc: "Eliminación de swirl marks y recuperación de brillo",
      before: IMAGES.resultados.pintura.before,
      after: IMAGES.resultados.pintura.after,
      beforeAlt: "Pintura de auto antes: opaca con micro-rayones",
      afterAlt: "Pintura de auto después: brillo de espejo sin imperfecciones"
    },
    {
      title: "Recubrimiento Cerámico",
      desc: "Protección duradera con acabado hidrofóbico",
      before: IMAGES.resultados.ceramico.before,
      after: IMAGES.resultados.ceramico.after,
      beforeAlt: "Superficie antes: agua estancada sin protección",
      afterAlt: "Superficie después: gotas repelidas formando esferas perfectas"
    }
  ];

  return (
    <section id="resultados" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">Resultados Reales</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Antes y <span className="text-slate-400">Después</span></h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg">
              La evidencia habla por sí sola. Transformaciones que superan expectativas.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {cases.map((item, index) => (
            <BeforeAfterCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Componente auxiliar para manejar errores en Before/After
const BeforeAfterCard = ({ item, index }) => {
  const [beforeError, setBeforeError] = useState(false);
  const [afterError, setAfterError] = useState(false);

  return (
    <ScrollReveal delay={index * 150}>
      <div className="group">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 mb-6">
          <div className="absolute inset-0 flex">
            {/* BEFORE - Tu foto "antes" o diseño alternativo */}
            <div className="w-1/2 relative border-r border-white/20 overflow-hidden">
              {!beforeError ? (
                <img 
                  src={item.before} 
                  alt={item.beforeAlt}
                  className="w-full h-full object-cover"
                  onError={() => setBeforeError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center">
                  <Car className="w-10 h-10 text-slate-700 mb-2" />
                  <span className="text-xs font-bold text-red-400 uppercase">Antes</span>
                  <p className="text-[10px] text-slate-600 mt-1 font-mono">{item.before.split('/').pop()}</p>
                </div>
              )}
              <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                <span className="text-xs font-bold text-red-400 uppercase">Antes</span>
              </div>
            </div>
            {/* AFTER - Tu foto "después" o diseño alternativo */}
            <div className="w-1/2 relative overflow-hidden">
              {!afterError ? (
                <img 
                  src={item.after} 
                  alt={item.afterAlt}
                  className="w-full h-full object-cover"
                  onError={() => setAfterError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center">
                  <Sparkles className="w-10 h-10 text-cyan-700 mb-2" />
                  <span className="text-xs font-bold text-cyan-400 uppercase">Después</span>
                  <p className="text-[10px] text-slate-600 mt-1 font-mono">{item.after.split('/').pop()}</p>
                </div>
              )}
              <div className="absolute top-4 right-4 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full">
                <span className="text-xs font-bold text-cyan-400 uppercase">Después</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
        <p className="text-slate-400 text-sm">{item.desc}</p>
      </div>
    </ScrollReveal>
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
                que dura años, no semanas.
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
                href={WHATSAPP_LINK("Hola, me interesa el recubrimiento cerámico.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300"
              >
                <Gem className="w-5 h-5" />
                Solicitar evaluación gratuita
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="relative">
              {/* CERAMIC IMAGE - Tu mejor foto de efecto hidrofóbico */}
              <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 bg-slate-800 shadow-2xl shadow-cyan-500/10">
                {!imgError ? (
                  <img 
                    src={IMAGES.ceramico} 
                    alt="Capó negro con recubrimiento cerámico mostrando efecto hidrofóbico"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center">
                    <Shield className="w-16 h-16 text-cyan-700 mb-4" />
                    <p className="text-cyan-400 text-xs font-mono">Sin imagen</p>
                  </div>
                )}
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-cyan-500/20 via-transparent to-blue-500/20 opacity-50" />
              </div>
              
              {/* Floating Badge */}
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
      desc: "Llegamos puntualmente a tu ubicación y transformamos tu auto en el lugar."
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

// ============================================================
// MAPA VISUAL PREMIUM — Santa Fe Lifestyle, Xochitepec, Morelos
// Mapa estilizado en SVG con animaciones y diseño oscuro
// No requiere imágenes externas
// ============================================================

const CoverageMap = () => {
  const [activeZone, setActiveZone] = useState(null);

  const zonas = [
    {
      id: "santa-fe",
      nombre: "Santa Fe Lifestyle",
      tipo: "Principal",
      descripcion: "Fraccionamiento residencial premium con acceso directo",
      tiempo: "15-20 min",
      coordenadas: { cx: 280, cy: 180, r: 35 },
      color: "#06b6d4", // cyan-500
      glowColor: "rgba(6, 182, 212, 0.4)",
      icon: Home
    },
    {
      id: "xochitepec-centro",
      nombre: "Xochitepec Centro",
      tipo: "Principal",
      descripcion: "Zona urbana y comercial del municipio",
      tiempo: "10-15 min",
      coordenadas: { cx: 220, cy: 220, r: 30 },
      color: "#3b82f6", // blue-500
      glowColor: "rgba(59, 130, 246, 0.4)",
      icon: MapPin
    },
    {
      id: "los-sauces",
      nombre: "Fracc. Los Sauces",
      tipo: "Residencial",
      descripcion: "Zona habitacional cercana",
      tiempo: "15-25 min",
      coordenadas: { cx: 320, cy: 140, r: 25 },
      color: "#8b5cf6", // violet-500
      glowColor: "rgba(139, 92, 246, 0.3)",
      icon: Home
    },
    {
      id: "benito-juarez",
      nombre: "Col. Benito Juárez",
      tipo: "Urbana",
      descripcion: "Sector céntrico de Xochitepec",
      tiempo: "10-20 min",
      coordenadas: { cx: 180, cy: 200, r: 22 },
      color: "#10b981", // emerald-500
      glowColor: "rgba(16, 185, 129, 0.3)",
      icon: MapPin
    },
    {
      id: "jardines",
      nombre: "Fracc. Jardines",
      tipo: "Residencial",
      descripcion: "Zona habitacional con acceso controlado",
      tiempo: "20-30 min",
      coordenadas: { cx: 340, cy: 240, r: 25 },
      color: "#f59e0b", // amber-500
      glowColor: "rgba(245, 158, 11, 0.3)",
      icon: Home
    },
    {
      id: "zona-sur",
      nombre: "Zona Sur Xochitepec",
      tipo: "Expansión",
      descripcion: "Comunidades aledañas (consultar)",
      tiempo: "25-40 min",
      coordenadas: { cx: 200, cy: 280, r: 28 },
      color: "#64748b", // slate-500
      glowColor: "rgba(100, 116, 139, 0.3)",
      icon: Clock
    }
  ];

  const rutasPrincipales = [
    { nombre: "Autopista México-Cuernavaca", path: "M 50,150 Q 200,120 450,180" },
    { nombre: "Carretera Federal 95D", path: "M 80,200 Q 250,180 420,220" },
    { nombre: "Acceso Santa Fe Lifestyle", path: "M 250,100 Q 280,140 280,180" }
  ];

  const referencias = [
    { icon: "🛣️", text: "Autopista México-Cuernavaca" },
    { icon: "🎓", text: "Cerca de UAEM" },
    { icon: "⛰️", text: "Cercano a Tepoztlán" },
    { icon: "📍", text: "Carretera Federal 95D" }
  ];

  const zonaActiva = zonas.find(z => z.id === activeZone);

  return (
    <section id="cobertura" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="text-cyan-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
              Área de Cobertura
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Servicio a Domicilio en <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Santa Fe Lifestyle & Xochitepec
              </span>
            </h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-lg">
              Mapa interactivo de nuestras zonas de servicio. Selecciona una ubicación 
              para ver detalles de tiempo y disponibilidad.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* MAPA SVG — 3 columnas */}
          <ScrollReveal className="lg:col-span-3">
            <div className="relative bg-slate-900/50 rounded-3xl border border-white/10 p-6 overflow-hidden">
              {/* Título del mapa */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  Xochitepec, Morelos
                </h3>
                <span className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                  Zona Premium
                </span>
              </div>

              {/* SVG Mapa */}
              <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl overflow-hidden">
                <svg 
                  viewBox="0 0 500 400" 
                  className="w-full h-full"
                  style={{ filter: "drop-shadow(0 0 30px rgba(6,182,212,0.1))" }}
                >
                  {/* Definiciones de gradientes y filtros */}
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

                  {/* Fondo del mapa — silueta estilizada de Morelos/Xochitepec */}
                  <path 
                    d="M 80,80 
                       Q 150,60 250,70 
                       Q 350,50 420,90 
                       Q 460,150 450,220 
                       Q 440,300 380,340 
                       Q 300,370 200,360 
                       Q 100,350 60,280 
                       Q 40,200 60,140 
                       Q 70,100 80,80 Z" 
                    fill="rgba(15, 23, 42, 0.6)" 
                    stroke="rgba(6, 182, 212, 0.2)" 
                    strokeWidth="1"
                  />

                  {/* Líneas de carreteras principales */}
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

                  {/* Etiquetas de carreteras */}
                  <text x="200" y="115" fill="rgba(148, 163, 184, 0.5)" fontSize="8" fontFamily="Inter">
                    Autopista México-Cuernavaca
                  </text>
                  <text x="220" y="195" fill="rgba(148, 163, 184, 0.5)" fontSize="8" fontFamily="Inter">
                    Carretera 95D
                  </text>

                  {/* Zonas de cobertura — Círculos interactivos */}
                  {zonas.map((zona) => (
                    <g 
                      key={zona.id}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setActiveZone(zona.id)}
                      onMouseLeave={() => setActiveZone(null)}
                      style={{ transformOrigin: `${zona.coordenadas.cx}px ${zona.coordenadas.cy}px` }}
                    >
                      {/* Área de influencia (glow) */}
                      <circle
                        cx={zona.coordenadas.cx}
                        cy={zona.coordenadas.cy}
                        r={zona.coordenadas.r * 1.8}
                        fill={zona.glowColor}
                        opacity={activeZone === zona.id ? 0.6 : 0.2}
                        className="transition-opacity duration-300"
                      />
                      
                      {/* Círculo principal */}
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
                      
                      {/* Punto central */}
                      <circle
                        cx={zona.coordenadas.cx}
                        cy={zona.coordenadas.cy}
                        r={6}
                        fill={zona.color}
                        className="transition-all duration-300"
                      />
                      
                      {/* Animación de pulso para zonas principales */}
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

                      {/* Nombre de la zona */}
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
                        {zona.nombre}
                      </text>
                    </g>
                  ))}

                  {/* Indicador "Tú estás aquí" estilo */}
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

                {/* Overlay de información al hover */}
                {zonaActiva && (
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${zonaActiva.color}20` }}
                      >
                        <zonaActiva.icon className="w-5 h-5" style={{ color: zonaActiva.color }} />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-white font-bold text-sm">{zonaActiva.nombre}</h4>
                        <p className="text-slate-400 text-xs">{zonaActiva.descripcion}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Llegada</span>
                        <span className="text-cyan-400 font-bold text-sm">{zonaActiva.tiempo}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Leyenda del mapa */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-500" />
                  <span className="text-slate-400">Zona Principal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  <span className="text-slate-400">Residencial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-500" />
                  <span className="text-slate-400">Zona de Expansión</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-8 h-0.5 bg-slate-600 border-dashed" style={{ borderTop: "1px dashed rgba(100,116,139,0.5)" }} />
                  <span className="text-slate-500">Vía de acceso</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Panel lateral de información — 2 columnas */}
          <ScrollReveal delay={200} className="lg:col-span-2">
            <div className="space-y-6">
              {/* Tarjeta de zona activa o default */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Zonas Cubiertas
                </h3>
                
                <div className="space-y-3">
                  {zonas.map((zona) => (
                    <div 
                      key={zona.id}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 cursor-pointer ${
                        activeZone === zona.id 
                          ? 'bg-cyan-500/10 border border-cyan-500/20' 
                          : 'bg-white/5 border border-transparent hover:bg-white/[0.03]'
                      }`}
                      onMouseEnter={() => setActiveZone(zona.id)}
                      onMouseLeave={() => setActiveZone(null)}
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: zona.color }}
                      />
                      <div className="flex-grow">
                        <p className="text-white text-sm font-medium">{zona.nombre}</p>
                        <p className="text-slate-500 text-xs">{zona.tipo}</p>
                      </div>
                      <span className="text-cyan-400 text-xs font-medium">{zona.tiempo}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referencias geográficas */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 text-sm">Referencias Geográficas</h3>
                <div className="space-y-3">
                  {referencias.map((ref, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-lg">{ref.icon}</span>
                      <span className="text-slate-400 text-sm">{ref.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <a
                href={WHATSAPP_LINK("Hola, vivo en [tu colonia/fraccionamiento], ¿tienen cobertura?")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                Verificar mi ubicación
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Stats de cobertura */}
        <ScrollReveal delay={300}>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { valor: "6+", label: "Zonas cubiertas", icon: MapPin },
              { valor: "15min", label: "Tiempo promedio", icon: Clock },
              { valor: "0$", label: "Costo de traslado", icon: Home },
              { valor: "100%", label: "Satisfacción", icon: Award }
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

function Testimonials() {
  const testimonials = [
    {
      name: "Carlos M.",
      role: "BMW X5",
      text: "Increíble el nivel de detalle. Mi auto quedó mejor que cuando lo compré. El servicio a domicilio es un lujo que vale cada peso.",
      rating: 5,
      image: IMAGES.testimonios.cliente1
    },
    {
      name: "Mariana R.",
      role: "Mercedes C-Class",
      text: "Profesionalismo absoluto. Llegaron puntual, trabajaron con cuidado y el resultado superó mis expectativas. Totalmente recomendable.",
      rating: 5,
      image: IMAGES.testimonios.cliente2
    },
    {
      name: "Alejandro G.",
      role: "Porsche 911",
      text: "El recubrimiento cerámico cambió por completo la apariencia de mi auto. El brillo es espectacular y la protección se nota al instante.",
      rating: 5,
      image: IMAGES.testimonios.cliente3
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
      </div>
    </section>
  );
}

// Componente auxiliar para testimonios con foto opcional
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
          {/* Avatar: Foto del auto del cliente o inicial con gradiente */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center flex-shrink-0">
            {item.image && !imgError ? (
              <img 
                src={item.image} 
                alt={`Auto de ${item.name}`}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-white font-bold text-lg">{item.name[0]}</span>
            )}
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
              href={WHATSAPP_LINK("Hola, quiero agendar una evaluación para mi auto.")}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 text-lg"
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                AQUA<span className="text-cyan-400">BRILLO</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
              Detailing automotriz premium a domicilio. Transformamos tu vehículo 
              con la precisión y el cuidado que solo los verdaderos apasionados 
              entienden.
            </p>
            <div className="flex items-center gap-4">
              <a
                href={WHATSAPP_LINK("Hola, me interesa un servicio de AQUABRILLO.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all"
              >
                <Phone className="w-5 h-5 text-cyan-400" />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all"
              >
                <Instagram className="w-5 h-5 text-cyan-400" />
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
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 AQUABRILLO. Todos los derechos reservados.
          </p>
          <p className="text-slate-600 text-xs">
            Detailing premium a domicilio. Obsesión por el detalle.
          </p>
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
      href={WHATSAPP_LINK("Hola, me interesa cotizar un servicio de AQUABRILLO.")}
      target="_blank"
      rel="noopener noreferrer"
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
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <Hero />
      <Credibility />
      <Services />
      <Benefits />
      <BeforeAfter />
      <CeramicCoating />
      <HowItWorks />
      <CoverageMap />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default App;