export interface Usuario {
  id: string;
  email: string;
  nome: string | null;
  whatsapp: string | null;
  data_criacao: string;
  data_expiracao: string | null;
  status: 'ativo' | 'inativo' | 'pendente';
  role: 'user' | 'admin';
}

export interface JWTPayload {
  sub: string;
  email: string;
  nome: string | null;
  role: string;
  iat?: number;
  exp?: number;
}

export interface Categoria {
  nome: string;
  slug: string;
  icone: string;
  cor: string;
  subcategorias: Subcategoria[];
  totalFigurinhas: number;
}

export interface Subcategoria {
  nome: string;
  slug: string;
  totalFigurinhas: number;
}

export interface Figurinha {
  nome: string;
  url: string;
  tipo: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}
