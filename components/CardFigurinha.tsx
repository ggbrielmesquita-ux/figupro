'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { Figurinha } from '@/types';

interface CardFigurinhaProps {
  figurinha: Figurinha;
  onVisualizar: () => void;
}

export default function CardFigurinha({ figurinha, onVisualizar }: CardFigurinhaProps) {
  const [imageError, setImageError] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  return (
    <div
      className="group relative bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#ff6b00]/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,107,0,0.12)] hover:-translate-y-0.5"
      onClick={onVisualizar}
    >
      {/* Imagem */}
      <div className="aspect-square relative bg-[#111111] flex items-center justify-center">
        {!imageError ? (
          <Image
            src={figurinha.url}
            alt={figurinha.nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 20vw, 16vw"
            className="object-contain p-2 transition-transform duration-200 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#2a2a2a]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
              <path strokeLinecap="round" strokeWidth="2" d="M3 9l4-4 4 4 4-4 4 4" />
            </svg>
            <span className="text-xs">Erro</span>
          </div>
        )}

        {/* Overlay hover com botões */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onVisualizar(); }}
            className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg backdrop-blur-sm transition-all"
            title="Visualizar"
          >
            <Eye className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={handleDownload}
            className="p-2 bg-[#ff6b00] hover:bg-[#ff8c2a] rounded-lg transition-all"
            title="Baixar"
            disabled={downloading}
          >
            {downloading ? (
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Download className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>


    </div>
  );
}
