export const DEFAULT_OPTIONS: readonly string[] = [
  'LLAVERO',
  '¡Suerte para la próxima!',
  'TOTE BAG',
  'LAPICERO',
  '¡Gracias por participar!',
  'CUPÓN DESCUENTO',
]

/** Brand palette sampled from the Transporte Medal logo. Mirrored as CSS variables in styles.css. */
export const COLORS = {
  navy: '#223262',
  medalBlue: '#0477B8',
  sky: '#0093D6',
  sunGold: '#F8CD00',
  amber: '#EFAE00',
  sunYellow: '#FFE700',
  white: '#FFFFFF',
  charcoal: '#4A5252',
} as const

/** Slice fills cycle in this order; each entry pairs a fill with its label color. */
export const SLICE_STYLES = [
  { fill: COLORS.sunGold, label: COLORS.navy },
  { fill: COLORS.white, label: COLORS.navy },
  { fill: COLORS.sky, label: COLORS.white },
] as const

export const MIN_OPTIONS = 2
export const WARN_OPTIONS = 24

export const SPIN_MS = 6000
export const REDUCED_MOTION_SPIN_MS = 1500
export const EXTRA_TURNS = [5, 6, 7] as const

export const TICK_VOLUME = 0.39
export const CHIME_VOLUME = 0.56

export const TEXT = {
  pageTitle: 'Ruleta de premios',
  logoAlt: 'Transporte Medal',
  hintLine1: 'Toca para girar',
  hintLine2: 'la rueda',
  wheelLabel: 'Girar la rueda',
  editOptions: 'Editar opciones',
  mute: 'Silenciar',
  unmute: 'Activar sonido',
  resultTitle: 'Resultado:',
  remove: 'Quitar',
  close: 'Cerrar',
  optionsTitle: 'Opciones de la rueda',
  optionsHelp: 'Escribe una opción por línea.',
  optionsCount: (n: number) => `Entradas: ${n}`,
  save: 'Guardar',
  cancel: 'Cancelar',
  restoreDefaults: 'Restaurar opciones predeterminadas',
  copyLink: 'Copiar enlace',
  linkCopied: '¡Enlace copiado!',
  copyFailed: 'No se pudo copiar el enlace.',
  validation: 'Agrega al menos 2 opciones.',
  tooMany: 'Con más de 24 opciones los textos se verán muy pequeños.',
} as const
