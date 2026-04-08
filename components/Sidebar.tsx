'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Bike,
  CalendarDays,
  Car,
  ChevronDown,
  Folder,
  Gift,
  Globe,
  Layers,
  LogOut,
  Moon,
  Navigation,
  Scissors,
  ShoppingBag,
  Smile,
  Sun,
  Sunset,
  TrendingUp,
  User,
  X,
  Zap,
} from 'lucide-react';
import { Categoria } from '@/types';

const ICONE_MAP: Record<string, React.ElementType> = {
  Folder,
  Sun,
  Moon,
  Smile,
  Bike,
  Car,
  Layers,
  Globe,
  TrendingUp,
  Gift,
  ShoppingBag,
  Scissors,
  Navigation,
  CalendarDays,
  Sunset,
  Zap,
};

interface SidebarProps {
  categorias: Categoria[];
  aberta: boolean;
  onFechar: () => void;
  usuario: { nome: string | null; email: string } | null;
}

export default function Sidebar({ categorias, aberta, onFechar, usuario }: SidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoriaAtiva = searchParams.get('categoria');
  const subcategoriaAtiva = searchParams.get('sub');
  const [expandidas, setExpandidas] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (categoriaAtiva) {
      setExpandidas((prev) => new Set([...prev, categoriaAtiva]));
    }
  }, [categoriaAtiva]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  function toggleExpandida(slug: string) {
    setExpandidas((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  function irParaCategoria(slug: string, expandir = false) {
    if (expandir) {
      setExpandidas((prev) => new Set([...prev, slug]));
    }

    router.push(`/painel?categoria=${slug}`);
    onFechar();
  }

  function irParaSubcategoria(categoriaSlug: string, subcategoriaSlug: string) {
    router.push(`/painel?categoria=${categoriaSlug}&sub=${subcategoriaSlug}`);
    onFechar();
  }

  return (
    <aside
      className={`
        fixed lg:relative inset-y-0 left-0 z-30
        w-72 lg:w-64 xl:w-72
        flex flex-col
        bg-[#111111] border-r border-[#1a1a1a]
        transition-transform duration-300 ease-out
        ${aberta ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#1a1a1a]">
        <Link href="/painel" className="flex items-center gap-2.5 mx-auto">
          <Image
            src="/stikz.png"
            alt="stikz logo"
            width={112}
            height={32}
            priority
            className="w-28 h-auto object-contain"
          />
        </Link>
        <button
          type="button"
          onClick={onFechar}
          className="tap-safe lg:hidden p-1.5 rounded-lg text-[#606060] hover:text-white hover:bg-[#1a1a1a] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Label categorias */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-[10px] font-bold text-[#404040] uppercase tracking-widest">Categorias</p>
      </div>

      {/* Lista de categorias */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {categorias.map((cat) => {
          const Icone = ICONE_MAP[cat.icone] || Folder;
          const isAtiva = categoriaAtiva === cat.slug;
          const temSubs = cat.subcategorias.length > 0;
          const expandida = expandidas.has(cat.slug);

          return (
            <div key={cat.slug}>
              <div
                className={`
                  relative flex items-center gap-2 rounded-xl select-none caret-transparent
                  transition-all duration-150 group
                  ${isAtiva
                    ? 'bg-[#ff6b00]/15 text-white'
                    : 'text-[#a0a0a0] hover:bg-[#1a1a1a] hover:text-white'}
                `}
              >
                {isAtiva && <div className="absolute left-0 w-0.5 h-6 bg-[#ff6b00] rounded-r-full" />}

                <button
                  type="button"
                  onClick={() => irParaCategoria(cat.slug, temSubs)}
                  className="tap-safe flex min-w-0 flex-1 items-center gap-2.5 px-3 py-2.5 text-left"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      backgroundColor: isAtiva ? `${cat.cor}30` : `${cat.cor}15`,
                      boxShadow: isAtiva ? `0 0 10px ${cat.cor}40` : 'none',
                    }}
                  >
                    <Icone className="w-4 h-4" style={{ color: cat.cor }} />
                  </div>

                  <span className="flex-1 text-sm font-semibold truncate">{cat.nome}</span>
                </button>

                {temSubs ? (
                  <button
                    type="button"
                    aria-label={expandida ? `Recolher ${cat.nome}` : `Expandir ${cat.nome}`}
                    onClick={() => toggleExpandida(cat.slug)}
                    className="tap-safe mr-1 p-1 rounded-md text-[#404040] hover:text-[#a0a0a0] hover:bg-[#202020] transition-colors"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        expandida ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <span className="pr-3 text-[10px] text-[#404040] font-medium">
                    {cat.totalFigurinhas}
                  </span>
                )}
              </div>

              {temSubs && expandida && (
                <div className="ml-6 mt-0.5 space-y-0.5 border-l border-[#2a2a2a] pl-3">
                  <button
                    type="button"
                    onClick={() => irParaCategoria(cat.slug)}
                    className={`
                      tap-safe w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-colors select-none caret-transparent
                      ${isAtiva && !subcategoriaAtiva
                        ? 'text-[#ff6b00] font-semibold'
                        : 'text-[#606060] hover:text-[#a0a0a0]'}
                    `}
                  >
                    <span>Todos</span>
                  </button>

                  {cat.subcategorias.map((sub) => {
                    const isSubAtiva = categoriaAtiva === cat.slug && subcategoriaAtiva === sub.slug;

                    return (
                      <button
                        key={sub.slug}
                        type="button"
                        onClick={() => irParaSubcategoria(cat.slug, sub.slug)}
                        className={`
                          tap-safe w-full text-left flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs transition-all select-none caret-transparent
                          ${isSubAtiva
                            ? 'text-[#ff6b00] font-semibold bg-[#ff6b00]/10'
                            : 'text-[#606060] hover:text-[#a0a0a0] hover:bg-[#1a1a1a]'}
                        `}
                      >
                        <span className="truncate">{sub.nome}</span>
                        <span className="text-[#404040] text-[10px] flex-shrink-0">
                          {sub.totalFigurinhas}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Rodape com perfil e logout */}
      <div className="border-t border-[#1a1a1a] p-3 space-y-1">
        <Link
          href="/perfil"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#a0a0a0] hover:text-white hover:bg-[#1a1a1a] transition-all group"
        >
          <div className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] group-hover:border-[#ff6b00]/40 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-white">{usuario?.nome || 'Meu Perfil'}</p>
            <p className="text-[10px] text-[#404040] truncate">{usuario?.email || ''}</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="tap-safe w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#606060] hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
