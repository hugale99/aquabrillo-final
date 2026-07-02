import { useEffect, useState } from 'react';
import {
  CalendarDays,
  Car,
  ChevronRight,
  Droplets,
  Gauge,
  LockKeyhole,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { getWhatsAppLink, IMAGES, WHATSAPP_CAMPAIGNS } from '../../config/site';

const WHATSAPP_LINK = getWhatsAppLink;

const navLinks = [
  { name: 'Inicio', href: '#inicio', icon: Gauge },
  { name: 'Servicios', href: '#servicios', icon: Droplets },
  { name: 'Cotizador', href: '#cotizador', icon: CalendarDays },
  { name: 'Beneficios', href: '#beneficios', icon: Shield },
  { name: 'Resultados', href: '#resultados', icon: Sparkles },
  { name: 'Cobertura', href: '#cobertura', icon: MapPin },
  { name: 'Agencias', href: '#b2b', icon: Car },
  { name: 'Opiniones', href: '#testimonios', icon: Star },
  { name: 'Contacto', href: '#contacto', icon: MessageCircle },
];

const desktopNavLinks = navLinks.filter((link) => (
  ['#inicio', '#servicios', '#cotizador', '#cobertura'].includes(link.href)
));

const secondaryNavLinks = navLinks.filter((link) => (
  ['#resultados', '#beneficios', '#b2b', '#testimonios', '#contacto'].includes(link.href)
));

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('#inicio');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setIsMoreOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection?.target?.id) {
          setActiveHref(`#${visibleSection.target.id}`);
        }
      },
      {
        rootMargin: '-35% 0px -55% 0px',
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (href) => {
    setIsOpen(false);
    setIsMoreOpen(false);
    setActiveHref(href);
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 transition-all duration-500 sm:px-6">
      <div className={`relative mx-auto max-w-7xl overflow-visible rounded-[1.35rem] border transition-all duration-500 ${
        scrolled
          ? 'border-brand-orange/30 bg-brand-night/92 shadow-2xl shadow-black/35 backdrop-blur-2xl'
          : 'border-white/10 bg-brand-night/54 shadow-xl shadow-black/15 backdrop-blur-xl'
      }`}>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08),transparent_22%,rgba(240,139,29,0.10)_52%,transparent_78%)]" />
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/85 to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-brand-rust/35 to-transparent" />
        <div className="pointer-events-none absolute -left-16 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full bg-brand-orange/10 blur-2xl" />
        <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-brand-green/15 blur-2xl" />

        <div className="relative flex h-[4.7rem] items-center justify-between gap-3 px-3 sm:px-4 lg:px-5">
          <a href="#inicio" onClick={() => scrollToSection('#inicio')} className="group flex min-w-0 flex-none items-center gap-2 sm:gap-3">
            <div className="relative flex h-11 w-11 flex-none items-center justify-center rounded-[1.05rem] border border-brand-orange/30 bg-brand-night/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_16px_36px_rgba(240,139,29,0.14)] transition duration-300 group-hover:border-brand-orange/60 group-hover:shadow-brand-orange/20 sm:h-12 sm:w-12">
              <img src={IMAGES.logo} alt="AQUABRILLO" className="h-7 w-auto sm:h-8" decoding="async" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              <div className="hidden h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange to-brand-rust text-white sm:h-8 sm:w-8">
                <Droplets className="h-4 w-4" />
              </div>
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-brand-green shadow-[0_0_18px_rgba(62,122,38,0.95)]" />
              <span className="absolute -bottom-1 left-2 h-1 w-7 rounded-full bg-gradient-to-r from-brand-orange via-white to-brand-rust opacity-80 blur-[1px]" />
            </div>
            <div className="min-w-0 max-w-[9.5rem] sm:max-w-[11rem]">
              <span className="block truncate text-base font-black tracking-tight text-white sm:text-xl">
                AQUA<span className="text-brand-orange">BRILLO</span>
              </span>
            </div>
          </a>

          <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
            <div className="flex max-w-full items-center gap-1 rounded-full border border-brand-orange/15 bg-brand-night/60 p-1 shadow-inner shadow-black/30">
            {desktopNavLinks.map((link) => {
              const isActive = activeHref === link.href;
              const Icon = link.icon;

              return (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.64rem] font-black uppercase tracking-[0.08em] transition duration-300 xl:px-3.5 ${
                    isActive
                      ? 'bg-brand-orange/16 text-white shadow-inner shadow-brand-orange/10'
                      : 'text-slate-300 hover:bg-brand-orange/10 hover:text-white'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-brand-orange' : 'text-brand-orange/55 group-hover:text-brand-orange'}`} />
                  {link.name}
                  <span className={`absolute inset-x-3 bottom-1 h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              );
            })}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreOpen((current) => !current)}
                aria-expanded={isMoreOpen}
                aria-haspopup="menu"
                className={`group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.64rem] font-black uppercase tracking-[0.08em] transition duration-300 ${
                  secondaryNavLinks.some((link) => activeHref === link.href)
                    ? 'bg-brand-orange/16 text-white shadow-inner shadow-brand-orange/10'
                    : 'text-slate-300 hover:bg-brand-orange/10 hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-orange/70 group-hover:text-brand-orange" />
                Mas
                <ChevronRight className={`h-3.5 w-3.5 text-brand-orange/70 transition-transform duration-300 ${isMoreOpen ? 'rotate-90' : ''}`} />
              </button>
              <div
                role="menu"
                className={`absolute right-0 top-[calc(100%+0.75rem)] w-56 overflow-hidden rounded-2xl border border-brand-orange/20 bg-brand-night/95 p-2 shadow-2xl shadow-black/35 backdrop-blur-2xl transition-all duration-300 ${
                  isMoreOpen
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none -translate-y-2 opacity-0'
                }`}
              >
                {secondaryNavLinks.map((link) => {
                  const isActive = activeHref === link.href;
                  const Icon = link.icon;

                  return (
                    <button
                      key={link.name}
                      type="button"
                      role="menuitem"
                      onClick={() => scrollToSection(link.href)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-bold transition duration-300 ${
                        isActive
                          ? 'bg-brand-orange/14 text-white'
                          : 'text-slate-300 hover:bg-brand-orange/10 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-brand-orange/75" />
                        {link.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-brand-orange/60" />
                    </button>
                  );
                })}
              </div>
            </div>
            </div>
          </div>

          <div className="hidden flex-none items-center gap-2 lg:flex">
          <a
            href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.generalQuote)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-emerald-200/25 bg-[#25D366] px-4 py-3 text-sm font-black text-white shadow-lg shadow-[#25D366]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1EBE5D] hover:shadow-[#25D366]/35"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">WhatsApp</span>
          </a>
          <a
            href="#admin"
            className="flex items-center gap-2 rounded-full border border-brand-orange/25 bg-brand-orange/10 px-4 py-3 text-sm font-black text-orange-100 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:border-brand-orange/45 hover:bg-brand-orange/15"
          >
            <LockKeyhole className="h-4 w-4" />
            <span className="hidden xl:inline">Panel</span>
          </a>
          </div>

          <button
            onClick={() => {
              setIsMoreOpen(false);
              setIsOpen(!isOpen);
            }}
            className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-[1rem] border border-brand-orange/25 bg-brand-night/75 text-white shadow-lg shadow-black/20 transition duration-300 hover:border-brand-orange/45 hover:bg-brand-orange/10 lg:hidden"
            aria-label={isOpen ? 'Cerrar menu' : 'Abrir menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div id="mobile-navigation" className={`mx-auto max-w-7xl overflow-hidden px-1 transition-all duration-500 lg:hidden ${
        isOpen ? 'max-h-[calc(100vh-5rem)] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="mt-2 max-h-[calc(100vh-6.5rem)] space-y-2 overflow-y-auto rounded-[1.35rem] border border-brand-orange/20 bg-brand-night/95 p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl">
          {navLinks.map((link) => {
            const isActive = activeHref === link.href;
            const Icon = link.icon;

            return (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition duration-300 ${
                  isActive
                    ? 'border-brand-orange/40 bg-brand-orange/14 text-white'
                    : 'border-white/5 bg-white/[0.035] text-slate-200 hover:border-brand-orange/25 hover:bg-brand-orange/10 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-brand-orange/75" />
                  {link.name}
                </span>
                <ChevronRight className="h-4 w-4 text-brand-orange/75" />
              </button>
            );
          })}
          <a
            href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.generalQuote)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 text-base font-black text-white shadow-xl shadow-[#25D366]/25 transition duration-300 hover:bg-[#1EBE5D]"
          >
            <Phone className="h-5 w-5" />
            Agendar por WhatsApp
          </a>
          <a
            href="#admin"
            className="flex items-center justify-center gap-3 rounded-2xl border border-brand-orange/25 bg-brand-orange/10 px-6 py-4 text-base font-black text-orange-100 transition duration-300 hover:bg-brand-orange/15"
          >
            <LockKeyhole className="h-5 w-5" />
            Panel operativo
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
