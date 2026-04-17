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
      <div className="px-5 pt-8 pb-3">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Cofres de Acesso</p>
      </div>

      {/* Lista de categorias */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
        {categorias.map((cat) => {
          const Icone = ICONE_MAP[cat.icone] || Folder;
          const isAtiva = categoriaAtiva === cat.slug;
          const temSubs = cat.subcategorias.length > 0;
          const expandida = expandidas.has(cat.slug);

          return (
            <div key={cat.slug} className="mb-2">
              <div
                className={`
                  relative flex items-center gap-2 rounded-2xl select-none caret-transparent
                  transition-all duration-300 group overflow-hidden border
                  ${isAtiva
                    ? 'bg-[#1a1a1a] border-[#ff6b00]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_0_20px_rgba(255,107,0,0.1)]'
                    : 'bg-transparent border-transparent hover:bg-[#151515] hover:border-white/5'}
                `}
              >
                {/* Indicador de Selecao Laterais */}
                <div 
                   className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-md transition-all duration-300 ${isAtiva ? 'bg-gradient-to-b from-[#ff822b] to-[#cc5600] opacity-100 shadow-[0_0_15px_#ff6a00]' : 'bg-white/20 opacity-0 group-hover:opacity-100 h-4'}`}
                />
                
                {/* Glow de Fundo Hover */}
                <div className={`absolute inset-0 bg-gradient-to-r from-[${cat.cor}]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500`}></div>

                <button
                  type="button"
                  onClick={() => irParaCategoria(cat.slug, temSubs)}
                  className="tap-safe flex min-w-0 flex-1 items-center gap-4 px-4 py-3.5 text-left group-hover:translate-x-1 transition-transform duration-300"
                >
                  <div className="relative">
                     {/* Orb/Glow Behind Icon */}
                     {isAtiva && <div className="absolute inset-0 blur-md opacity-50 scale-150 rounded-full" style={{ backgroundColor: cat.cor }}></div>}
                     
                     <div
                       className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 relative z-10 shadow-inner"
                       style={{
                         background: isAtiva 
                           ? `radial-gradient(circle at top left, ${cat.cor}50, ${cat.cor}10)`
                           : `radial-gradient(circle at top left, rgba(255,255,255,0.1), rgba(255,255,255,0.02))`,
                         border: `1px solid ${isAtiva ? cat.cor + '40' : 'rgba(255,255,255,0.05)'}`
                       }}
                     >
                       <Icone 
                         className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-all" 
                         style={{ 
                            color: isAtiva ? '#ffffff' : cat.cor,
                            fill: isAtiva ? '#ffffff' : `${cat.cor}40`
                         }} 
                       />
                     </div>
                  </div>

                  <span className={`flex-1 text-[13px] font-bold tracking-wide truncate transition-colors ${isAtiva ? 'text-white drop-shadow-md' : 'text-white/60 group-hover:text-white'}`}>
                     {cat.nome}
                  </span>
                </button>

                {temSubs ? (
                  <button
                    type="button"
                    aria-label={expandida ? `Recolher ${cat.nome}` : `Expandir ${cat.nome}`}
                    onClick={() => toggleExpandida(cat.slug)}
                    className="tap-safe mr-2 p-2 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors relative z-20"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expandida ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <span className="pr-4 text-[10px] font-black tracking-widest text-[#ff6a00]/70 group-hover:text-[#ff6a00] transition-colors">
                    {cat.totalFigurinhas}
                  </span>
                )}
              </div>

              {/* Subcategorias Premium */}
              <div 
                 className={`overflow-hidden transition-all duration-300 ease-in-out ${temSubs && expandida ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}
              >
                <div className="ml-9 border-l-2 border-[#1a1a1a] pl-2 space-y-1 relative before:content-[''] before:absolute before:top-0 before:-left-[2px] before:w-[2px] before:h-8 before:bg-gradient-to-b before:from-[#ff6a00]/50 before:to-transparent">
                  <button
                    type="button"
                    onClick={() => irParaCategoria(cat.slug)}
                    className={`
                      tap-safe w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all select-none caret-transparent hover:translate-x-1
                      ${isAtiva && !subcategoriaAtiva
                        ? 'text-[#ff6a00] drop-shadow-sm'
                        : 'text-white/40 hover:text-white'}
                    `}
                  >
                    <span>Ver Todo o Arsenal</span>
                  </button>

                  {cat.subcategorias.map((sub) => {
                    const isSubAtiva = categoriaAtiva === cat.slug && subcategoriaAtiva === sub.slug;

                    return (
                      <button
                        key={sub.slug}
                        type="button"
                        onClick={() => irParaSubcategoria(cat.slug, sub.slug)}
                        className={`
                          tap-safe w-full text-left flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all select-none caret-transparent hover:translate-x-1
                          ${isSubAtiva
                            ? 'text-white bg-gradient-to-r from-white/10 to-transparent border border-white/5 shadow-inner'
                            : 'text-white/40 hover:text-white hover:bg-[#1a1a1a]'}
                        `}
                      >
                        <span className="truncate">{sub.nome}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full ${isSubAtiva ? 'bg-[#ff6a00] text-black font-black' : 'bg-[#1a1a1a] text-white/30'}`}>
                          {sub.totalFigurinhas}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Rodape com perfil e logout Otimizado/Premium */}
      <div className="p-4 space-y-2 bg-gradient-to-t from-[#050505] to-transparent">
        <Link
          href="/perfil"
          className="relative flex items-center gap-4 px-4 py-3 rounded-2xl border border-white/5 bg-[#111] shadow-[0_10px_20px_rgba(0,0,0,0.4),_inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-[#ff6a00]/30 hover:bg-[#151515] hover:-translate-y-1 transition-all group overflow-hidden"
        >
          {/* Orb Back */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#ff6a00]/10 blur-[30px] rounded-full pointer-events-none group-hover:bg-[#ff6a00]/20 transition-colors"></div>
          
          <div className="w-10 h-10 bg-gradient-to-b from-[#222] to-[#111] shadow-inner border border-white/10 group-hover:border-[#ff6b00]/60 rounded-full flex items-center justify-center flex-shrink-0 transition-colors relative z-10">
            <User className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" fill="var(--tw-colors-white)/0.2" />
          </div>
          <div className="flex-1 min-w-0 relative z-10">
            <p className="text-sm font-black tracking-tight truncate text-white group-hover:text-[#ff6a00] transition-colors">{usuario?.nome || 'Meu Perfil'}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest truncate">{usuario?.email || ''}</p>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="tap-safe w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-500/10 text-[#606060] hover:text-red-400 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-transparent transition-all group"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-black uppercase tracking-widest relative">Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
}
