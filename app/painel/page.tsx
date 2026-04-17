'use client';

import { Suspense, useDeferredValue, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, Folder, Search } from 'lucide-react';
import { usePainelData } from '@/components/PainelDataContext';
import CardFigurinha from '@/components/CardFigurinha';
import ModalFigurinha from '@/components/ModalFigurinha';
import { Figurinha } from '@/types';

function PainelConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categorias, categoriasError, categoriasLoading } = usePainelData();
  const categoriaSlug = searchParams.get('categoria');
  const subcategoriaSlug = searchParams.get('sub');

  const [figurinhas, setFigurinhas] = useState<Figurinha[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalFigurinha, setModalFigurinha] = useState<Figurinha | null>(null);
  const [erroFigurinhas, setErroFigurinhas] = useState<string | null>(null);
  const figurinhasCache = useRef(new Map<string, Figurinha[]>());
  const buscaDeferred = useDeferredValue(busca);

  const categoriaAtual = categorias.find((categoria) => categoria.slug === categoriaSlug);
  const subcategoriaAtual = categoriaAtual?.subcategorias.find(
    (subcategoria) => subcategoria.slug === subcategoriaSlug
  );

  const figurinhasFiltradas = figurinhas.filter((figurinha) =>
    figurinha.nome.toLowerCase().includes(buscaDeferred.toLowerCase())
  );

  useEffect(() => {
    setModalFigurinha(null);
  }, [categoriaSlug, subcategoriaSlug]);

  useEffect(() => {
    if (!categoriaSlug) {
      setFigurinhas([]);
      setErroFigurinhas(null);
      return;
    }

    const url = subcategoriaSlug
      ? `/api/figurinhas/${categoriaSlug}/${subcategoriaSlug}`
      : `/api/figurinhas/${categoriaSlug}`;
    const cached = figurinhasCache.current.get(url);

    if (cached) {
      setFigurinhas(cached);
      setErroFigurinhas(null);
      return;
    }

    const controller = new AbortController();
    let ativo = true;

    async function carregarFigurinhas() {
      setLoading(true);
      setErroFigurinhas(null);

      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });
        const text = await response.text();

        if (!ativo) {
          return;
        }

        if (!response.ok || text.startsWith('<')) {
          setFigurinhas([]);
          setErroFigurinhas(`HTTP ${response.status} - resposta invalida`);
          return;
        }

        const data = JSON.parse(text);
        const proximasFigurinhas = data.figurinhas || [];
        figurinhasCache.current.set(url, proximasFigurinhas);
        setFigurinhas(proximasFigurinhas);
        setErroFigurinhas(data.error || null);
      } catch (error) {
        if (!controller.signal.aborted && ativo) {
          setFigurinhas([]);
          setErroFigurinhas(error instanceof Error ? error.message : String(error));
        }
      } finally {
        if (ativo) {
          setLoading(false);
        }
      }
    }

    void carregarFigurinhas();

    return () => {
      ativo = false;
      controller.abort();
    };
  }, [categoriaSlug, subcategoriaSlug]);

  // Tela inicial - sem categoria selecionada
  if (!categoriaSlug) {
    return (
      <div className="p-6 md:p-10 lg:p-12 relative flex-1">
        {/* === MOMENTO WOW: BANNER === */}
        <div className="mb-10 w-full rounded-3xl overflow-hidden relative shadow-[0_30px_60px_rgba(255,106,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.15)] group">
           <div className="absolute inset-0 bg-gradient-to-r from-[#1c0d03] to-[#0a0a0a]"></div>
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
           {/* Efeitos de Luz no Banner */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff6a00]/30 blur-[100px] pointer-events-none group-hover:bg-[#ff6a00]/40 transition-colors duration-700"></div>
           
           <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 z-10">
              <div>
                 <div className="inline-block px-3 py-1 bg-[#ff6a00]/20 border border-[#ffb15c]/30 rounded-full text-[#ffb15c] text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-md">
                    Atualização Automática
                 </div>
                 <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">Novas Figurinhas Injetadas.</h2>
                 <p className="text-white/60 font-medium">Os últimos updates para os Lojistas e Experts já estão disponíveis na biblioteca.</p>
              </div>
              <button 
                 onClick={() => router.push('/painel?categoria=2026')} 
                 className="whitespace-nowrap px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 hover:bg-[#ff6a00] hover:text-white transition-all duration-300"
              >
                 Ver Lançamentos
              </button>
           </div>
        </div>

        {/* Header de Categorias */}
        <div className="mb-8 flex items-end justify-between">
          <div>
             <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter drop-shadow-md">
               Acesso aos <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-[#ffb15c]">Cofres.</span>
             </h1>
             <p className="text-white/50 text-base md:text-lg mt-2 font-light">
               Selecione os pacotes abaixo para desbloquear seu arsenal gráfico.
             </p>
          </div>
        </div>

        {/* Erro de conexao */}
        {categoriasError && (
          <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm font-mono break-all">
            Erro: {categoriasError}
          </div>
        )}

        {categoriasLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-[3px] border-[#ff6b00]/30 border-t-[#ff6b00] rounded-full animate-spin shadow-[0_0_15px_#ff6b00]" />
              <p className="text-[#a0a0a0] text-sm font-medium uppercase tracking-widest">Descriptografando cofres...</p>
            </div>
          </div>
        )}

        {/* Grid de categorias (PREMIUM) */}
        {!categoriasLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categorias.map((cat, idx) => (
              <button
                type="button"
                key={cat.slug}
                onClick={() => router.push(`/painel?categoria=${cat.slug}`)}
                className="group relative bg-[#111] overflow-hidden rounded-3xl border border-white/5 flex flex-col items-start gap-4 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] hover:-translate-y-2 cursor-pointer select-none text-left p-8"
                style={{ animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div 
                   className="absolute -top-20 -right-20 w-40 h-40 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                   style={{ backgroundColor: cat.cor }}
                ></div>

                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110 shadow-inner group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-10"
                  style={{ backgroundColor: `${cat.cor}1a`, border: `1px solid ${cat.cor}33` }}
                >
                  <Folder className="w-8 h-8" style={{ color: cat.cor }} />
                </div>
                
                <div className="mt-4 z-10 w-full relative">
                  <h3 className="text-white font-black text-xl tracking-tight mb-2 group-hover:text-[#ff6a00] transition-colors">
                    {cat.nome}
                  </h3>
                  <div className="flex items-center justify-between w-full">
                     <p className="text-white/40 text-sm font-medium">{cat.totalFigurinhas} items injetados</p>
                     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-white" />
                     </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col">
      {/* Header Interativo da Categoria */}
      <div className="flex flex-wrap lg:flex-nowrap lg:items-center gap-6 mb-8 bg-[#111] p-6 lg:p-8 rounded-3xl border border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col min-w-0 flex-1">
          {/* Breadcrumb Premium */}
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold tracking-wide uppercase mb-2">
            <button
              type="button"
              onClick={() => router.push('/painel')}
              className="text-[#606060] hover:text-[#ff6b00] transition-colors cursor-pointer"
            >
              Cofres
            </button>
            {categoriaAtual && (
              <>
                <ChevronRight className="w-4 h-4 text-[#404040]" />
                <button
                  type="button"
                  onClick={() => router.push(`/painel?categoria=${categoriaAtual.slug}`)}
                  className={`transition-colors cursor-pointer ${
                    subcategoriaAtual ? 'text-[#606060] hover:text-[#ff6b00]' : 'text-white'
                  }`}
                >
                  {categoriaAtual.nome}
                </button>
              </>
            )}
            {subcategoriaAtual && (
              <>
                <ChevronRight className="w-4 h-4 text-[#404040]" />
                <span className="text-[#ff6a00]">{subcategoriaAtual.nome}</span>
              </>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
             {subcategoriaAtual ? subcategoriaAtual.nome : categoriaAtual?.nome}
          </h1>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap items-center gap-4 w-full lg:w-auto mt-2 lg:mt-0">
          {/* Botao voltar */}
          {subcategoriaAtual && (
            <button
              type="button"
              onClick={() => router.push(`/painel?categoria=${categoriaSlug}`)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs rounded-xl border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
          )}

          {/* Busca Premium */}
          <div className="relative flex-1 lg:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060] group-focus-within:text-[#ff6a00] transition-colors" />
            <input
              type="text"
              placeholder="Pesquisar adesivo..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              className="w-full bg-black/40 border-2 border-[#2a2a2a] focus:border-[#ff6a00] rounded-xl pl-12 pr-4 py-3.5 text-sm font-bold text-white placeholder-white/30 outline-none transition-all focus:bg-[#1a1a1a] focus:shadow-[0_0_20px_rgba(255,106,0,0.15)]"
            />
          </div>
        </div>
      </div>

      {erroFigurinhas && (
        <div className="mb-4 bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm font-mono break-all">
          Erro: {erroFigurinhas}
        </div>
      )}

      {/* Subcategorias (se houver e nao estiver dentro de uma) */}
      {!subcategoriaAtual && categoriaAtual && categoriaAtual.subcategorias.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-[#606060] uppercase tracking-wider mb-3">
            Subpastas
          </p>
          <div className="flex flex-wrap gap-2">
            {categoriaAtual.subcategorias.map((sub) => (
              <button
                type="button"
                key={sub.slug}
                onClick={() => router.push(`/painel?categoria=${categoriaSlug}&sub=${sub.slug}`)}
                className="tap-safe flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#ff6b00] rounded-xl px-4 py-2.5 text-sm font-medium text-[#a0a0a0] hover:text-white transition-all hover:shadow-[0_0_12px_rgba(255,107,0,0.1)] cursor-pointer select-none caret-transparent"
              >
                <Folder className="w-4 h-4 text-[#ff6b00]" />
                {sub.nome}
                <span className="text-[#404040] text-xs">({sub.totalFigurinhas})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#606060] text-sm">Carregando figurinhas...</p>
          </div>
        </div>
      )}

      {/* Grid de figurinhas */}
      {!loading && figurinhasFiltradas.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#606060] text-sm">
              <span className="text-[#ff6b00] font-bold">{figurinhasFiltradas.length}</span>{' '}
              figurinhas
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
            {figurinhasFiltradas.map((figurinha) => (
              <CardFigurinha
                key={figurinha.url}
                figurinha={figurinha}
                onVisualizar={() => setModalFigurinha(figurinha)}
              />
            ))}
          </div>
        </>
      )}

      {/* Sem figurinhas */}
      {!loading && figurinhasFiltradas.length === 0 && figurinhas.length > 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Search className="w-12 h-12 text-[#2a2a2a] mx-auto mb-3" />
            <p className="text-[#606060]">
              Nenhuma figurinha encontrada para &quot;{busca}&quot;
            </p>
          </div>
        </div>
      )}

      {/* Estado vazio sem busca */}
      {!loading &&
        figurinhas.length === 0 &&
        categoriaAtual &&
        !subcategoriaAtual &&
        categoriaAtual.subcategorias.length > 0 &&
        !erroFigurinhas && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Folder className="w-12 h-12 text-[#2a2a2a] mx-auto mb-3" />
              <p className="text-[#a0a0a0] font-medium">Selecione uma subpasta</p>
              <p className="text-[#606060] text-sm mt-1">Esta categoria tem subpastas acima</p>
            </div>
          </div>
        )}

      {/* Estado vazio da pasta */}
      {!loading && figurinhas.length === 0 && categoriaAtual && subcategoriaAtual && !erroFigurinhas && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Folder className="w-12 h-12 text-[#2a2a2a] mx-auto mb-3" />
            <p className="text-[#a0a0a0] font-medium">Nenhuma figurinha encontrada</p>
            <p className="text-[#606060] text-sm mt-1">Essa pasta nao possui imagens disponiveis.</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalFigurinha && (
        <ModalFigurinha figurinha={modalFigurinha} onFechar={() => setModalFigurinha(null)} />
      )}
    </div>
  );
}

export default function PainelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="w-10 h-10 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PainelConteudo />
    </Suspense>
  );
}
