'use client';

import { createContext, useContext } from 'react';
import { Categoria } from '@/types';

type PainelUsuario = {
  nome: string | null;
  email: string;
} | null;

type PainelDataContextValue = {
  categorias: Categoria[];
  categoriasError: string | null;
  categoriasLoading: boolean;
  usuario: PainelUsuario;
};

const PainelDataContext = createContext<PainelDataContextValue | null>(null);

interface PainelDataProviderProps {
  children: React.ReactNode;
  value: PainelDataContextValue;
}

export function PainelDataProvider({ children, value }: PainelDataProviderProps) {
  return <PainelDataContext.Provider value={value}>{children}</PainelDataContext.Provider>;
}

export function usePainelData() {
  const context = useContext(PainelDataContext);

  if (!context) {
    throw new Error('usePainelData precisa ser usado dentro de PainelDataProvider');
  }

  return context;
}
