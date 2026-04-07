'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Zap, ArrowLeft, CheckCircle } from 'lucide-react';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/esqueci-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setEnviado(true);
      } else {
        const data = await res.json();
        setErro(data.error || 'Erro ao processar');
      }
    } catch {
      setErro('Erro de conexão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#ff6b00] opacity-[0.03] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
          {/* Logo */}
          <div className="text-center mb-8 flex flex-col items-center">
            <img src="/stikz.png" alt="stikz logo" className="w-40 h-auto object-contain mb-2" />
            <p className="text-[#606060] text-sm mt-2">
              Enviaremos um link para seu email
            </p>
          </div>

          {enviado ? (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-semibold">Email enviado!</p>
              <p className="text-[#a0a0a0] text-sm">
                Se este email estiver cadastrado, você receberá as instruções em instantes.
                Verifique também a caixa de spam.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-[#ff6b00] hover:text-[#ff8c2a] transition-colors mt-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider">
                  Email cadastrado
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seu@email.com"
                    className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-[#404040] text-sm focus:outline-none focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)] transition-all"
                  />
                </div>
              </div>

              {erro && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {erro}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff6b00] hover:bg-[#ff8c2a] disabled:opacity-50 text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)]"
              >
                {loading ? 'Enviando...' : 'ENVIAR LINK'}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm text-[#606060] hover:text-[#ff6b00] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
