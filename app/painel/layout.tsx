'use client';

import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { PainelDataProvider } from '@/components/PainelDataContext';
import Sidebar from '@/components/Sidebar';
import { Categoria } from '@/types';

function PainelLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriasError, setCategoriasError] = useState<string | null>(null);
  const [categoriasLoading, setCategoriasLoading] = useState(true);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [usuario, setUsuario] = useState<{ nome: string | null; email: string } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let ativo = true;

    async function carregarCategorias() {
      try {
        const response = await fetch('/api/figurinhas', {
          signal: controller.signal,
        });
        const text = await response.text();

        if (!ativo) {
          return;
        }

        if (!response.ok || text.startsWith('<')) {
          setCategorias([]);
          setCategoriasError(`HTTP ${response.status} - resposta invalida`);
          return;
        }

        const data = JSON.parse(text);
        setCategorias(data.categorias || []);
        setCategoriasError(data.error || null);
      } catch (error) {
        if (!controller.signal.aborted && ativo) {
          setCategorias([]);
          setCategoriasError(error instanceof Error ? error.message : String(error));
        }
      } finally {
        if (ativo) {
          setCategoriasLoading(false);
        }
      }
    }

    async function carregarUsuario() {
      try {
        const response = await fetch('/api/auth/me', {
          signal: controller.signal,
        });

        if (!response.ok) {
          return;
        }

        const text = await response.text();
        if (!ativo || text.startsWith('<')) {
          return;
        }

        const data = JSON.parse(text);
        if (data.usuario) {
          setUsuario(data.usuario);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Erro ao carregar usuario:', error);
        }
      }
    }

    void Promise.all([carregarCategorias(), carregarUsuario()]);

    return () => {
      ativo = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    setSidebarAberta(false);
  }, [pathname, searchParams]);

  return (
    <PainelDataProvider
      value={{
        categorias,
        categoriasError,
        categoriasLoading,
        usuario,
      }}
    >
      <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
        {sidebarAberta && (
          <div
            className="fixed inset-0 bg-black/70 z-20 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarAberta(false)}
          />
        )}

        <Sidebar
          categorias={categorias}
          aberta={sidebarAberta}
          onFechar={() => setSidebarAberta(false)}
          usuario={usuario}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="lg:hidden relative z-10 flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] bg-[#0a0a0a]">
            <button
              type="button"
              onClick={() => setSidebarAberta(true)}
              className="tap-safe p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Image
              src="/stikz.png"
              alt="stikz logo"
              width={80}
              height={24}
              priority
              className="w-20 h-auto object-contain"
            />
          </div>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </PainelDataProvider>
  );
}

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-screen bg-[#0a0a0a]" />}>
      <PainelLayoutShell>{children}</PainelLayoutShell>
    </Suspense>
  );
}
