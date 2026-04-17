'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Download, Eye, Copy, CheckCircle2 } from 'lucide-react';
import { Figurinha } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface CardFigurinhaProps {
  figurinha: Figurinha;
  onVisualizar: () => void;
}

export default function CardFigurinha({ figurinha, onVisualizar }: CardFigurinhaProps) {
  const [imageError, setImageError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copiando, setCopiando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Determinando tags visuais de forma pseudo-aleatória estável baseada no nome
  const charSum = figurinha.nome.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const isNew = charSum % 4 === 0;
  const isPopular = charSum % 5 === 0 && !isNew;

  async function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    if (downloading) return;
    setDownloading(true);

    try {
      const res = await fetch(figurinha.url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = figurinha.nome;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar:', err);
    } finally {
      setDownloading(false);
    }
  }

  async function handleCopiar(e: React.MouseEvent) {
    e.stopPropagation();
    if (copiando || copiado) return;
    setCopiando(true);

    try {
      const res = await fetch(figurinha.url);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      // Fallback
      alert('Seu navegador nao suporta a copia direta da imagem.');
    } finally {
      setCopiando(false);
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] border border-white/5 hover:border-[#ff6a00]/40 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_20px_40px_rgba(255,106,0,0.15),_inset_0_1px_1px_rgba(255,255,255,0.1)]"
      onClick={onVisualizar}
    >
      {/* Luz interna no hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#ff6a00]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

      {/* Imagem */}
      <div className="aspect-square relative flex items-center justify-center p-4 z-10">
        
        {/* Status Tags */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
           {isNew && (
             <span className="bg-[#ff6a00] text-black text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm drop-shadow-md">NOVO</span>
           )}
           {isPopular && (
             <span className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm drop-shadow-md">POPULAR</span>
           )}
        </div>

        {!imageError ? (
          <Image
            src={figurinha.url}
            alt={figurinha.nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 20vw, 16vw"
            className="object-contain p-4 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M3 9l4-4 4 4 4-4 4 4" />
            </svg>
            <span className="text-xs">Erro</span>
          </div>
        )}

        {/* Overlay hover com botões */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
          
          <button
            onClick={handleCopiar}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ff822b] to-[#cc5600] hover:from-[#ff9f5a] hover:to-[#ff6a00] text-white rounded-xl shadow-[0_10px_20px_rgba(255,106,0,0.4)] transition-all font-black uppercase text-xs tracking-wider transform hover:scale-105 active:scale-95"
          >
            {copiando ? (
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : copiado ? (
              <>
                 <CheckCircle2 className="w-4 h-4" /> Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copiar 
              </>
            )}
          </button>

          <div className="flex gap-2">
             <button
               onClick={(e) => { e.stopPropagation(); onVisualizar(); }}
               className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl backdrop-blur-md transition-all text-white/70 hover:text-white"
               title="Visualizar Detalhes"
             >
               <Eye className="w-4 h-4" />
             </button>
             <button
               onClick={handleDownload}
               className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl backdrop-blur-md transition-all text-white/70 hover:text-white disabled:opacity-50"
               title="Baixar Manualmente"
               disabled={downloading}
             >
               {downloading ? (
                 <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                 </svg>
               ) : (
                 <Download className="w-4 h-4" />
               )}
             </button>
          </div>
        </div>
      </div>

      {/* Toast de Sucesso Absoluto (Copiado) Flutuante */}
      <AnimatePresence>
         {copiado && (
            <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }}
               className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#22c55e] text-white text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)] z-30 pointer-events-none flex items-center gap-1.5"
            >
               <CheckCircle2 className="w-3 h-3" /> Copiado!
            </motion.div>
         )}
      </AnimatePresence>

    </motion.div>
  );
}
