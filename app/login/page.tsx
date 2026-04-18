'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
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
      
      {/* ------------------------------------------------------------- */}
      {/* BACKGROUND PREMIUM SCENE (Cinematic Deep Space)               */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        
        {/* Camada 1: Deep Ambient Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,106,0,0.06)_0%,rgba(0,0,0,0)_80%)]"></div>

        {/* Camada 2: Glow Radial Duplo (Respiração e Rotação) */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[800px] h-[400px] bg-[#ff6a00] rounded-full blur-[200px] mix-blend-screen opacity-10"
        ></motion.div>
        
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] bg-[#ffb15c] rounded-full blur-[200px] mix-blend-screen opacity-10"
        ></motion.div>

        {/* Camada 3: Linhas Finas Varrendo a Tela (Cinematic Scanning Lines) */}
        <motion.div 
           initial={{ y: "-100%" }}
           animate={{ y: "200%" }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute top-0 left-0 w-full h-[30vh] bg-gradient-to-b from-transparent via-[#ff6a00]/[0.03] to-transparent blur-md"
        ></motion.div>

        {/* Camada 4: Grid Tecnológico UltraFino */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_10%,transparent_100%)] opacity-70"></div>

        {/* Camada 5: Partículas Cinematográficas (Menores e mais sofisticadas) */}
        <div className="absolute inset-0 overflow-hidden">
           {[...Array(12)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ 
                 y: Math.random() * 100 + "vh", 
                 x: Math.random() * 100 + "vw", 
                 opacity: 0,
                 scale: Math.random() * 0.5 + 0.5
               }}
               animate={{ 
                 y: [null, Math.random() * -100 + "vh"],
                 x: [null, Math.random() * 100 + "vw"],
                 opacity: [0, Math.random() * 0.5, 0]
               }}
               transition={{ 
                 duration: 10 + Math.random() * 30, 
                 repeat: Infinity, 
                 delay: Math.random() * 5,
                 ease: "easeInOut"
               }}
               className="absolute w-1 h-1 bg-[#ffb15c] rounded-full blur-[2px] mix-blend-screen"
             ></motion.div>
           ))}
        </div>

        {/* Camada 6: Assinatura Visual Luminosa (Símbolo Abstrato STIKZ animando) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[600px] h-[600px] flex items-center justify-center opacity-[0.05] text-[#ff6a00] mix-blend-screen overflow-hidden pointer-events-none">
           {/* Formato do bolt/S desenhado de maneira hiper suave */}
           <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[80%] h-[80%]">
              <motion.path
                 d="M60 20 L40 50 H65 L35 85 L45 55 H20 L45 20 Z"
                 stroke="currentColor"
                 strokeWidth="0.5"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 initial={{ pathLength: 0, opacity: 0 }}
                 animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
                 transition={{ 
                   pathLength: { duration: 6, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 },
                   opacity: { duration: 6, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }
                 }}
                 className="drop-shadow-[0_0_10px_#ff6a00]"
              />
              {/* Cópia em blur profundo multiplicando o brilho */}
              <motion.path
                 d="M60 20 L40 50 H65 L35 85 L45 55 H20 L45 20 Z"
                 stroke="currentColor"
                 strokeWidth="2"
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 initial={{ pathLength: 0, opacity: 0, filter: "blur(8px)" }}
                 animate={{ pathLength: 1, opacity: [0, 0.4, 0.4, 0] }}
                 transition={{ 
                   duration: 6, 
                   ease: "easeInOut", 
                   repeat: Infinity, 
                   repeatDelay: 1 
                 }}
              />
           </svg>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CONTAINER PRINCIPAL DO LOGIN                                  */}
      {/* ------------------------------------------------------------- */}
      <motion.div 
        initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[420px] z-10 group"
      >
        {/* Halo de Luz Interativo Atrás do Card */}
        <div className="absolute -inset-[2px] bg-gradient-to-t from-[#ff6a00]/0 via-[#ff6a00]/30 to-[#ff6a00]/0 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10"></div>

        {/* Card Principal */}
        <div className="bg-[#0a0a0a]/90 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.9),_inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden">
          
          {/* Reflexo Especular (Glass Texturing) superior */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          {/* Logo e Cabeçalho */}
          <div className="text-center mb-10 flex flex-col items-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#ff6a00]/20 rounded-full blur-2xl pointer-events-none"></div>
            <Image
              src="/stikz.png"
              alt="stikz logo"
              width={160}
              height={46}
              priority
              className="w-40 h-auto object-contain mb-4 drop-shadow-[0_0_15px_rgba(255,106,0,0.3)] relative z-10"
            />
            <div className="flex items-center justify-center gap-3">
              <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-white/20"></div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Ambiente Seguro</p>
              <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-white/20"></div>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Email */}
            <div className="space-y-1.5 relative group/input">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.1em] ml-1 transition-colors group-focus-within/input:text-[#ff6a00]">
                E-mail Corporativo
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${isFocused === 'email' ? 'text-[#ff6a00]' : 'text-white/30'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused('email')}
                  onBlur={() => setIsFocused(null)}
                  required
                  placeholder="seu@acesso.com"
                  className="w-full bg-[#030303] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#ff6a00]/40 focus:bg-[#080808] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-1.5 relative group/input">
               <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.1em] transition-colors group-focus-within/input:text-[#ff6a00]">
                  Senha de Acesso
                  </label>
                  <Link href="/esqueci-senha" className="text-[10px] font-bold text-white/30 hover:text-[#ff6a00] transition-colors uppercase tracking-wider">
                     Recuperar?
                  </Link>
               </div>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${isFocused === 'senha' ? 'text-[#ff6a00]' : 'text-white/30'}`} />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onFocus={() => setIsFocused('senha')}
                  onBlur={() => setIsFocused(null)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#030303] border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#ff6a00]/40 focus:bg-[#080808] transition-all duration-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors focus:outline-none"
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Callback de Erro (Elegant Warning) */}
            <div className="h-4">
              {erro && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-center text-[#ff3333] text-xs font-semibold flex items-center justify-center gap-1 drop-shadow-[0_0_8px_rgba(255,51,51,0.4)]"
                >
                  {erro}
                </motion.div>
              )}
            </div>

            {/* CTA Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative group/btn overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#ff6a00] to-[#cc5600] text-black font-black py-4 rounded-2xl text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_20px_rgba(255,106,0,0.2)] hover:shadow-[0_15px_30px_rgba(255,106,0,0.4)] active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              <div className="absolute inset-0 bg-white/20 group-hover/btn:translate-x-full -translate-x-full skew-x-[-20deg] transition-transform duration-700 pointer-events-none"></div>
              
              {loading ? (
                <div className="flex items-center gap-2 text-white drop-shadow-md">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Autenticando</span>
                </div>
              ) : (
                <span className="flex items-center gap-2 text-white drop-shadow-sm">
                  Entrar no Arsenal
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

        </div>

        {/* Rodapé Premium Outside Card */}
        <div className="text-center mt-8 space-y-2">
           <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em]">
             Tecnologia Stikz V2.0
           </p>
           <p className="text-[#333] text-[9px] uppercase tracking-widest">
             © 2026 Todos os Direitos Reservados.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
