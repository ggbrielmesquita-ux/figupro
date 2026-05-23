'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState<'email' | 'senha' | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || 'Acesso negado. Verifique suas credenciais.');
        return;
      }

      router.push('/painel');
      router.refresh();
    } catch {
      setErro('Falha na comunicação. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* Background estático — zero JS, zero GPU de animação */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_50%,rgba(255,106,0,0.055)_0%,transparent_80%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_5%,transparent_100%)]" />
        <div className="absolute left-1/2 top-1/2 h-[280px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6a00]/[0.04] blur-[90px]" />
      </div>

      {/* Card — entrada leve só com opacity+y */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.06] bg-[#0a0a0a]/95 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.04)] backdrop-blur-md sm:p-10">

          {/* Linha especular no topo */}
          <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />

          {/* Logo */}
          <div className="mb-9 flex flex-col items-center text-center">
            <Image
              src="/stikz.png"
              alt="Stikz logo"
              width={160}
              height={46}
              priority
              className="mb-4 h-auto w-36 object-contain drop-shadow-[0_0_12px_rgba(255,106,0,0.22)]"
            />
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-6 bg-gradient-to-r from-transparent to-white/12" />
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/28">Ambiente Seguro</p>
              <div className="h-px w-6 bg-gradient-to-l from-transparent to-white/12" />
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-[0.12em] text-white/32">
                E-mail
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                    isFocused === 'email' ? 'text-[#ff6a00]' : 'text-white/22'
                  }`}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  required
                  placeholder="seu@acesso.com"
                  className="w-full rounded-2xl border border-white/[0.07] bg-[#060606] py-4 pl-12 pr-4 text-sm text-white placeholder-white/16 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-colors duration-200 focus:border-[#ff6a00]/40 focus:outline-none"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <div className="ml-1 flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.12em] text-white/32">
                  Senha
                </label>
                <Link
                  href="/esqueci-senha"
                  className="text-[10px] font-bold uppercase tracking-wider text-white/22 transition-colors hover:text-[#ff6a00]"
                >
                  Recuperar?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className={`absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                    isFocused === 'senha' ? 'text-[#ff6a00]' : 'text-white/22'
                  }`}
                />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onFocus={() => setIsFocused('senha')}
                  onBlur={() => setIsFocused(null)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/[0.07] bg-[#060606] py-4 pl-12 pr-12 text-sm tracking-widest text-white placeholder-white/16 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] transition-colors duration-200 focus:border-[#ff6a00]/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/22 transition-colors hover:text-white/60 focus:outline-none"
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Erro */}
            <div className="min-h-[18px]">
              {erro && (
                <p className="animate-fade-in text-center text-xs font-semibold text-[#ff4444]">
                  {erro}
                </p>
              )}
            </div>

            {/* Botão submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-[#ff7a1a] to-[#cc5600] py-4 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_rgba(255,106,0,0.18)] transition-all duration-200 hover:shadow-[0_12px_28px_rgba(255,106,0,0.32)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                  <span>Autenticando…</span>
                </>
              ) : (
                <>
                  <span>Entrar no Arsenal</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 space-y-1.5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/16">Stikz V2.0</p>
          <p className="text-[9px] uppercase tracking-widest text-[#222]">© {new Date().getFullYear()} Todos os Direitos Reservados.</p>
        </div>
      </motion.div>
    </div>
  );
}
