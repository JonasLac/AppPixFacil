// Constantes da aplicação

export const APP_CONFIG = {
  name: 'Pix Fácil',
  version: '1.1.0',
  description: 'Simplifique seus pagamentos Pix',
  author: 'Pix Fácil Team',
  repository: 'https://github.com/seu-usuario/pix-facil',
} as const;

export const PIX_LIMITS = {
  minAmount: 0.01,
  maxAmount: 50000,
  maxDescriptionLength: 140,
  maxKeysPerUser: 20,
} as const;

export const QR_CODE_CONFIG = {
  size: 256,
  level: 'M' as const,
  includeMargin: true,
  defaultExpiration: 3600, // 1 hora em segundos
} as const;

export const STORAGE_KEYS = {
  pixKeys: 'pix-keys',
  transactions: 'pix-transactions',
  settings: 'pix-settings',
  backup: 'pix-backup',
} as const;

export const PIX_KEY_TYPES = [
  { value: 'cpf', label: 'CPF', icon: 'user' },
  { value: 'cnpj', label: 'CNPJ', icon: 'building' },
  { value: 'email', label: 'E-mail', icon: 'mail' },
  { value: 'phone', label: 'Telefone', icon: 'phone' },
  { value: 'random', label: 'Chave Aleatória', icon: 'hash' },
  { value: 'manual', label: 'Chave Manual', icon: 'edit' },
] as const;

export const TRANSACTION_STATUS = {
  pending: { label: 'Pendente', color: 'yellow' },
  completed: { label: 'Concluída', color: 'green' },
  cancelled: { label: 'Cancelada', color: 'red' },
} as const;

export const NOTIFICATION_TYPES = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
} as const;

export const ROUTES = {
  home: '/',
  generateQR: '/gerar-qr',
  history: '/historico',
  settings: '/configuracoes',
  help: '/ajuda',
  about: '/sobre',
} as const;

export const ANIMATIONS = {
  fadeIn: 'fade-in 0.3s ease-out',
  slideUp: 'slide-up 0.3s ease-out',
  bounce: 'bounce 0.5s ease-out',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;