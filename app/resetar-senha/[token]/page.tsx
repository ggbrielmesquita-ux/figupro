'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Zap, CheckCircle } from 'lucide-react';

export default function ResetarSenhaPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/resetar-senha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha }),
      });

      const data = await res.json();

      if (res.ok) {
        setSucesso(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setErro(data.error || 'Erro ao redefinir senha');
      }
    } catch {
      setErro('Erro de conexão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <div className="relative w-full max-w-md animate-fade-in">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
          {/* Logo */}
          <div className="text-center mb-8 flex flex-col items-center">
            <img src="/stikz.png" alt="stikz logo" className="w-40 h-auto object-contain mb-2" />
          </div>

          {sucesso ? (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-white font-semibold">Senha alterada!</p>
              <p className="text-[#a0a0a0] text-sm">Redirecionando para o login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nova senha */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider">
                  Nova senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
                  <input
                    type={mostrar ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    required
                    minLength={6}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl pl-10 pr-12 py-3.5 text-white placeholder-[#404040] text-sm focus:outline-none focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrar(!mostrar)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606060] hover:text-[#a0a0a0]"
                  >
                    {mostrar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
                  <input
                    type={mostrar ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required
                    placeholder="Repita a senha"
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
                className="w-full bg-[#ff6b00] hover:bg-[#ff8c2a] disabled:opacity-50 text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,107,0,0.3)]"
              >
                {loading ? 'Salvando...' : 'SALVAR NOVA SENHA'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
