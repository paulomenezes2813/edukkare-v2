// Lista de avatares disponíveis (fallback)
export const AVATARS = [
  'alice.png', 'ana.png', 'arthur.png', 'davi.png', 'gabriel.png',
  'heitor.png', 'helena.png', 'joao.png', 'laura.png', 'lucas.png',
  'maria.png', 'miguel.png', 'pedro.png', 'sofia.png', 'valentina.png'
];

// Sistema de Cores - Design Clean e Moderno
export const COLORS = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  secondary: '#64748b',
  secondaryHover: '#475569',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  backgroundHover: '#f1f5f9',
  textPrimary: '#0f172a',
  textSecondary: '#1e293b',
  textTertiary: '#64748b',
  border: '#e2e8f0',
  borderHover: '#cbd5e1',
  // Cores específicas mantidas para diferenciação
  rubric: '#f59e0b', // Amarelo para rubricas
  rubricHover: '#d97706',
};

// Níveis de acesso
export const NIVEL_ACESSO = {
  ADMIN: 'ADMIN',
  ESTRATEGICO: 'ESTRATEGICO',
  OPERACIONAL: 'OPERACIONAL',
  PEDAGOGICO: 'PEDAGOGICO',
  NUCLEO_FAMILIAR: 'NUCLEO_FAMILIAR',
  PROFISSIONAIS_EXTERNOS: 'PROFISSIONAIS_EXTERNOS',
} as const;

export type NivelAcesso = typeof NIVEL_ACESSO[keyof typeof NIVEL_ACESSO];

