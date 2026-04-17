'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
   ArrowRight, CheckCircle2, Zap, Trophy, ShieldCheck,
   ChevronDown, Star, MessageSquareQuote, Check,
   Camera, TrendingUp, Users, Copy, DownloadCloud, MonitorSmartphone, Eye, MousePointerClick, DollarSign
} from 'lucide-react';

// Reusable cinematic scroll animation
const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
   <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
   >
      {children}
   </motion.div>
);

export default function LandingPage() {
   const [openFaq, setOpenFaq] = useState<number | null>(0);
   const [mounted, setMounted] = useState(false);

   useEffect(() => setMounted(true), []);

   const toggleFaq = (index: number) => {
      setOpenFaq(openFaq === index ? null : index);
   };

   const faqs = [
      {
         q: "Funciona apenas para iPhone ou no Android?",
         a: "A plataforma é completamente transversal. Por acessar o Stikz através do seu navegador, seja iOS ou Android, o nível de eficácia, nitidez e o processo de copiar e colar serão impecáveis."
      },
      {
         q: "Existe algum custo extra invisível ou renovação de licença?",
         a: "Não. A aquisição listada garante sua cadeira cativa no portal de uma forma vitalícia. É um pagamento único por atualizações constantes."
      },
      {
         q: "Eu preciso instalar aplicativos complexos na loja de apps?",
         a: "A solução é inteiramente baseada em nuvem web. Você fará login no nosso portal seguro, assim como faz no seu e-mail, de forma leve e rápida, sem precisar ocupar a memória do celular."
      },
      {
         q: "Preciso de alguma experiência anterior com design?",
         a: "Zero conhecimento necessário. Nosso manifesto é justamente desburocratizar. A curva de aprendizagem consiste literalmente nas opções matemáticas e simples de 'Copiar' e 'Colar'."
      }
   ];

   if (!mounted) return null; // Previne hydration mismatch no framer motion blur

   return (
      <div className="min-h-screen bg-[#0b0b0b] text-white selection:bg-[#ff6a00] selection:text-white font-sans overflow-x-hidden relative">

         {/* 🔮 Efeitos Estilísticos Globais (Glows & Partículas Incorpóreas) */}
         <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Grid background sutil */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#ff6a00]/[0.03] to-transparent"></div>
         </div>

         {/* 🚀 Navbar Glassmorphism Ultra Premium */}
         <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 w-full z-50 bg-[#0b0b0b]/50 backdrop-blur-2xl border-b border-white/[0.04] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
         >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between h-24 items-center">
                  <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                     <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ff9d2e] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),_0_0_20px_rgba(255,106,0,0.4)] transition-all"
                     >
                        <Z className="w-5 h-5 text-white drop-shadow-md" />
                     </motion.div>
                     <span className="font-extrabold text-2xl tracking-tighter text-white drop-shadow-lg">Stikz<span className="text-[#ff6a00]">.</span></span>
                  </Link>
                  <div className="flex items-center">
                     <Link href="/login" className="text-white/60 hover:text-white transition-colors font-medium text-sm border border-white/5 bg-white/5 hover:bg-white/10 px-5 py-2 rounded-full backdrop-blur-md">
                        Entrar
                     </Link>
                  </div>
               </div>
            </div>
         </motion.nav>

         {/* ------------------------------------------------------------- */}
         {/* ⭐️ HERO SECTION MÁXIMA (Cinematográfica e Imersiva)           */}
         {/* ------------------------------------------------------------- */}
         <section className="relative pt-44 lg:pt-52 pb-40 flex flex-col items-center justify-center min-h-[95vh] z-10 overflow-hidden">

            {/* LUZ DE FUNDO DO HERO & PARTÍCULAS (Composição Rica) */}
            <div className="absolute inset-0 bg-[#0b0b0b] -z-20"></div>
            <div className="absolute top-0 left-0 w-full h-[60vh] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.15] mix-blend-screen pointer-events-none -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0b0b]/80 to-[#0b0b0b] pointer-events-none -z-10"></div>

            {/* Core Glow Radial */}
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[700px] bg-[#ff6a00]/[0.08] rounded-full blur-[200px] -z-10 pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[30%] right-[-5%] w-[800px] h-[800px] bg-[#ff9d2e]/[0.04] rounded-full blur-[150px] -z-10 animate-pulse mix-blend-screen"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">

               {/* Label Glass Ultra Premium */}
               <FadeIn delay={0.1}>
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-black/40 border border-white/[0.08] text-white/90 font-bold text-[10px] md:text-sm uppercase tracking-[0.25em] mb-12 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_0_30px_rgba(255,106,0,0.2)] ring-1 ring-white/5 relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff6a00]/10 to-transparent"></div>
                     <div className="w-2 h-2 rounded-full bg-[#ff6a00] shadow-[0_0_10px_#ff6a00,0_0_20px_#ff6a00] animate-pulse"></div>
                     O Upgrade dos Perfis Black
                  </motion.div>
               </FadeIn>

               {/* Headline Impactante e Direta */}
               <FadeIn delay={0.2} className="relative w-full max-w-6xl">
                  <h1 className="text-[3.5rem] md:text-7xl lg:text-[7rem] font-black tracking-tighter mb-8 leading-[1.0] text-white drop-shadow-2xl">
                     Venda mais todos os dias com <br className="hidden md:block" />
                     <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] via-[#ff9d2e] to-[#ffb15c] pb-2 mt-2">
                        Figurinhas Premium.
                        {/* Curva luminosa sublinhando o texto dramático */}
                        <div className="absolute bottom-[5px] left-[5%] w-[90%] h-[6px] bg-gradient-to-r from-transparent via-[#ff6a00]/80 to-transparent blur-md rounded-full"></div>
                        <div className="absolute bottom-[8px] left-[10%] w-[80%] h-[2px] bg-[#ffb15c]/90 rounded-full"></div>
                     </span>
                  </h1>
               </FadeIn>

               {/* Subheadline Direta (Benefício + Ação) */}
               <FadeIn delay={0.3}>
                  <p className="mt-4 text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-16 leading-[1.7] font-light">
                     Chega de perder horas montando artes do zero. Acesse nossa biblioteca exclusiva, copie o adesivo 3D e <strong className="text-white font-medium">cole no seu Story para dobrar seus cliques e conversões</strong> instantaneamente.
                  </p>
               </FadeIn>

               {/* CTA Extremamente Iluminado (Scale + Glow) */}
               <FadeIn delay={0.4}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative group mx-auto inline-block">
                     {/* Mega Glow Hover Effect */}
                     <div className="absolute -inset-4 bg-gradient-to-r from-[#ff6a00] to-[#ff9d2e] rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none"></div>
                     <div className="absolute -inset-1 bg-white/20 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"></div>

                     <Link href="/cadastro" className="relative flex items-center justify-center gap-4 bg-gradient-to-b from-[#ff832b] via-[#ff6a00] to-[#cc5600] border-t border-[#ffb15c]/50 border-b-2 border-black/50 text-white px-12 py-6 sm:py-7 rounded-[2.5rem] font-black text-xl md:text-2xl transition-all shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>

                        {/* Brilho cruzando o botão */}
                        <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-30deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out"></div>

                        <span className="relative z-10 tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Começar Agora</span>
                        <div className="relative z-10 bg-black/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)]">
                           <ArrowRight className="w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300 text-white" />
                        </div>
                     </Link>
                  </motion.div>
               </FadeIn>

               <FadeIn delay={0.5}>
                  <p className="mt-8 text-white/50 text-sm flex items-center gap-3 font-semibold uppercase tracking-widest bg-black/30 w-max mx-auto px-5 py-2 rounded-full border border-white/5 backdrop-blur-md">
                     <Zap className="w-4 h-4 text-[#ff6a00] drop-shadow-[0_0_8px_#ff6a00] fill-[#ff6a00]" /> Acesso instantâneo Cloud
                  </p>
               </FadeIn>

               {/* 📱 Mockup Celular Hiper-Realista e Cênico */}
               <FadeIn delay={0.7} className="mt-28 w-full flex justify-center relative perspective-[2000px] z-20">

                  {/* Glow Radial Massivo DIRETO atrás do celular emulando a luz de fundo */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-[600px] h-[600px] bg-[#ff6a00]/[0.15] rounded-full blur-[100px] -z-10 mix-blend-screen"></div>

                  {/* Sombras Base Ultra Realistas conectando ao chão */}
                  <div className="absolute -bottom-[50px] w-[90%] max-w-[700px] h-[80px] bg-black blur-[50px] rounded-[100%]"></div>
                  <div className="absolute -bottom-[20px] left-1/2 -translate-x-1/2 w-[60%] max-w-[400px] h-[30px] bg-black blur-[20px] rounded-[100%]"></div>

                  {/* 3D Wrapper */}
                  <motion.div
                     animate={{ y: [0, -15, 0] }}
                     transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                     className="w-full max-w-[360px] md:max-w-[440px] aspect-[9/19] rounded-[4rem] bg-[#050505] border-[4px] border-[#2a2a2a] shadow-[-30px_50px_100px_rgba(0,0,0,0.9),_0_0_80px_rgba(255,106,0,0.25),_inset_0_5px_15px_rgba(255,255,255,0.1)] relative overflow-hidden flex flex-col pt-14 px-8 ring-1 ring-white/10"
                     style={{ rotateX: "15deg", rotateY: "-10deg", rotateZ: "8deg", transformStyle: "preserve-3d" }}
                  >
                     {/* Lateral do Celular (Efeito 3D borda direita) */}
                     <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-r from-transparent to-white/10 mix-blend-screen pointer-events-none"></div>

                     {/* Emulação do Notch Metálico */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-8 bg-[#111] rounded-b-3xl shadow-[inset_0_-2px_10px_rgba(0,0,0,0.8),_0_2px_5px_rgba(0,0,0,0.5)] border-b border-x border-[#333] z-50"></div>
                     <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-[#050505] rounded-full z-50"></div>

                     {/* Gradiente Interno Tela Base */}
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] -z-10"></div>
                     <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay"></div>

                     {/* Header do story REALSITA */}
                     <div className="flex items-center justify-between mb-8 relative z-10 pt-2 px-1">
                        <div className="flex items-center gap-3">
                           <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-white/20 shadow-md" />
                           <div className="flex flex-col">
                              <span className="text-white text-xs font-semibold drop-shadow-md">@motors.premium</span>
                              <span className="text-white/50 text-[9px] drop-shadow-md">3 h</span>
                           </div>
                        </div>
                        <div className="flex gap-1">
                           <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                           <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                           <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                        </div>
                     </div>

                     {/* Tela Rica Stikz Aplicada - Contexto CARRO DE LUXO */}
                     <div className="flex-1 bg-[#111] rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-between pb-8 relative overflow-hidden group mb-10 shadow-[inner_0_0_50px_rgba(0,0,0,0.8)]">
                        <img src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80" alt="Contexto Carro" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

                        {/* Top Spacer */}
                        <div></div>

                        {/* Sticker Hiper Imersivo Aplicado no Story */}
                        <motion.div
                           initial={{ scale: 0.8, rotate: -6, opacity: 0 }}
                           animate={{ scale: 1, rotate: -2, opacity: 1 }}
                           transition={{ delay: 1.5, type: "spring", stiffness: 120, damping: 10 }}
                           className="bg-black/80 p-5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8),_0_0_30px_rgba(255,106,0,0.4),_inset_0_2px_2px_rgba(255,255,255,0.2)] backdrop-blur-xl relative z-10 transform-gpu flex flex-col items-center"
                        >
                           <div className="bg-[#ff6a00] text-black text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-sm mb-2 transform -skew-x-12">Oportunidade Única</div>
                           <span className="text-white font-black text-3xl uppercase tracking-tighter leading-[0.9] block drop-shadow-2xl text-center">
                              Audi Q5<br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#aaa]">Blindado</span>
                           </span>
                        </motion.div>
                     </div>

                     {/* Reflexo Tela (Glass Specular Highlight superior esquerdo) */}
                     <div className="absolute -top-10 -left-10 w-[70%] h-[150%] bg-gradient-to-r from-white/30 to-transparent skew-x-[-30deg] opacity-20 pointer-events-none mix-blend-overlay"></div>
                  </motion.div>
               </FadeIn>
            </div>
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 1.5 PROVA VISUAL DE IMPACTO (Antes vs Depois)                   */}
         {/* ------------------------------------------------------------- */}
         <section className="py-32 relative z-10 bg-[#050505] border-y border-white/5 overflow-hidden">
            {/* Luz de Fundo da Seção */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[400px] bg-[#ff6a00]/[0.03] rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
               <FadeIn>
                  <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-white">
                     O Impacto Físico é <span className="text-[#ff6a00] drop-shadow-[0_0_15px_rgba(255,106,0,0.5)]">Instantâneo.</span>
                  </h2>
                  <p className="text-xl md:text-2xl text-white/50 mb-20 max-w-2xl mx-auto font-light leading-relaxed">
                     A anatomia de um story comum vs. uma publicação revestida com a chancelaria gráfica da Stikz.
                  </p>
               </FadeIn>

               <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 max-w-5xl mx-auto relative perspective-1000">

                  {/* ------------------------ ANTES (Sem stikz) ------------------------ */}
                  <FadeIn delay={0.2} className="relative flex flex-col items-center w-full lg:w-auto">
                     <div className="mb-8 bg-[#111] border border-white/10 text-white/40 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.25em]">
                        Antes (Amador)
                     </div>

                     <div className="w-full max-w-[300px] aspect-[9/19] rounded-[3rem] bg-[#0f0f0f] border-4 border-[#1a1a1a] shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col px-5 pt-10 ring-1 ring-white/5 opacity-80 filter grayscale-[30%]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-[#1a1a1a] rounded-b-2xl"></div>
                        <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-black/50 to-transparent mix-blend-overlay"></div>

                        <div className="flex items-center justify-between mb-4 relative z-10 pt-2 px-1">
                           <div className="flex items-center gap-2">
                              <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-md" />
                              <div className="flex flex-col">
                                 <span className="text-white text-[10px] font-semibold drop-shadow-md">@tech.imports</span>
                                 <span className="text-white/50 text-[8px] drop-shadow-md">5 h</span>
                              </div>
                           </div>
                           <div className="flex gap-0.5">
                              <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                              <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                              <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                           </div>
                        </div>

                        {/* Fundo do Story Fraco (Amador) */}
                        <div className="flex-1 rounded-[2rem] bg-[#1a1a1a] flex flex-col justify-between items-center relative overflow-hidden mb-6 border border-white/5 pb-8">
                           <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80" alt="Produto Tech" className="absolute inset-0 w-full h-full object-cover opacity-60" />

                           <div></div>

                           {/* Texto nativo do instagram "feio" */}
                           <div className="bg-black/40 px-3 py-1 rounded-sm relative z-10 flex flex-col items-center">
                              <span className="text-white font-sans text-xs bg-[#ff2200] max-w-max px-1">IPHONE 13 PRO MAX</span>
                              <span className="text-white font-sans font-bold text-sm bg-black px-1 mt-1">R$ 4.500 À VISTA</span>
                           </div>
                        </div>
                     </div>
                  </FadeIn>

                  {/* Separador Visual VS */}
                  <FadeIn delay={0.4} className="hidden lg:flex w-16 h-16 rounded-full bg-[#111] border border-white/10 items-center justify-center relative z-20 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                     <span className="text-white/30 font-black text-xl italic drop-shadow-md">VS</span>
                  </FadeIn>

                  {/* ------------------------ DEPOIS (Com Stikz) ------------------------ */}
                  <FadeIn delay={0.6} className="relative flex flex-col items-center w-full lg:w-auto">

                     {/* Iluminação Exclusiva do Lado Premium */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[120%] bg-[#ff6a00]/[0.08] rounded-full blur-[80px] -z-10 pointer-events-none mix-blend-screen"></div>

                     <div className="mb-8 bg-gradient-to-r from-[#ff6a00] to-[#cc5600] border border-[#ffb15c]/50 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.25em] shadow-[0_0_20px_rgba(255,106,0,0.4)] relative">
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] animate-ping"></span>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white]"></span>
                        Depois (Stikz HD)
                     </div>

                     <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        className="w-full max-w-[300px] aspect-[9/19] rounded-[3rem] bg-[#050505] border-[4px] border-[#222] shadow-[0_50px_100px_rgba(0,0,0,1),_0_20px_60px_rgba(255,106,0,0.2),_inset_0_4px_10px_rgba(255,255,255,0.15)] relative overflow-hidden flex flex-col px-5 pt-10 ring-1 ring-[#ff6a00]/30 transform-gpu"
                     >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-[#222] rounded-b-2xl shadow-[inset_0_-2px_5px_rgba(0,0,0,0.5)]"></div>
                        <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay"></div>

                        <div className="flex items-center justify-between mb-4 relative z-10 pt-2 px-1">
                           <div className="flex items-center gap-2">
                              <img src="https://i.pravatar.cc/150?img=33" alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-md" />
                              <div className="flex flex-col">
                                 <span className="text-white text-[10px] font-semibold drop-shadow-md">@tech.imports</span>
                                 <span className="text-white/50 text-[8px] drop-shadow-md">5 h</span>
                              </div>
                           </div>
                           <div className="flex gap-0.5">
                              <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                              <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                              <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                           </div>
                        </div>

                        {/* Fundo do Story Forte e Rico (Stikz HD) */}
                        <div className="flex-1 rounded-[2rem] bg-[#111] flex flex-col justify-between items-center relative overflow-hidden mb-6 border border-white/10 shadow-[inner_0_0_30px_rgba(0,0,0,0.8)] group pb-8">
                           <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80" alt="Produto Tech" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                           <div></div>

                           {/* Figurinha STIKZ Hiper Premium no Story */}
                           <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
                              className="bg-black/40 px-4 py-3 border border-white/20 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.9),_0_0_20px_rgba(255,106,0,0.3),_inset_0_1px_2px_rgba(255,255,255,0.4)] backdrop-blur-xl relative z-10 transform -rotate-3 flex flex-col items-center"
                           >
                              <div className="bg-[#ff6a00] text-black text-[9px] uppercase font-black px-2 py-0.5 rounded-sm mb-1">Destaque da Semana</div>
                              <span className="text-white font-black text-lg uppercase tracking-tighter block drop-shadow-xl text-center">
                                 iPhone 13 Pro
                                 <div className="text-[#ff6a00] flex justify-center drops-shadow-xl">
                                    <span className="text-xs mr-0.5 mt-1">R$</span><span className="text-2xl font-black">4.500</span>
                                 </div>
                              </span>
                           </motion.div>
                        </div>

                        {/* Reflexo Tela (Glass Specular Highlight superior esquerdo) */}
                        <div className="absolute -top-10 -left-10 w-[60%] h-[150%] bg-gradient-to-r from-white/30 to-transparent skew-x-[-30deg] opacity-20 pointer-events-none mix-blend-overlay"></div>
                     </motion.div>
                  </FadeIn>

               </div>
            </div>
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 2. AGITAÇÃO DA DOR (Dark Glassmorphism)                         */}
         {/* ------------------------------------------------------------- */}
         <section className="py-36 relative z-10 bg-[#0b0b0b]">
            {/* LUZ DE FUNDO SUAVE */}
            <div className="absolute top-0 right-[-20%] w-[800px] h-[800px] bg-[#ff6a00]/[0.02] rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <FadeIn>
                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-[1.05] text-white">
                     Seu Produto É Bom.<br />
                     <span className="text-[#ff6a00]/90">Sua Estética Te Sabota.</span>
                  </h2>
               </FadeIn>

               <FadeIn delay={0.2} className="relative z-10">
                  <p className="text-xl md:text-2xl text-white/50 mb-24 max-w-4xl mx-auto font-light leading-[1.6]">
                     Não adianta ter a melhor solução se os seus Stories têm aparência amadora. A falta de profissionalismo destrói sua autoridade em segundos e envia seus clientes para o concorrente ao lado.
                  </p>
               </FadeIn>

               <div className="grid md:grid-cols-2 gap-10 text-left max-w-5xl mx-auto relative perspective-1000">
                  {/* Linha Divisória de Luz Cinematográfica */}
                  <div className="hidden md:block absolute top-[50%] left-[45%] right-[45%] h-[2px] bg-gradient-to-r from-transparent via-[#ff6a00]/40 to-transparent z-0 blur-[1px]"></div>

                  {/* Card Amador (Negativo e Frio) */}
                  <FadeIn delay={0.3} className="relative z-10 h-full">
                     <div className="bg-gradient-to-br from-[#141414] to-[#0a0a0a] p-10 md:p-14 rounded-[3rem] border border-white/[0.03] opacity-60 hover:opacity-100 transition-opacity duration-700 h-full flex flex-col justify-center gap-8 shadow-2xl relative overflow-hidden group">
                        {/* Inner top highlight */}
                        <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] pointer-events-none"></div>

                        <h3 className="font-bold text-white/40 text-xl flex items-center gap-4 uppercase tracking-[0.15em]">
                           <span className="w-3 h-3 rounded-full bg-red-600/50 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></span>
                           O Padrão Amador
                        </h3>
                        <ul className="space-y-6 text-white/40 font-light text-lg">
                           <li className="flex gap-4 items-start"><MonitorSmartphone className="w-7 h-7 shrink-0 opacity-30 mt-0.5" /> Você usa as exatas mesmas fontes nativas que todos os seus concorrentes limitados usam.</li>
                           <li className="flex gap-4 items-start"><MonitorSmartphone className="w-7 h-7 shrink-0 opacity-30 mt-0.5" /> Textos embaçados e distorcidos após a compressão agressiva do upload no aplicativo.</li>
                        </ul>
                     </div>
                  </FadeIn>

                  {/* Card Stikz (Quente, Rico, Iluminado) */}
                  <FadeIn delay={0.5} className="relative z-10 h-full">
                     <div className="bg-gradient-to-br from-[#1c140d] via-[#120a05] to-[#0b0b0b] p-10 md:p-14 rounded-[3rem] border border-[#ff6a00]/40 shadow-[0_40px_80px_rgba(0,0,0,0.8),_0_0_80px_rgba(255,106,0,0.12),_inset_0_2px_4px_rgba(255,255,255,0.1)] backdrop-blur-3xl h-full flex flex-col justify-center gap-8 relative overflow-hidden transform hover:-translate-y-4 transition-transform duration-500">
                        {/* Efeito Glass/Blurry Glow interior */}
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#ff6a00]/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none"></div>

                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#ff6a00] to-[#e65a00] text-white px-6 py-2 text-[10px] font-extrabold uppercase tracking-[0.25em] rounded-bl-3xl rounded-tr-[3rem] shadow-[0_0_20px_rgba(255,106,0,0.5)]">
                           A Solução
                        </div>

                        <h3 className="font-bold text-white text-xl flex items-center gap-4 uppercase tracking-[0.15em] relative z-10 mt-2">
                           <span className="w-3 h-3 rounded-full bg-[#ff6a00] shadow-[0_0_15px_#ff6a00]"></span>
                           O Padrão Stikz
                        </h3>
                        <ul className="space-y-6 text-white/90 font-light text-lg relative z-10">
                           <li className="flex gap-4 items-start"><CheckCircle2 className="w-7 h-7 shrink-0 text-[#ff6a00] drop-shadow-[0_0_8px_#ff6a00] mt-0.5" /> Textos e Call-To-Actions 3D de nível de agência, prontos para uso com 1 clique.</li>
                           <li className="flex gap-4 items-start"><CheckCircle2 className="w-7 h-7 shrink-0 text-[#ff6a00] drop-shadow-[0_0_8px_#ff6a00] mt-0.5" /> Qualidade Retina HD cravada. Zero borrões, perda técnica ou redução de qualidade.</li>
                        </ul>
                     </div>
                  </FadeIn>
               </div>
            </div>
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 2.5 IMPACTO FINANCEIRO (Atenção -> Vendas)                      */}
         {/* ------------------------------------------------------------- */}
         <section className="py-32 relative z-10 bg-[#020202] border-y border-white/[0.05] overflow-hidden">
            <div className="absolute top-0 right-1/2 w-[600px] h-[600px] bg-[#ff6a00]/[0.03] rounded-full blur-[150px] pointer-events-none translate-x-1/2"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                  <FadeIn>
                     <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-10 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                        <TrendingUp className="w-4 h-4" /> A Regra Básica da Internet
                     </div>
                     <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-8 text-white">
                        Stories ignorados não <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ff6a00] to-[#cc5600] drop-shadow-xl">pagam boletos.</span>
                     </h2>
                  </FadeIn>
                  
                  <FadeIn delay={0.2}>
                     <p className="text-xl md:text-2xl text-white/50 mb-20 font-light leading-[1.6]">
                        Sua audiência pula seus Stories porque eles são visualmente cansativos. Sem atenção, não há cliques. <strong className="text-white font-medium">Sem cliques, não há vendas.</strong> O padrão Stikz corta a rolagem automática e fixa os olhos do cliente na sua oferta.
                     </p>
                  </FadeIn>
               </div>

               <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
                  <FadeIn delay={0.3}>
                     <div className="bg-[#111] border border-white/5 p-10 md:p-12 rounded-[3rem] flex flex-col items-center text-center shadow-[0_30px_60px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.02)] backdrop-blur-3xl h-full transform hover:-translate-y-2 transition-transform duration-500 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Eye className="w-12 h-12 text-white/30 mb-8 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-black text-2xl mb-4 uppercase tracking-wider">1. Atenção Focada</h4>
                        <p className="text-white/50 text-base leading-relaxed font-light">A embalagem premium das figurinhas oblitera a rolagem natural e prende o subconsciente do seu público imediatamente.</p>
                     </div>
                  </FadeIn>
                  
                  <FadeIn delay={0.4}>
                     <div className="bg-[#111] border border-white/5 p-10 md:p-12 rounded-[3rem] flex flex-col items-center text-center shadow-[0_30px_60px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.02)] backdrop-blur-3xl h-full transform hover:-translate-y-2 transition-transform duration-500 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <MousePointerClick className="w-12 h-12 text-white/50 mb-8 relative z-10 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-black text-2xl mb-4 uppercase tracking-wider relative z-10">2. Taxa de Clique</h4>
                        <p className="text-white/50 text-base leading-relaxed font-light relative z-10">O design High-End emula a sensação de uma marca consolidada, dobrando a confiança necessária para o usuário tocar no link.</p>
                     </div>
                  </FadeIn>

                  <FadeIn delay={0.5}>
                     <div className="bg-gradient-to-br from-[#1c140d] to-[#0a0a0a] border border-[#ff6a00]/30 p-10 md:p-12 rounded-[3rem] flex flex-col items-center text-center shadow-[0_40px_80px_rgba(255,106,0,0.15),_0_20px_40px_rgba(0,0,0,0.8),_inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-3xl h-full transform hover:-translate-y-4 transition-transform duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#ff6a00]/20 blur-[60px] rounded-full mix-blend-screen pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        
                        <DollarSign className="w-12 h-12 text-[#ff6a00] mb-8 drop-shadow-[0_0_15px_#ff6a00] relative z-10 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-black text-2xl mb-4 uppercase tracking-wider relative z-10">3. Vendas Claras</h4>
                        <p className="text-white/80 text-base leading-relaxed font-light relative z-10">Confiabilidade visual construída em segundos se traduz em zero fricção na hora de passar o cartão e dinheiro massivo no bolso.</p>
                     </div>
                  </FadeIn>
               </div>
            </div>
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 3. A SOLUÇÃO (Illuminated Steps)                                */}
                           {/* ------------------------------------------------------------- */}
                           <section className="py-40 relative overflow-hidden bg-[#070707]">
                              {/* Luz que vem do chão (Bottom Light) */}
                              <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[80%] max-w-[1200px] h-[300px] bg-[#ff6a00]/5 rounded-[100%] blur-[120px] pointer-events-none"></div>

                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                 <FadeIn className="text-center">
                                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-8 text-white">
                                       Qualidade Absoluta.<br />
                                       <span className="text-[#ff6a00] drop-shadow-md">Apenas Copie e Cole.</span>
                                    </h2>
                                 </FadeIn>
                                 <FadeIn delay={0.2}>
                                    <p className="mt-6 text-xl text-white/50 font-light max-w-3xl mx-auto mb-28 text-center leading-[1.6]">
                                       Chega de queimar horas preciosas espremendo artes feias no Canva. Nossa equipe já fez todo o trabalho pesado. Você só precisa acessar nossa plataforma enxuta, selecionar o asset pronto e colocar no seu Story. Fim.
                                    </p>
                                 </FadeIn>

                                 <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto relative">

                                    <FadeIn delay={0.3} className="relative group">
                                       <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.9),_inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-3xl h-full flex flex-col items-center text-center hover:border-white/10 transition-colors relative z-10 hover:-translate-y-2 duration-500">
                                          <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] pointer-events-none"></div>
                                          <div className="w-28 h-28 bg-[#1a1a1a] rounded-[2rem] flex items-center justify-center mb-8 border border-white/5 relative z-10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500">
                                             <DownloadCloud className="w-12 h-12 text-white/50 group-hover:text-white transition-colors" />
                                             <div className="absolute -inset-2 bg-white/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                                             <span className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a00] to-[#cc5600] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,106,0,0.4)] text-lg border border-[#ffb15c]/30 z-20">1</span>
                                          </div>
                                          <h3 className="text-3xl font-black mb-4 tracking-tight text-white relative z-10">Acesso via Nuvem</h3>
                                          <p className="text-white/50 font-light text-lg leading-relaxed relative z-10">Faça login seguro direto do navegador do celular. Sem baixar nada, sem ocupar memória ou travar seu aparelho.</p>
                                       </div>
                                    </FadeIn>

                                    <FadeIn delay={0.5} className="relative group">
                                       <div className="bg-gradient-to-b from-[#1c140d] to-[#0b0b0b] p-10 rounded-[3rem] border border-[#ff6a00]/20 shadow-[0_40px_80px_rgba(255,106,0,0.15),_0_20px_40px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-3xl h-full flex flex-col items-center text-center hover:border-[#ff6a00]/40 transition-[colors,transform] transform hover:-translate-y-4 duration-500 relative z-20">
                                          <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none"></div>
                                          <div className="w-28 h-28 bg-gradient-to-br from-[#331100] to-[#110500] rounded-[2rem] flex items-center justify-center mb-8 border border-[#ff6a00]/30 relative z-10 shadow-[0_20px_40px_rgba(255,106,0,0.1)] group-hover:scale-105 transition-transform duration-500">
                                             <Copy className="w-12 h-12 text-[#ff6a00] drop-shadow-[0_0_10px_#ff6a00]" />
                                             <div className="absolute -inset-4 bg-[#ff6a00]/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                                             <span className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a00] to-[#cc5600] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,106,0,0.6)] text-lg border border-[#ffb15c]/30 z-20">2</span>
                                          </div>
                                          <h3 className="text-3xl font-black mb-4 tracking-tight text-white relative z-10">Escolha e Copie</h3>
                                          <p className="text-white/80 font-light text-lg leading-relaxed relative z-10">Encontre a etiqueta perfeita geradora de vendas para sua oferta do dia (Vagas, Promoção, etc) e aperte 'Copiar'.</p>
                                       </div>
                                    </FadeIn>

                                    <FadeIn delay={0.7} className="relative group">
                                       <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] p-10 rounded-[3rem] border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.9),_inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-3xl h-full flex flex-col items-center text-center hover:border-white/10 transition-colors relative z-10 hover:-translate-y-2 duration-500">
                                          <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] pointer-events-none"></div>
                                          <div className="w-28 h-28 bg-[#1a1a1a] rounded-[2rem] flex items-center justify-center mb-8 border border-white/5 relative z-10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500">
                                             <MonitorSmartphone className="w-12 h-12 text-white/50 group-hover:text-white transition-colors" />
                                             <div className="absolute -inset-2 bg-white/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                                             <span className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a00] to-[#cc5600] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,106,0,0.4)] text-lg border border-[#ffb15c]/30 z-20">3</span>
                                          </div>
                                          <h3 className="text-3xl font-black mb-4 tracking-tight text-white relative z-10">Cole no Story</h3>
                                          <p className="text-white/50 font-light text-lg leading-relaxed relative z-10">Volte para o Instagram, use a ferramenta de texto para 'Colar'. Ajuste o tamanho onde e publique. Venda realizada.</p>
                                       </div>
                                    </FadeIn>
                                 </div>
                              </div>
                           </section>
         {/* ------------------------------------------------------------- */}
         {/* 4. PARA QUEM É (Premium Card Grids)                             */}
         {/* ------------------------------------------------------------- */}
         <section className="py-40 bg-[#0b0b0b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <FadeIn className="text-center mb-24">
                  <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white">
                     Engenharia visual para a <br /><span className="text-[#ff6a00] drop-shadow-lg">linha de frente.</span>
                  </h2>
                  <p className="mt-8 text-xl md:text-2xl text-white/50 font-light max-w-3xl mx-auto leading-relaxed">
                     Nenhuma peça solta no sistema stikz é aleatória. É o cérebro das maiores agências faturadoras em formato compactado.
                  </p>
               </FadeIn>

               <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
                  {[
                     {
                        icon: <Trophy className="w-8 h-8 text-[#ff6a00]" />,
                        id: "Lojistas Físicos & E-commerce",
                        label: "Aparência Intocável",
                        text: "Lojas de roupas, eletrônicos ou vitrines online. Transforme fotos simples de produtos em anúncios de alto padrão que convertem muito mais rápido.",
                        img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80",
                        sticker: { top: "LANÇAMENTO", main: "NOVA COLEÇÃO" }
                     },
                     {
                        icon: <Zap className="w-8 h-8 text-[#ff6a00]" />,
                        id: "Infoprodutores Focados",
                        label: "Estopim Cognitivo",
                        text: "Gatilhos de alta conversão. Imponha escassez imediata na sua audiência no momento de aplicar picos de venda do seu fechamento de carrinho.",
                        img: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80",
                        sticker: { top: "SÓ HOJE", main: "ÚLTIMAS VAGAS" }
                     },
                     {
                        icon: <Users className="w-8 h-8 text-[#ff6a00]" />,
                        id: "Serviços Corporativos",
                        label: "Percepção de Valor",
                        text: "Dentistas, arquitetos, advogados. Eleve a apresentação do seu serviço a um padrão classe A que justifica imediatamente o recebimento de valores altos.",
                        img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80",
                        sticker: { top: "CONSULTAS", main: "AGENDA ABERTA" }
                     },
                     {
                        icon: <Camera className="w-8 h-8 text-[#ff6a00]" />,
                        id: "Criadores e Influenciadores",
                        label: "Chancela Gráfica",
                        text: "Mostre o tamanho real da sua autoridade online para marcas e parceiros comerciais transformando publicações normais em mídias valiosas.",
                        img: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80",
                        sticker: { top: "PUB", main: "PARCERIA" }
                     }
                  ].map((card, idx) => (
                     <FadeIn key={idx} delay={idx * 0.15}>
                        <motion.div
                           whileHover={{ y: -8, transition: { duration: 0.4 } }}
                           className="relative bg-gradient-to-br from-[#181818] to-[#0a0a0a] p-10 md:p-12 rounded-[3.5rem] border border-white/[0.06] overflow-hidden group shadow-[0_40px_80px_rgba(0,0,0,0.8),_inset_0_1px_2px_rgba(255,255,255,0.05)] backdrop-blur-2xl h-full flex flex-col justify-between"
                        >
                           <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a00]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                           <div className="absolute inset-0 rounded-[3.5rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] pointer-events-none"></div>

                           <div className="relative z-10 flex flex-col gap-6 mb-8">
                              <div className="w-16 h-16 rounded-t-[1.5rem] rounded-b-[0.5rem] rounded-bl-[1.5rem] bg-gradient-to-br from-white/[0.04] to-transparent flex items-center justify-center border border-white/5 group-hover:bg-white/[0.06] transition-colors relative shadow-inner">
                                 <div className="absolute inset-0 rounded-[inherit] bg-[#ff6a00]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                 {card.icon}
                              </div>
                              <div>
                                 <h3 className="font-extrabold text-2xl md:text-3xl tracking-tight text-white mb-2">{card.id}</h3>
                                 <div className="inline-block bg-[#ff6a00]/10 border border-[#ff6a00]/20 text-[#ff6a00] font-bold text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 relative">
                                    {card.label}
                                 </div>
                                 <p className="text-white/50 text-base md:text-lg font-light leading-[1.7]">{card.text}</p>
                              </div>
                           </div>

                           {/* PROVA VISUAL PRÁTICA DENTRO DO CARD */}
                           <div className="w-full h-[220px] rounded-[2rem] overflow-hidden relative shadow-[inner_0_0_20px_rgba(0,0,0,0.8)] border border-white/5 bg-[#050505] mt-auto">
                              {/* Background Imagem Real */}
                              <img src={card.img} alt={card.id} className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity grayscale-[30%] group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                              
                              {/* Elemento de UI: Instagram Simulado no topo */}
                              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 opacity-60">
                                 <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md"></div>
                                    <div className="w-16 h-1.5 bg-white/30 rounded-full"></div>
                                 </div>
                              </div>

                              {/* STIKER: Aplicação simulada na prática */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                 <motion.div 
                                    className="bg-black/70 backdrop-blur-xl px-5 py-3 border border-white/10 rounded-2xl transform -rotate-3 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.8)] flex flex-col items-center"
                                 >
                                    <div className="bg-[#ff6a00] text-black text-[8px] uppercase font-black px-2 py-0.5 rounded-sm mb-1">{card.sticker.top}</div>
                                    <span className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter drop-shadow-xl text-center leading-none">
                                       {card.sticker.main}
                                    </span>
                                 </motion.div>
                              </div>
                           </div>
                        </motion.div>
                     </FadeIn>
                  ))}
               </div>
            </div>
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 5. A BIBLIOTECA (Vitrine Premium Dupla)                         */}
         {/* ------------------------------------------------------------- */}
         <section className="pt-32 pb-44 bg-[#030303] overflow-hidden relative border-y border-white/[0.02]">
            {/* Luz de Separação Superior/Inferior Cinematográfica */}
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff6a00]/30 to-transparent"></div>
            <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff6a00]/30 to-transparent"></div>

            {/* Ambient Glow */}
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#ff6a00]/[0.02] rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-[#ff9d2e]/[0.02] rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-24">
               <FadeIn>
                  <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-white/60 font-bold text-xs uppercase tracking-[0.25em] mb-8 backdrop-blur-md">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] shadow-[0_0_8px_#ff6a00] animate-pulse"></div>
                     Inventário Vivo
                  </div>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tighter text-white drop-shadow-2xl">
                     O arsenal gráfico <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-[#ffb15c] drop-shadow-[0_0_15px_rgba(255,106,0,0.3)]">mais cobiçado do mercado.</span>
                  </h2>
                  <p className="text-white/50 text-xl max-w-3xl mx-auto font-light leading-relaxed">
                     Centenas de calls-to-action, molduras, provas sociais e selos corporativos renderizados em alta definição, prontos para plugar nos seus Stories instantaneamente.
                  </p>
               </FadeIn>
            </div>

            <div className="relative w-full overflow-hidden flex flex-col gap-6 md:gap-8 py-4">
               {/* Sombras Laterais para Fade contínuo (Deep Black) */}
               <div className="absolute inset-y-0 left-0 w-24 md:w-64 bg-gradient-to-r from-[#030303] via-[#030303]/80 to-transparent z-20 pointer-events-none"></div>
               <div className="absolute inset-y-0 right-0 w-24 md:w-64 bg-gradient-to-l from-[#030303] via-[#030303]/80 to-transparent z-20 pointer-events-none"></div>

               {/* FILEIRA 1 -> Direita (animada pelo `marquee`) */}
               <div className="flex w-max shrink-0 animate-marquee hover:[animation-play-state:paused] items-center gap-6 md:gap-8 pl-8 transition-all duration-300">
                  {[...Array(12)].map((_, i) => (
                     <motion.div
                        whileHover={{ scale: 1.05, y: -5, zIndex: 30 }}
                        key={`row1-${i}`}
                        className="w-48 h-56 md:w-72 md:h-80 shrink-0 bg-[#0a0a0a] rounded-3xl md:rounded-[2.5rem] border border-white/[0.04] p-4 flex flex-col justify-end shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden group cursor-pointer"
                     >
                        {/* Glow interno no hover */}
                        <div className="absolute inset-0 bg-[#ff6a00]/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ff6a00]/20 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                        {/* Imagem Placeholder Stikz (Fundo escuro/Asset clean) */}
                        <div className="absolute inset-x-4 top-4 bottom-24 rounded-[2rem] bg-[#111] overflow-hidden border border-white/[0.02] shadow-inner flex items-center justify-center p-4">
                           <img
                              src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1628260412297-1ecce342c8d2' : '1557683316-973673baf926'}?auto=format&fit=crop&q=80`}
                              alt="Stikz Asset"
                              className="w-full h-full object-cover rounded-xl opacity-60 mix-blend-screen group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-110 ease-out"
                           />
                           {/* Overlay simulando a figurinha real cortada */}
                           <div className="absolute bg-white text-black font-black text-xs md:text-sm px-4 py-2 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                              {i % 2 === 0 ? 'GARANTA JÁ' : 'NOVIDADE'}
                           </div>
                        </div>

                        {/* Meta info da figurinha */}
                        <div className="relative z-10 w-full flex justify-between items-center px-2">
                           <div className="flex flex-col">
                              <span className="text-white/90 font-bold text-sm md:text-md tracking-tight">Pack #{24 + i}</span>
                              <span className="text-white/30 text-[10px] md:text-xs font-medium uppercase tracking-widest">Urgência</span>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#ff6a00] group-hover:border-[#ff6a00] transition-colors">
                              <ArrowRight className="w-3 h-3 text-white/50 group-hover:text-white transition-colors" />
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>

               {/* FILEIRA 2 <- Esquerda (animada pelo `marquee-reverse`) */}
               <div className="flex w-max shrink-0 animate-marquee-reverse hover:[animation-play-state:paused] items-center gap-6 md:gap-8 pr-8 transition-all duration-300">
                  {[...Array(12)].map((_, i) => (
                     <motion.div
                        whileHover={{ scale: 1.05, y: -5, zIndex: 30 }}
                        key={`row2-${i}`}
                        className="w-48 h-56 md:w-72 md:h-80 shrink-0 bg-[#0a0a0a] rounded-3xl md:rounded-[2.5rem] border border-white/[0.04] p-4 flex flex-col justify-end shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden group cursor-pointer"
                     >
                        {/* Glow interno no hover sutilmente diferente pra não saturar */}
                        <div className="absolute inset-0 bg-[#ff9d2e]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute top-0 right-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-[-30deg] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>

                        {/* Imagem Placeholder Stikz */}
                        <div className="absolute inset-x-4 top-4 bottom-24 rounded-[2rem] bg-[#111] overflow-hidden border border-white/[0.02] shadow-inner flex items-center justify-center p-4">
                           <img
                              src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1618005182384-a83a8bd57fbe' : '1550684848-fac1c5b4e853'}?auto=format&fit=crop&q=80`}
                              alt="Stikz Asset"
                              className="w-full h-full object-cover rounded-xl opacity-60 mix-blend-screen grayscale-[50%] group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 ease-out"
                           />
                           <div className="absolute bg-[#ff6a00] text-white font-black text-xs md:text-sm px-4 py-2 rounded-xl shadow-[0_10px_30px_rgba(255,106,0,0.5)] transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                              {i % 2 === 0 ? 'ÚLTIMAS VAGAS' : 'PROMO 50%'}
                           </div>
                        </div>

                        {/* Meta info da figurinha */}
                        <div className="relative z-10 w-full flex justify-between items-center px-2">
                           <div className="flex flex-col text-left">
                              <span className="text-white/90 font-bold text-sm md:text-md tracking-tight">Pack #{48 + i}</span>
                              <span className="text-white/30 text-[10px] md:text-xs font-medium uppercase tracking-widest">Escassez</span>
                           </div>
                           <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#ff6a00] group-hover:border-[#ff6a00] transition-colors">
                              <ArrowRight className="w-3 h-3 text-white/50 group-hover:text-white transition-colors" />
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 6. Benefícios Silenciosos (Cinematic View)                      */}
         {/* ------------------------------------------------------------- */}
         <section className="py-32 bg-[#0b0b0b] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <FadeIn>
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-28 text-center tracking-tighter text-white">
                     Por que o Stikz <br className="hidden md:block" /> <span className="text-[#ff6a00] drop-shadow-md">converte tanto?</span>
                  </h2>
               </FadeIn>

               <div className="grid md:grid-cols-3 gap-y-20 gap-x-16 relative z-10">
                  <FadeIn delay={0.1} className="flex flex-col text-left group">
                     <div className="w-full h-px bg-white/10 mb-10 relative">
                        <div className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-[#ff6a00] to-transparent group-hover:w-full transition-all duration-1000 ease-in-out"></div>
                     </div>
                     <h3 className="font-bold text-3xl mb-6 text-white tracking-tight flex items-center gap-4">01. 100% Online</h3>
                     <p className="text-white/40 text-lg font-light leading-[1.8]">
                        Você nunca precisará lotar a galeria do seu celular com centenas de imagens avulsas. Acesse a biblioteca invisível a partir de qualquer navegador e aparelho celular.
                     </p>
                  </FadeIn>

                  <FadeIn delay={0.3} className="flex flex-col text-left group">
                     <div className="w-full h-px bg-white/10 mb-10 relative">
                        <div className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-[#ff6a00] to-transparent group-hover:w-full transition-all duration-1000 ease-in-out"></div>
                     </div>
                     <h3 className="font-bold text-3xl mb-6 text-white tracking-tight flex items-center gap-4">02. Nitidez Intocável</h3>
                     <p className="text-white/40 text-lg font-light leading-[1.8]">
                        Desenvolvido nas exatas proporções anti-compressão da plataforma. A fita ou selo aplicado no Story permanecerá magistralmente focado, injetando High-End no seu visual diário.
                     </p>
                  </FadeIn>

                  <FadeIn delay={0.5} className="flex flex-col text-left group">
                     <div className="w-full h-px bg-white/10 mb-10 relative">
                        <div className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-[#ff6a00] to-transparent group-hover:w-full transition-all duration-1000 ease-in-out"></div>
                     </div>
                     <h3 className="font-bold text-3xl mb-6 text-white tracking-tight flex items-center gap-4">03. Focado no Bolso</h3>
                     <p className="text-white/40 text-lg font-light leading-[1.8]">
                        Você não encontra "desenhos". Você explora categorias prontas voltadas unicamente para conversão: Escassez, Urgência, Autoridade. Pense no lucro final e aplique rápido.
                     </p>
                  </FadeIn>
               </div>
            </div>
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 8. OFERTA PRINCIPAL (A "Masterpiece" Box)                      */}
         {/* ------------------------------------------------------------- */}
         <section className="py-44 relative bg-[#070707] flex justify-center">
            {/* LUZ DE FUNDO DA OFERTA SUPER INTENSA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] h-[900px] bg-[#ff6a00]/[0.04] rounded-full blur-[200px] pointer-events-none"></div>
            <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-t from-[#ff6a00]/10 to-transparent"></div>

            <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
               <FadeIn>
                  <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[1.0] text-white">
                     Tenha a força de uma Agência.
                  </h2>
                  <p className="text-white/50 text-xl md:text-2xl mb-20 max-w-3xl mx-auto font-light leading-[1.6]">
                     Por menos de uma pizza no mês, você garante o fator visual corporativo que estava impedindo você de cobrar mais caro pelo seu próprio produto.
                  </p>
               </FadeIn>

               <FadeIn delay={0.3}>
                  <motion.div
                     className="bg-gradient-to-b from-[#1c1c1c] to-[#0b0b0b] border-[3px] border-[#ff6a00]/40 max-w-2xl mx-auto rounded-[3.5rem] p-12 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,1),_0_0_80px_rgba(255,106,0,0.15),_inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden flex flex-col items-center"
                  >
                     {/* Cúpula de luz suave interir ao card */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-[#ff6a00]/10 blur-[100px] rounded-full pointer-events-none"></div>

                     <div className="inline-flex bg-[#000] border border-[#ff6a00]/30 text-[#ff6a00] font-black px-6 py-2.5 rounded-full text-xs md:text-sm mb-12 uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(255,106,0,0.2)]">
                        Acesso Vitalício
                     </div>

                     <h3 className="text-3xl font-bold text-white mb-8 tracking-tight">O App Completo Stikz</h3>

                     <div className="text-8xl md:text-[8rem] font-black text-white mb-10 flex justify-center items-center gap-1 drop-shadow-2xl">
                        <div className="flex flex-col items-end mr-3 pb-6 md:pb-8">
                           <span className="text-2xl text-white/20 line-through font-light block mb-2 relative -top-2">R$ 197</span>
                           <span className="text-4xl md:text-5xl text-[#ff6a00] font-bold">R$</span>
                        </div>
                        <span className="tracking-[-0.08em] relative text-transparent bg-clip-text bg-gradient-to-b from-white to-[#a0a0a0]">
                           37
                        </span>
                        <span className="text-2xl md:text-3xl text-white/30 font-light pb-6 md:pb-8 ml-3">,00</span>
                     </div>

                     <div className="h-px w-[80%] bg-gradient-to-r from-transparent via-[#ff6a00]/40 to-transparent mb-12"></div>

                     <ul className="space-y-6 text-left mb-16 w-full font-light text-lg text-white/70 px-4">
                        <li className="flex gap-5 items-start"><Check className="text-[#ff6a00] drop-shadow-[0_0_5px_#ff6a00] w-6 h-6 shrink-0 mt-0.5" /> <span>Acesso Ilimitado e Vitalício ao sistema stikz. Sem letras miúdas.</span></li>
                        <li className="flex gap-5 items-start"><Check className="text-[#ff6a00] drop-shadow-[0_0_5px_#ff6a00] w-6 h-6 shrink-0 mt-0.5" /> <span>Pagamento único. Pare de pagar mensalidades caras.</span></li>
                        <li className="flex gap-5 items-start"><Check className="text-[#ff6a00] drop-shadow-[0_0_5px_#ff6a00] w-6 h-6 shrink-0 mt-0.5" /> <span>Atualizações futuras garantidas (sempre pacotes novos adicionados).</span></li>
                     </ul>

                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full max-w-[90%] mx-auto relative group">
                        {/* Super Glow no CTA Hero */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-[#ff6a00] to-[#ff9d2e] rounded-full blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <Link href="/cadastro" className="relative flex items-center justify-center bg-gradient-to-b from-[#ff8b3d] to-[#e65a00] border border-white/20 text-white w-full py-6 sm:py-7 rounded-full font-black text-xl md:text-2xl transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden">
                           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
                           <span className="relative z-10 tracking-widest uppercase drop-shadow-md">Garantir Meu Acesso</span>
                        </Link>
                     </motion.div>
                     <span className="block text-[11px] text-center font-bold text-[#ff6a00]/60 mt-10 uppercase tracking-[0.3em]">Pagamento 100% Seguro</span>
                  </motion.div>
               </FadeIn>
            </div>
         </section>

         {/* 9. FAQ Minimalista (Acordeão Moderno) */}
         <section className="py-40 bg-[#0b0b0b] border-t border-white/[0.02]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
               <FadeIn>
                  <h2 className="text-3xl md:text-5xl font-black mb-20 text-center text-white tracking-tight">Arquitetura de Conhecimento</h2>
               </FadeIn>
               <FadeIn delay={0.2} className="space-y-4 max-w-3xl mx-auto">
                  {faqs.map((faq, i) => (
                     <div key={i} className={`rounded-3xl overflow-hidden transition-all duration-500 bg-[#121212] border ${openFaq === i ? 'border-[#ff6a00]/30 shadow-[0_10px_30px_rgba(255,106,0,0.05)]' : 'border-white/5 hover:border-white/10'}`}>
                        <button
                           onClick={() => toggleFaq(i)}
                           className="w-full flex items-center justify-between p-8 md:p-10 text-left focus:outline-none"
                        >
                           <span className={`font-bold text-lg md:text-xl tracking-tight pr-4 transition-colors duration-300 ${openFaq === i ? 'text-white' : 'text-white/60'}`}>{faq.q}</span>
                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 shadow-inner ${openFaq === i ? 'bg-gradient-to-br from-[#ff6a00] to-[#cc5600] text-white shadow-[0_0_15px_rgba(255,106,0,0.5)]' : 'bg-[#1a1a1a] text-white/30 border border-white/5'}`}>
                              <ChevronDown className={`w-6 h-6 transform transition-transform duration-500 ${openFaq === i ? 'rotate-180' : ''}`} />
                           </div>
                        </button>
                        <AnimatePresence>
                           {openFaq === i && (
                              <motion.div
                                 initial={{ height: 0, opacity: 0 }}
                                 animate={{ height: "auto", opacity: 1 }}
                                 exit={{ height: 0, opacity: 0 }}
                                 transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                 className="overflow-hidden"
                              >
                                 <div className="px-8 md:px-10 pb-10 pt-0">
                                    <p className="text-white/40 text-lg md:text-xl font-light leading-[1.8]">{faq.a}</p>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                     </div>
                  ))}
               </FadeIn>
            </div>
         </section>

         {/* 10. Garantia Condescendente Inabalável */}
         <section className="pt-36 pb-48 relative overflow-hidden bg-[#070707] text-center flex flex-col items-center border-y border-white/[0.02]">
            <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
               <FadeIn>
                  <div className="w-28 h-28 rounded-full bg-gradient-to-b from-[#1a1a1a] to-transparent flex items-center justify-center mb-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_20px_40px_rgba(0,0,0,1)] border border-[#ff6a00]/20 relative">
                     <ShieldCheck className="w-12 h-12 text-[#ff6a00] drop-shadow-[0_0_5px_#ff6a00]" />
                     <div className="absolute inset-0 rounded-full border border-[#ff6a00]/10 scale-[1.3] opacity-30"></div>
                     <div className="absolute inset-0 rounded-full border border-[#ff6a00]/10 scale-[1.6] opacity-10"></div>
                  </div>
               </FadeIn>
               <FadeIn delay={0.2}>
                  <h2 className="text-4xl md:text-6xl font-black mb-10 tracking-tighter text-white">Garantia Total de 7 Dias.</h2>
               </FadeIn>
               <FadeIn delay={0.3}>
                  <p className="text-xl md:text-2xl text-white/40 mb-16 max-w-3xl mx-auto font-light leading-[1.7]">
                     Compre, acesse a biblioteca e use no seu perfil. Se você achar que a qualidade e as visualizações dos seus Stories continuam exatamente iguais, nós devolvemos cada centavo do seu dinheiro no mesmo dia via PIX. Sem burocracia, 1 clique e estorno imediato.
                  </p>
               </FadeIn>

               <FadeIn delay={0.4}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                     <Link href="/cadastro" className="inline-flex items-center justify-center gap-4 border border-white/20 text-white bg-transparent hover:bg-white/5 hover:border-white/40 px-12 py-6 rounded-full font-bold text-[13px] md:text-sm transition-all uppercase tracking-[0.25em] shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                        Quero Renovar Minha Autoridade
                     </Link>
                  </motion.div>
               </FadeIn>
            </div>
         </section>

         {/* Footer Minimalista Elite */}
         <footer className="py-20 bg-[#000] text-text-secondary font-light text-sm border-t border-white/[0.03]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-10 text-center">
               <div className="flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-md flex items-center justify-center bg-white/20 shadow-inner">
                        <Z className="w-3.5 h-3.5 text-white" />
                     </div>
                     <span className="font-extrabold text-2xl text-white tracking-tighter">Stikz<span className="text-[#ff6a00]">.</span></span>
                  </div>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.3em]">Operador Sistêmico Visual © {new Date().getFullYear()}</p>
               </div>

               <div className="flex flex-wrap justify-center gap-8 md:gap-12 tracking-[0.25em] text-[10px] uppercase font-bold opacity-30 mt-4">
                  <Link href="#" className="hover:text-white hover:opacity-100 transition-all duration-300">Normas Criptográficas</Link>
                  <Link href="#" className="hover:text-white hover:opacity-100 transition-all duration-300">Termos Legais</Link>
                  <Link href="#" className="hover:text-white hover:opacity-100 transition-all duration-300">Acesso Ao Núcleo de Suporte</Link>
               </div>
            </div>
         </footer>
      </div>
   );
}

// Minimalist Decorator SVG (Refined)
function Z({ className }: { className?: string }) {
   return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
         <path d="M4 6h16M4 18h16M7 6l10 12" />
      </svg>
   );
}
