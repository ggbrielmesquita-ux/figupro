'use client';

import { useState, useEffect } from 'react';
import { X, Download, Copy, CheckCheck, Instagram } from 'lucide-react';
import { Figurinha } from '@/types';

interface ModalFigurinhaProps {
  figurinha: Figurinha;
  onFechar: () => void;
}

export default function ModalFigurinha({ figurinha, onFechar }: ModalFigurinhaProps) {
  const [copiado, setCopiado] = useState(false);
  const [copiando, setCopiando] = useState(false);
  const [baixando, setBaixando] = useState(false);
  const [erroClipboard, setErroClipboard] = useState(false);

  // Fechar com ESC
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onFechar]);

  // Bloquear scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  async function handleCopiar() {
    if (copiando || copiado) return;
    setCopiando(true);
    setErroClipboard(false);

    try {
      const response = await fetch(figurinha.url);
      const blob = await response.blob();

      // Tenta copiar como image/png (necessário para clipboard)
      let blobParaCopiar = blob;
      if (blob.type !== 'image/png') {
        // Converte para PNG via canvas
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(blob);
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = objectUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(objectUrl);

        blobParaCopiar = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), 'image/png')
        );
      }

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blobParaCopiar }),
      ]);

      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
      setErroClipboard(true);
    } finally {
      setCopiando(false);
    }
  }

  async function handleBaixar() {
    if (baixando) return;
    setBaixando(true);

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
    } finally {
      setBaixando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onFechar}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md pointer-events-none" />

      {/* Modal */}
      <div
        className="relative z-10 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden max-w-lg w-full max-h-[90vh] flex flex-col shadow-[0_24px_80px_rgba(0,0,0,0.7)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-[#ff6b00]" />
            <span className="text-sm font-bold text-white">Visualizar Figurinha</span>
          </div>
          <button
            onClick={onFechar}
            className="p-1.5 rounded-lg text-[#606060] hover:text-white hover:bg-[#2a2a2a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Imagem */}
        <div className="flex-1 bg-[#111111] flex items-center justify-center p-6 min-h-[280px] max-h-[420px]">
          <img
            src={figurinha.url}
            alt={figurinha.nome}
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>

        {/* Nome */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-xs text-[#606060] truncate">{figurinha.nome}</p>
        </div>

        {/* Dica */}
        <div className="mx-5 mb-4">
          <div className="bg-[#ff6b00]/10 border border-[#ff6b00]/20 rounded-xl px-4 py-3 flex items-center gap-2">
            <Instagram className="w-4 h-4 text-[#ff6b00] flex-shrink-0" />
            <p className="text-xs text-[#ff6b00] font-semibold">
              Cole direto no Instagram! Copie e use nos stories ou direct.
            </p>
          </div>
        </div>

        {/* Erro clipboard */}
        {erroClipboard && (
          <div className="mx-5 mb-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">
            <p className="text-xs text-red-400">
              Não foi possível copiar automaticamente. Use o botão Baixar e importe manualmente.
            </p>
          </div>
        )}

        {/* Botões */}
        <div className="px-5 pb-5 flex gap-3">
          {/* Copiar */}
          <button
            onClick={handleCopiar}
            disabled={copiando || copiado}
            className={`
              flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-200 active:scale-[0.97]
              ${copiado
                ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] text-white'
                : 'bg-[#ff6b00] hover:bg-[#ff8c2a] shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)] text-white disabled:opacity-60'
              }
            `}
          >
            {copiando ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Copiando...
              </>
            ) : copiado ? (
              <>
                <CheckCheck className="w-5 h-5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                COPIAR
              </>
            )}
          </button>

          {/* Baixar */}
          <button
            onClick={handleBaixar}
            disabled={baixando}
            className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-bold text-sm border border-[#3a3a3a] hover:border-[#ff6b00]/40 text-[#a0a0a0] hover:text-white transition-all duration-200 active:scale-[0.97] disabled:opacity-60"
          >
            {baixando ? (
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Download className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
