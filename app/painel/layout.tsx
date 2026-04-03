'use client';

import { useEffect, useState, Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import { Categoria } from '@/types';

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  useEffect(() => {
    fetch('/api/figurinhas')
      .then((r) => r.json())
      .then((data) => setCategorias(data.categorias || []));
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      {/* Overlay mobile */}
      {sidebarAberta && (
        <div
          className="fixed inset-0 bg-black/70 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarAberta(false)}
        />
      )}

      {/* Sidebar */}
      <Suspense fallback={<div className="w-64 bg-[#111111] border-r border-[#1a1a1a]" />}>
        <Sidebar
          categorias={categorias}
          aberta={sidebarAberta}
          onFechar={() => setSidebarAberta(false)}
        />
      </Suspense>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header mobile com botão menu */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] bg-[#0a0a0a]">
          <button
            onClick={() => setSidebarAberta(true)}
            className="p-2 rounded-lg text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-black text-sm">
            <span className="text-white">FIGURINHAS</span>
            <span className="text-[#ff6b00]"> PRO</span>
          </span>
        </div>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
