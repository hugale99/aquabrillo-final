export const REVIEW_STATUS_LABELS = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  hidden: 'Oculta',
};

export const REVIEW_STATUS_STYLES = {
  pending: 'bg-brand-orange/12 text-orange-100',
  approved: 'bg-brand-green/12 text-green-100',
  hidden: 'bg-brand-rust/12 text-orange-100',
};

export const REVIEW_FILTER_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobadas' },
  { value: 'hidden', label: 'Ocultas' },
];

export const formatReviewDate = (dateValue) => {
  if (!dateValue) return 'Fecha no disponible';

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(dateValue));
};
