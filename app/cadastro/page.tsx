'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      // 1. Criamos a conta pendente do usuário no Supabase
      const cadResponse = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const cadData = await cadResponse.json();

      if (!cadResponse.ok) {
        throw new Error(cadData.error || 'Erro ao criar conta');
      }

      // O usuário foi criado com status "pendente" e temos o ID dele:
      const userId = cadData.usuario.id;

      // 2. Redirecionamento forçado para o Perfect Pay com os dados do usuário
      const perfectPayUrl = new URL(process.env.NEXT_PUBLIC_PERFECT_PAY_CKT_URL || 'https://go.perfectpay.com.br/PPU38CQAL6U');
      perfectPayUrl.searchParams.append('name', nome);
      perfectPayUrl.searchParams.append('email', email);
      perfectPayUrl.searchParams.append('xcod', userId);

      window.location.href = perfectPayUrl.toString();

    } catch (err: any) {
      setErro(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-sans selection:bg-[#ff6a00] selection:text-black">
      {/* ======================= */}
      {/* LADO ESQUERDO: VALOR    */}
      {/* ======================= */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0b0b0b] items-center justify-center p-12 overflow-hidden border-r border-white/5">
        {/* Luzes de fundo */}
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-[#ff6a00]/[0.05] rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[#ff9d2e]/[0.03] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.15] mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 max-w-lg">
          <Link href="/" className="inline-block mb-16">
            <span className="font-extrabold text-3xl tracking-tighter text-white drop-shadow-lg">Stikz<span className="text-[#ff6a00]">.</span></span>
          </Link>
          
          <h2 className="text-5xl font-black mb-6 tracking-tighter leading-[1.05]">
            O arsenal gráfico que <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-[#ffb15c]">multiplica</span> suas conversões.
          </h2>
          <p className="text-xl text-white/50 mb-12 font-light leading-relaxed">
            Configure seu acesso agora e destrave imediatamente a biblioteca de figurinhas 3D mais cobiçada pelas agências de alta performance.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-[#ff6a00]/10 flex items-center justify-center shrink-0 border border-[#ff6a00]/20 shadow-[0_0_15px_rgba(255,106,0,0.2)]">
                  <Zap className="w-5 h-5 text-[#ff6a00]" />
               </div>
               <div>
                  <h4 className="font-bold text-lg mb-1">Acesso Imediato Cloud</h4>
                  <p className="text-white/40 text-sm leading-relaxed">Faça login e utilize diretamente do seu navegador. Sem downloads ou espera.</p>
               </div>
            </div>
            <div className="flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-[#ff6a00]/10 flex items-center justify-center shrink-0 border border-[#ff6a00]/20 shadow-[0_0_15px_rgba(255,106,0,0.2)]">
                  <CheckCircle2 className="w-5 h-5 text-[#ff6a00]" />
               </div>
               <div>
                  <h4 className="font-bold text-lg mb-1">Qualidade Retina HD</h4>
                  <p className="text-white/40 text-sm leading-relaxed">Imagens renderizadas em alta resolução para zero perda de qualidade no Instagram.</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================= */}
      {/* LADO DIREITO: CHECKOUT  */}
      {/* ======================= */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-y-auto">
        
        {/* Glow Laranja no formulário mobile */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ff6a00]/[0.05] rounded-full blur-[100px] pointer-events-none lg:hidden"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden mb-12 text-center">
             <Link href="/">
               <span className="font-extrabold text-3xl tracking-tighter text-white drop-shadow-lg">Stikz<span className="text-[#ff6a00]">.</span></span>
             </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black mb-2 tracking-tight">Criar Conta</h1>
            <p className="text-white/50 text-sm">Insira seus dados para liberar acesso na plataforma.</p>
          </div>

          {erro && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-medium text-sm flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              {erro}
            </motion.div>
          )}

          <form onSubmit={handleCadastro} className="space-y-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Nome Completo</label>
               <input 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                  className="w-full p-4 bg-[#111] border border-white/10 rounded-2xl focus:border-[#ff6a00]/50 focus:bg-[#151515] focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10 text-white transition-all shadow-inner" 
                  placeholder="Como devemos lhe chamar?" 
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">E-mail de Acesso</label>
               <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full p-4 bg-[#111] border border-white/10 rounded-2xl focus:border-[#ff6a00]/50 focus:bg-[#151515] focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10 text-white transition-all shadow-inner" 
                  placeholder="Seu melhor e-mail" 
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Definir Senha</label>
               <div className="relative">
                 <input 
                    type={mostrarSenha ? "text" : "password"} 
                    value={senha} 
                    onChange={(e) => setSenha(e.target.value)} 
                    required 
                    className="w-full p-4 bg-[#111] border border-white/10 rounded-2xl focus:border-[#ff6a00]/50 focus:bg-[#151515] focus:outline-none focus:ring-4 focus:ring-[#ff6a00]/10 text-white transition-all shadow-inner pr-12" 
                    placeholder="Mínimo 6 caracteres" 
                 />
                 <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                   {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
               </div>
            </div>
            
            <button 
               type="submit" 
               disabled={loading} 
               className="w-full relative flex items-center justify-center gap-3 bg-gradient-to-b from-[#ff832b] to-[#cc5600] border-t border-[#ffb15c]/50 text-white p-4 rounded-2xl font-black text-lg transition-all shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_0_10px_20px_rgba(255,106,0,0.3)] disabled:opacity-50 disabled:grayscale hover:scale-[1.02] transform-gpu mt-4 group overflow-hidden"
            >
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out"></div>
              {loading ? (
                 <span className="animate-pulse relative z-10">Redirecionando...</span>
              ) : (
                <>
                  <span className="relative z-10 uppercase tracking-wide drop-shadow-md">Liberar Meu Acesso</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Trust Elements */}
          <div className="mt-8 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs font-semibold uppercase tracking-wider">
             <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#ff6a00]" /> Acesso Imediato
             </div>
             <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6a00]" /> Pagamento Único
             </div>
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ff6a00]" /> Garantia de 7 Dias
             </div>
          </div>

          <p className="mt-12 text-center text-white/40 text-sm">
            Já tem uma conta? <Link href="/login" className="text-[#ff6a00] hover:underline font-bold transition-all">Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
