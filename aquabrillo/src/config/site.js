export const WHATSAPP_NUMBER = '7773887690';

export const getWhatsAppLink = (text) =>
  `https://wa.me/52${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/santafecarwashexpress?igsh=MW4ydm03c3Jxa2Jvbw==',
  facebook: 'https://www.facebook.com/share/1JZTAu7cAa/?mibextid=wwXIfr'
};

export const WHATSAPP_CAMPAIGNS = {
  generalQuote: 'Hola, me interesa cotizar un servicio de AQUABRILLO.',
  carService: 'Hola, quiero agendar un servicio para mi auto.',
  results: 'Hola, vi sus resultados y me interesa agendar un servicio. Mi auto es [marca/modelo].',
  ceramic: 'Hola, me interesa el recubrimiento ceramico.',
  coverage: 'Hola, vivo en [tu colonia/fraccionamiento], tienen cobertura?',
  b2b: 'Hola, represento una agencia automotriz y me interesa cotizar servicios de detallado corporativo.',
  b2bDemo: 'Hola, me gustaria agendar una demostracion sin costo para mi agencia. Somos [nombre de agencia].',
  evaluation: 'Hola, quiero agendar una evaluacion para mi auto.',
  generalService: 'Hola, me interesa un servicio de AQUABRILLO.'
};

export const IMAGES = {
  logo: '/images/logo.png',
  hero: '/images/hero/hero-car.jpg',
  servicios: {
    lavado: '/images/servicios/lavado.jpg',
    interior: '/images/servicios/interior.jpg',
    exterior: '/images/servicios/exterior.jpg',
    pulido: '/images/servicios/pulido.jpg',
    ceramico: '/images/servicios/ceramico.jpg',
    paquetes: '/images/servicios/paquetes.jpg'
  },
  resultados: {
    interior: {
      before: '/images/resultados/interior-before.jpg',
      after: '/images/resultados/interior-after.jpg'
    },
    pintura: {
      before: '/images/resultados/pintura-before.jpg',
      after: '/images/resultados/pintura-after.jpg'
    },
    ceramico: {
      before: '/images/resultados/ceramico-before.jpeg',
      after: '/images/resultados/ceramico-after.jpg'
    }
  },
  ceramico: '/images/ceramico/coating-close.jpg',
  cobertura: '/images/cobertura/mapa.jpg',
  testimonios: {
    cliente1: '/images/testimonios/cliente-1.jpg',
    cliente2: '/images/testimonios/cliente-2.jpg',
    cliente3: '/images/testimonios/cliente-3.jpg',
    cliente4: '/images/testimonios/cliente-4.jpg'
  }
};

export const SITE_METADATA = {
  title: 'AQUABRILLO | Lavado y Detallado Premium a Domicilio',
  description:
    'Lavado y detallado automotriz premium a domicilio en Santa Fe Lifestyle, Xochitepec y alrededores.',
  url: 'https://aquabrillo.com',
  image: '/images/hero/hero-car.jpg'
};
