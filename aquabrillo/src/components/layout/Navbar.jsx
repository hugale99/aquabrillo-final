import { useEffect, useState } from 'react';
import { ChevronRight, Droplets, Menu, Phone, X } from 'lucide-react';
import { getWhatsAppLink, IMAGES, WHATSAPP_CAMPAIGNS } from '../../config/site';

const WHATSAPP_LINK = getWhatsAppLink;

const navLinks = [
  { name: 'Inicio', href: '#inicio' },
  { name: 'Servicios', href: '#servicios' },
  { name: 'Beneficios', href: '#beneficios' },
  { name: 'Resultados', href: '#resultados' },
  { name: 'Cobertura', href: '#cobertura' },
  { name: 'Para Agencias', href: '#b2b' },
  { name: 'Testimonios', href: '#testimonios' },
  { name: 'Contacto', href: '#contacto' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('#inicio');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
    setActiveHref(href);
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 transition-all duration-500 sm:px-6">
      <div className={`relative mx-auto max-w-7xl overflow-hidden rounded-2xl border transition-all duration-500 ${
        scrolled
          ? 'border-cyan-300/20 bg-slate-950/88 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl'
          : 'border-white/10 bg-slate-950/38 shadow-xl shadow-black/10 backdrop-blur-xl'
      }`}>
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
        <div className="flex h-20 items-center justify-between px-4 sm:px-5 lg:px-6">
          <a href="#inicio" onClick={() => scrollToSection('#inicio')} className="group flex min-w-0 items-center gap-3">
            <div className="relative flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-cyan-200/20 bg-white/[0.06] shadow-lg shadow-cyan-500/10 transition duration-300 group-hover:border-cyan-200/40 group-hover:shadow-cyan-400/20">
              <img src={IMAGES.logo} alt="AQUABRILLO" className="h-8 w-auto" decoding="async" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
              <div className="hidden h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-white">
                <Droplets className="h-4 w-4" />
              </div>
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
            </div>
            <div className="min-w-0">
              <span className="block text-lg font-black tracking-tight text-white sm:text-xl">
                AQUA<span className="text-cyan-300">BRILLO</span>
              </span>
              <span className="hidden text-[0.62rem] font-bold uppercase tracking-[0.24em] text-cyan-100/60 sm:block">
                Detailing Lab
              </span>
            </div>
          </a>

          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.035] p-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = activeHref === link.href;

              return (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative rounded-full px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] transition duration-300 ${
                    isActive
                      ? 'bg-cyan-300/12 text-white shadow-inner shadow-cyan-300/10'
                      : 'text-slate-300 hover:bg-cyan-300/10 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute inset-x-3 bottom-1 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              );
            })}
          </div>

          <a
            href={WHATSAPP_LINK(WHATSAPP_CAMPAIGNS.generalQuote)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-emerald-200/20 bg-[#25D366] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#25D366]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#1EBE5D] hover:shadow-[#25D366]/35 lg:flex"
          >
            <Phone className="w-4 h-4" />
            WhatsApp
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-white shadow-lg shadow-black/20 transition duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/10 lg:hidden"
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
        <div className="mt-2 max-h-[calc(100vh-6.5rem)] space-y-2 overflow-y-auto rounded-2xl border border-cyan-300/15 bg-slate-950/94 p-3 shadow-2xl shadow-cyan-950/30 backdrop-blur-2xl">
          {navLinks.map((link) => {
            const isActive = activeHref === link.href;

            return (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition duration-300 ${
                  isActive
                    ? 'border-cyan-300/30 bg-cyan-300/12 text-white'
                    : 'border-white/5 bg-white/[0.035] text-slate-200 hover:border-cyan-300/20 hover:bg-cyan-300/10 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <ChevronRight className="h-4 w-4 text-cyan-200/70" />
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
