import { useEffect, useState } from 'react';
import { Quote, Star } from 'lucide-react';
import ScrollReveal from './ui/ScrollReveal';
import { IMAGES } from '../config/site';
import { listApprovedReviews } from '../services/reviewRepository';

const fallbackTestimonials = [
  {
    name: 'Juan Manuel',
    role: 'BYD King',
    text: 'Increíble el nivel de detalle. El servicio a domicilio es un lujo que vale cada peso.',
    rating: 5,
  },
  {
    name: 'Ivonne B',
    role: 'JEEP Renegade',
    text: 'Profesionalismo absoluto. Llegaron puntual, trabajaron con cuidado y el resultado superó mis expectativas. Totalmente recomendable.',
    rating: 5,
  },
  {
    name: 'Luis Alonso',
    role: 'MG ONE',
    text: 'El recubrimiento cerámico cambió por completo la apariencia de mi auto. El brillo es espectacular y la protección se nota al instante.',
    rating: 5,
  },
  {
    name: 'Anónimo',
    role: 'VW Passat',
    text: 'Satisfecho con el trabajo que realizaron en mi auto. El cambio en la pintura es impresionante, el brillo es más profundo, incluso siendo un auto color negro.',
    rating: 5,
  },
];

const getInitials = (name = '') => name
  .split(' ')
  .map((part) => part[0])
  .join('')
  .slice(0, 2)
  .toUpperCase();

const TestimonialCard = ({ item, index }) => {
  const [imgError, setImgError] = useState(false);
  const imageSrc = item.isDynamic ? null : IMAGES.testimonios[`cliente${index + 1}`];

  return (
    <ScrollReveal delay={index * 150}>
      <div className={`relative flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 sm:p-6 ${
        item.isDynamic
          ? 'border-brand-orange/25 bg-white/[0.055] shadow-2xl shadow-brand-orange/5'
          : 'border-white/10 bg-white/[0.025] hover:border-brand-orange/20'
      }`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <Quote className={`h-9 w-9 ${item.isDynamic ? 'text-brand-orange/35' : 'text-slate-700'}`} />
          <span className={`rounded-full px-3 py-1 text-[0.64rem] font-black uppercase tracking-[0.12em] ${
            item.isDynamic ? 'bg-brand-green/15 text-green-100' : 'bg-white/[0.04] text-slate-500'
          }`}>
            {item.isDynamic ? 'Verificada' : 'Cliente'}
          </span>
        </div>

        <p className="mb-5 flex-grow text-sm italic leading-7 text-slate-300 sm:text-[0.95rem]">
          "{item.text}"
        </p>

        <div className="mb-4 flex items-center gap-1">
          {[...Array(item.rating)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 fill-current ${item.isDynamic ? 'text-brand-orange' : 'text-cyan-400'}`} />
          ))}
        </div>

        <div className="flex items-center gap-4 border-t border-white/10 pt-4">
          <div className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full ${
            item.isDynamic ? 'bg-gradient-to-br from-brand-orange/35 to-brand-green/25' : 'bg-gradient-to-br from-cyan-500/30 to-blue-600/30'
          }`}>
            {imageSrc && (
              <img
                src={imageSrc}
                alt={`Auto de ${item.name}`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                onError={() => setImgError(true)}
              />
            )}
            <span className={`text-sm font-bold text-white ${imgError || !imageSrc ? '' : 'hidden'}`}>
              {getInitials(item.name)}
            </span>
          </div>
          <div className="min-w-0">
            <h4 className="truncate font-semibold text-white">{item.name}</h4>
            <p className="truncate text-sm text-slate-400">{item.role}</p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

const Testimonials = () => {
  const [approvedReviews, setApprovedReviews] = useState([]);

  const visibleTestimonials = [
    ...approvedReviews.map((review) => ({
      id: review.id,
      name: review.name,
      role: review.vehicle || review.service || 'Cliente AQUABRILLO',
      text: review.text,
      rating: review.rating || 5,
      isDynamic: true,
    })),
    ...fallbackTestimonials,
  ].slice(0, 6);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      const result = await listApprovedReviews();
      if (isMounted) setApprovedReviews(result.reviews);
    };

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="testimonios" className="relative overflow-hidden bg-brand-night py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(240,139,29,0.12),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(62,122,38,0.12),_transparent_30%)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <span className="mb-4 block text-sm font-black uppercase tracking-[0.16em] text-brand-orange">Opiniones verificadas</span>
              <h2 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl md:text-5xl">
                Clientes que ya vivieron el detalle AQUABRILLO
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                {approvedReviews.length > 0
                  ? 'Mostramos primero las opiniones aprobadas y autorizadas por clientes reales.'
                  : 'Opiniones destacadas de clientes mientras se aprueban nuevas reseñas recibidas.'}
              </p>
            </div>

            <div className="rounded-2xl border border-brand-orange/20 bg-white/[0.035] p-5 shadow-2xl shadow-black/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Reseñas públicas</p>
                  <p className="mt-2 text-3xl font-black text-white">{approvedReviews.length}</p>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-orange/15">
                  <Star className="h-7 w-7 fill-brand-orange text-brand-orange" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Solo se publican opiniones aprobadas y con autorización del cliente.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTestimonials.map((item, index) => (
            <TestimonialCard key={item.id || `${item.name}-${index}`} item={item} index={index} />
          ))}
        </div>

        <ScrollReveal delay={250}>
          <div className="mt-8 flex justify-center sm:mt-10">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('aquabrillo:open-review-form'))}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-brand-orange/30 bg-brand-orange px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-brand-night shadow-xl shadow-brand-orange/15 transition hover:bg-orange-300 sm:w-auto"
            >
              <Quote className="h-4 w-4" />
              Dejar mi opinión
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Testimonials;
