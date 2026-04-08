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
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">
            Todas as <span className="text-[#ff6b00]">Categorias</span>
          </h1>
          <p className="text-[#606060] text-sm mt-1">
            Selecione uma categoria para ver as figurinhas
          </p>
        </div>

        {/* Erro de conexao */}
        {categoriasError && (
          <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm font-mono break-all">
            Erro: {categoriasError}
          </div>
        )}

        {categoriasLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#606060] text-sm">Carregando categorias...</p>
            </div>
          </div>
        )}

        {/* Grid de categorias */}
        {!categoriasLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {categorias.map((cat) => (
              <div
                key={cat.slug}
                onClick={() => router.push(`/painel?categoria=${cat.slug}`)}
                className="group bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#ff6b00] rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,107,0,0.15)] hover:-translate-y-0.5 cursor-pointer select-none caret-transparent"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: `${cat.cor}20`, boxShadow: `0 0 12px ${cat.cor}30` }}
                >
                  <Folder className="w-6 h-6" style={{ color: cat.cor }} />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-xs leading-tight line-clamp-2">
                    {cat.nome}
                  </p>
                  <p className="text-[#606060] text-xs mt-1">{cat.totalFigurinhas} figurinhas</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2 min-w-0">
          {/* Breadcrumb e voltar */}
          <div className="flex items-center gap-1.5 text-sm flex-wrap">
            <span
              onClick={() => router.push('/painel')}
              className="text-[#606060] hover:text-[#ff6b00] transition-colors cursor-pointer"
            >
              Figurinhas
            </span>
            {categoriaAtual && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#404040]" />
                <span
                  onClick={() => router.push(`/painel?categoria=${categoriaAtual.slug}`)}
                  className={`font-semibold transition-colors cursor-pointer ${
                    subcategoriaAtual ? 'text-[#606060] hover:text-[#ff6b00]' : 'text-white'
                  }`}
                >
                  {categoriaAtual.nome}
                </span>
              </>
            )}
            {subcategoriaAtual && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#404040]" />
                <span className="text-white font-semibold">{subcategoriaAtual.nome}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:ml-auto">
          {/* Botao voltar */}
          {subcategoriaAtual && (
            <span
              onClick={() => router.push(`/painel?categoria=${categoriaSlug}`)}
              className="flex items-center gap-1.5 text-sm text-[#a0a0a0] hover:text-white border border-[#2a2a2a] hover:border-[#3a3a3a] rounded-lg px-3 py-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </span>
          )}

          {/* Busca */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
            <input
              type="text"
              placeholder="Buscar..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              className="w-full sm:w-52 bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#ff6b00] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#404040] outline-none transition-all"
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
              <div
                key={sub.slug}
                onClick={() => router.push(`/painel?categoria=${categoriaSlug}&sub=${sub.slug}`)}
                className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#ff6b00] rounded-xl px-4 py-2.5 text-sm font-medium text-[#a0a0a0] hover:text-white transition-all hover:shadow-[0_0_12px_rgba(255,107,0,0.1)] cursor-pointer select-none caret-transparent"
              >
                <Folder className="w-4 h-4 text-[#ff6b00]" />
                {sub.nome}
                <span className="text-[#404040] text-xs">({sub.totalFigurinhas})</span>
              </div>
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
