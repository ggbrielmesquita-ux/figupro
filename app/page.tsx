'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
   ArrowRight, CheckCircle2, Zap, Trophy, ShieldCheck,
   ChevronDown, Star, MessageSquareQuote, Check,
   Camera, TrendingUp, Users, Copy, DownloadCloud, MonitorSmartphone, Eye, MousePointerClick
} from 'lucide-react';

// Componente isolado do Slider Premium contínuo
const stickerRows = {
   top: [1, 2, 3, 4, 5, 6, 7, 8, 9],
   bottom: [10, 11, 12, 13, 14, 15, 16, 17, 18],
} as const;

type MarqueeTrackProps = {
   items: readonly number[];
   direction: 'left' | 'right';
   tone: 'orange' | 'amber';
};

const MarqueeTrack = ({ items, direction, tone }: MarqueeTrackProps) => {
   const trackRef = useRef<HTMLDivElement>(null);
   const groupRef = useRef<HTMLDivElement>(null);
   const hoveringRef = useRef(false);

   useEffect(() => {
      const track = trackRef.current;
      const group = groupRef.current;

      if (!track || !group) return;

      const mobileQuery = window.matchMedia('(max-width: 767px)');
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const speedForScreen = () => {
         const mobileSpeed = direction === 'right' ? 18 : 20;
         const desktopSpeed = direction === 'right' ? 34 : 38;
         const speed = mobileQuery.matches ? mobileSpeed : desktopSpeed;
         return reducedMotionQuery.matches ? speed * 0.55 : speed;
      };

      let groupWidth = group.scrollWidth;
      let offset = direction === 'right' ? -groupWidth : 0;
      let currentSpeed = speedForScreen();
      let lastTime = performance.now();
      let frame = 0;

      const measure = () => {
         groupWidth = group.scrollWidth;
         offset = direction === 'right' ? -groupWidth : 0;
      };

      const animate = (time: number) => {
         const deltaTime = Math.min((time - lastTime) / 1000, 0.05);
         lastTime = time;

         const normalSpeed = speedForScreen();
         const targetSpeed = hoveringRef.current ? normalSpeed * 0.42 : normalSpeed;
         currentSpeed += (targetSpeed - currentSpeed) * Math.min(deltaTime * 4, 1);

         offset += currentSpeed * deltaTime * (direction === 'right' ? 1 : -1);

         if (direction === 'right' && offset >= 0) offset -= groupWidth;
         if (direction === 'left' && offset <= -groupWidth) offset += groupWidth;

         track.style.transform = `translate3d(${offset}px, 0, 0)`;
         frame = requestAnimationFrame(animate);
      };

      const resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(group);
      mobileQuery.addEventListener('change', measure);
      reducedMotionQuery.addEventListener('change', measure);

      measure();
      frame = requestAnimationFrame(animate);

      return () => {
         cancelAnimationFrame(frame);
         resizeObserver.disconnect();
         mobileQuery.removeEventListener('change', measure);
         reducedMotionQuery.removeEventListener('change', measure);
      };
   }, [direction]);

   return (
      <div
         className={`sticker-marquee-row sticker-marquee-row--${tone}`}
         onPointerEnter={() => { hoveringRef.current = true; }}
         onPointerLeave={() => { hoveringRef.current = false; }}
      >
         <div ref={trackRef} className="sticker-marquee-track">
            {[0, 1].map((copy) => (
               <div
                  key={copy}
                  ref={copy === 0 ? groupRef : undefined}
                  className="sticker-marquee-group"
                  aria-hidden={copy === 1}
               >
                  {items.map((num) => (
                     <div className="sticker-tile" key={`${direction}-${copy}-${num}`}>
                        <Image
                           src={`/img/optimized/fig-${num}.webp`}
                           alt={copy === 0 ? `Figurinha Premium ${num}` : ''}
                           width={512}
                           height={512}
                           loading="lazy"
                           decoding="async"
                           draggable={false}
                        />
                     </div>
                  ))}
               </div>
            ))}
         </div>
      </div>
   );
};

// Componente isolado da vitrine premium continua.
const VitrineSlider = () => (
   <div className="sticker-marquee">
      <MarqueeTrack items={stickerRows.top} direction="right" tone="orange" />
      <MarqueeTrack items={stickerRows.bottom} direction="left" tone="amber" />
   </div>
);
// Reusable cinematic scroll animation
const FadeIn = ({ children, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
   <div className={className}>
      {children}
   </div>
);

export default function LandingPage() {
   const [openFaq, setOpenFaq] = useState<number | null>(0);
   const [mounted, setMounted] = useState(false);
   const [isMobileHero, setIsMobileHero] = useState(false);

   useEffect(() => {
      setMounted(true);

      const mediaQuery = window.matchMedia('(max-width: 639px)');
      const updateHeroMode = () => setIsMobileHero(mediaQuery.matches);

      updateHeroMode();
      mediaQuery.addEventListener('change', updateHeroMode);

      return () => mediaQuery.removeEventListener('change', updateHeroMode);
   }, []);

   const toggleFaq = (index: number) => {
      setOpenFaq(openFaq === index ? null : index);
   };

   const faqs = [
      {
         q: "Como eu uso as figurinhas?",
         a: "Acesse a biblioteca, escolha a peça visual que combina com o seu conteúdo, copie, cole no Story e publique."
      },
      {
         q: "Funciona em quais plataformas?",
         a: "Você pode usar no Instagram, WhatsApp, TikTok, Reels e em qualquer app que permita colar elementos visuais."
      },
      {
         q: "As figurinhas são atualizadas?",
         a: "Sim. Novas peças são adicionadas com frequência para manter a biblioteca atual, útil e alinhada ao que chama atenção nos Stories."
      },
      {
         q: "Posso testar sem risco?",
         a: "Sim. Você tem 7 dias para usar, avaliar e decidir com calma. Se não fizer sentido, devolvemos 100% do valor."
      }
   ];

   if (!mounted) return null; // Previne hydration mismatch no framer motion blur

   return (
      <div className="min-h-screen w-screen max-w-[100vw] bg-[#0b0b0b] text-white selection:bg-[#ff6a00] selection:text-white font-sans overflow-x-hidden relative">

         {/* 🔮 Efeitos Estilísticos Globais (Glows & Partículas Incorpóreas) */}
         <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Grid background sutil */}
            <div className="absolute inset-0 texture-grid opacity-[0.02]"></div>
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#ff6a00]/[0.03] to-transparent"></div>
         </div>

         {/* 🚀 Navbar Glassmorphism Ultra Premium */}
         <nav className="fixed top-0 w-full z-50 bg-[#0b0b0b]/62 backdrop-blur-lg md:backdrop-blur-xl border-b border-white/[0.04] shadow-[0_10px_24px_rgba(0,0,0,0.42)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex justify-between h-20 sm:h-24 items-center">
                  <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                     <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#ff6a00] to-[#ff9d2e] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),_0_0_16px_rgba(255,106,0,0.32)] transition-transform duration-200"
                     >
                        <span className="text-sm font-black leading-none text-white drop-shadow-md">Z</span>
                     </motion.div>
                     <span className="font-extrabold text-xl sm:text-2xl tracking-tighter text-white drop-shadow-lg">Stikz<span className="text-[#ff6a00]">.</span></span>
                  </Link>
                  <div className="flex items-center">
                     <Link href="/cadastro" className="text-white/70 hover:text-white transition-colors font-bold text-xs sm:text-sm border border-[#ff6a00]/20 bg-[#ff6a00]/10 hover:bg-[#ff6a00]/15 px-4 sm:px-5 py-2 rounded-full backdrop-blur-md uppercase tracking-[0.12em]">
                        Começar
                     </Link>
                  </div>
               </div>
            </div>
         </nav>

         {/* ------------------------------------------------------------- */}
         {/* ⭐️ HERO SECTION MÁXIMA (Cinematográfica e Imersiva)           */}
         {/* ------------------------------------------------------------- */}
         <section className="relative w-full max-w-[100vw] pt-24 sm:pt-40 lg:pt-52 pb-20 sm:pb-28 lg:pb-40 flex flex-col items-center justify-center min-h-[92svh] z-10 overflow-hidden">

            {/* LUZ DE FUNDO DO HERO & PARTÍCULAS (Composição Rica) */}
            <div className="absolute inset-0 bg-[#0b0b0b] -z-20"></div>
            <div className="absolute top-0 left-0 w-full h-[60vh] texture-speckle opacity-[0.12] mix-blend-screen pointer-events-none -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0b0b]/80 to-[#0b0b0b] pointer-events-none -z-10"></div>

            {/* Core Glow Radial */}
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[520px] md:h-[700px] bg-[#ff6a00]/[0.07] rounded-full blur-[90px] md:blur-[160px] -z-10 pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[32%] right-[-12%] w-[420px] h-[420px] md:w-[800px] md:h-[800px] bg-[#ff9d2e]/[0.035] rounded-full blur-[80px] md:blur-[130px] -z-10 mix-blend-screen"></div>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">

               {/* Label Glass Ultra Premium */}
               <FadeIn delay={0.1}>
                  <motion.div
                     whileHover={{ scale: 1.05 }}
                     className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-full bg-black/40 border border-white/[0.08] text-white/90 font-bold text-[9px] sm:text-[10px] md:text-sm uppercase tracking-[0.18em] sm:tracking-[0.25em] mb-5 sm:mb-10 md:mb-12 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_0_22px_rgba(255,106,0,0.16)] ring-1 ring-white/5 relative overflow-hidden"
                  >
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ff6a00]/10 to-transparent"></div>
                     <div className="w-2 h-2 rounded-full bg-[#ff6a00] shadow-[0_0_10px_#ff6a00,0_0_20px_#ff6a00] animate-pulse"></div>
                     Presença visual para Stories
                  </motion.div>
               </FadeIn>

               {/* Headline Impactante e Direta */}
               <FadeIn delay={0.2} className="relative w-full max-w-5xl">
                  <h1 className="font-black tracking-tighter mb-4 sm:mb-8 text-white drop-shadow-2xl flex flex-col items-center leading-tight">
                     <span className="text-[1.05rem] min-[390px]:text-lg sm:text-3xl md:text-4xl lg:text-5xl text-white/90 mb-2 max-w-[21rem] sm:max-w-4xl leading-[1.08]">
                        Seus Stories passam<br className="sm:hidden" /> despercebidos.
                     </span>
                     <span className="text-[1.88rem] min-[390px]:text-[2.05rem] sm:text-5xl md:text-7xl lg:text-8xl leading-[0.95] relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] via-[#ff9d2e] to-[#ffb15c] pb-2 max-w-[21rem] sm:max-w-5xl">
                        <span className="hidden sm:inline">Com as Figurinhas Premium, eles chamam atenção.</span>
                        <span className="sm:hidden">Com as<br />Figurinhas<br />Premium,<br />eles chamam atenção.</span>
                        {/* Curva luminosa leve */}
                        <div className="absolute bottom-0 left-[10%] w-[80%] h-[4px] bg-gradient-to-r from-transparent via-[#ff6a00]/60 to-transparent blur-md rounded-full"></div>
                        <div className="absolute bottom-[2px] left-[20%] w-[60%] h-[1px] bg-[#ffb15c]/50 rounded-full"></div>
                     </span>
                  </h1>
               </FadeIn>

               {/* Subheadline Direta (Benefício + Ação) */}
               <FadeIn delay={0.3}>
                  <p className="mt-0 sm:mt-2 text-[0.9rem] sm:text-lg md:text-xl text-white/60 max-w-[18rem] sm:max-w-3xl mx-auto mb-5 sm:mb-10 md:mb-12 leading-[1.55] md:leading-[1.8] font-light">
                     Transforme qualquer publicação comum em um conteúdo visual que prende, destaca e eleva a percepção do seu perfil em segundos.
                  </p>
               </FadeIn>

               {/* CTA Extremamente Iluminado (Scale + Glow) */}
               <FadeIn delay={0.4}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="relative group mx-auto inline-block w-full max-w-[296px] min-[390px]:max-w-[318px] sm:max-w-none sm:w-auto">
                     {/* Mega Glow Hover Effect */}
                     <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-[#ff6a00] to-[#ff9d2e] rounded-full blur-lg sm:blur-xl opacity-35 sm:opacity-40 group-hover:opacity-65 transition-opacity duration-200 pointer-events-none"></div>
                     <div className="absolute -inset-1 bg-white/20 rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-200 pointer-events-none"></div>

                     <Link href="/cadastro" className="relative flex items-center justify-center gap-2.5 sm:gap-4 bg-gradient-to-b from-[#ff832b] via-[#ff6a00] to-[#cc5600] border-t border-[#ffb15c]/50 border-b-2 border-black/50 text-white px-3 sm:px-10 py-3.5 sm:py-5 md:py-6 rounded-full font-black text-[0.7rem] min-[390px]:text-[0.76rem] sm:text-lg md:text-xl transition-[transform,opacity,box-shadow] duration-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_16px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="absolute inset-0 texture-sheen opacity-20 mix-blend-overlay"></div>

                        {/* Brilho cruzando o botão */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-25 transition-opacity duration-200 pointer-events-none"></div>

                        <span className="relative z-10 tracking-[0.08em] sm:tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-nowrap">Quero destacar meus Stories</span>
                        <div className="relative z-10 bg-black/20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] shrink-0">
                           <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:scale-105 transition-transform duration-200 text-white" />
                        </div>
                     </Link>
                  </motion.div>
               </FadeIn>

               <FadeIn delay={0.5}>
                  <p className="mt-6 sm:mt-8 text-white/50 text-[11px] sm:text-sm flex items-center gap-2 sm:gap-3 font-semibold uppercase tracking-[0.14em] sm:tracking-widest bg-black/30 w-max max-w-full mx-auto px-4 sm:px-5 py-2 rounded-full border border-white/5 backdrop-blur-md">
                     <Zap className="w-4 h-4 text-[#ff6a00] drop-shadow-[0_0_8px_#ff6a00] fill-[#ff6a00]" /> Acesso imediato
                  </p>
               </FadeIn>

               {/* 📱 Mockup Celular Hiper-Realista e Cênico */}
               <FadeIn delay={0.55} className="mt-10 sm:mt-20 md:mt-28 relative w-full max-w-full flex justify-center perspective-[2000px] z-20">

                  {/* Glow radial leve atrás do celular. */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[104%] max-w-[520px] h-[360px] md:h-[600px] bg-[#ff6a00]/[0.13] rounded-full blur-[55px] md:blur-[100px] -z-10 mix-blend-screen"></div>

                  {/* Sombras Base Ultra Realistas conectando ao chão */}
                  <div className="absolute -bottom-[28px] md:-bottom-[50px] w-[82%] max-w-[620px] h-[46px] md:h-[80px] bg-black blur-[28px] md:blur-[50px] rounded-[100%]"></div>
                  <div className="absolute -bottom-[10px] md:-bottom-[20px] left-1/2 -translate-x-1/2 w-[58%] max-w-[360px] h-[20px] md:h-[30px] bg-black blur-[14px] md:blur-[20px] rounded-[100%]"></div>

                  {/* 3D Wrapper */}
                  <motion.div
                     animate={{ y: [0, -10, 0] }}
                     transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                     className="w-[78vw] min-w-[260px] max-w-[304px] min-[390px]:max-w-[316px] sm:max-w-[360px] md:max-w-[440px] aspect-[9/19] rounded-[3rem] md:rounded-[4rem] bg-[#050505] border-[3px] md:border-[4px] border-[#2a2a2a] mobile-soft-shadow shadow-[-22px_36px_70px_rgba(0,0,0,0.82),_0_0_48px_rgba(255,106,0,0.18),_inset_0_4px_12px_rgba(255,255,255,0.08)] md:shadow-[-30px_50px_100px_rgba(0,0,0,0.9),_0_0_80px_rgba(255,106,0,0.25),_inset_0_5px_15px_rgba(255,255,255,0.1)] relative overflow-hidden flex flex-col pt-10 md:pt-14 px-5 md:px-8 ring-1 ring-white/10 origin-center"
                     style={{
                        rotateX: isMobileHero ? "4deg" : "12deg",
                        rotateY: isMobileHero ? "0deg" : "-7deg",
                        rotateZ: isMobileHero ? "0deg" : "5deg",
                        transformStyle: "preserve-3d",
                     }}
                  >
                     {/* Lateral do Celular (Efeito 3D borda direita) */}
                     <div className="absolute top-0 right-0 w-4 h-full bg-gradient-to-r from-transparent to-white/10 mix-blend-screen pointer-events-none"></div>

                     {/* Emulação do Notch Metálico */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 md:h-8 bg-[#111] rounded-b-3xl shadow-[inset_0_-2px_10px_rgba(0,0,0,0.8),_0_2px_5px_rgba(0,0,0,0.5)] border-b border-x border-[#333] z-50"></div>
                     <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 md:w-16 h-1 md:h-1.5 bg-[#050505] rounded-full z-50"></div>

                     {/* Gradiente Interno Tela Base */}
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] -z-10"></div>
                     <div className="absolute top-0 left-0 w-full h-[40%] bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay"></div>

                     {/* Header do story REALSITA */}
                     <div className="flex items-center justify-between mb-5 md:mb-8 relative z-10 pt-1 md:pt-2 px-1">
                        <div className="flex items-center gap-2 md:gap-3">
                           <Image src="https://i.pravatar.cc/120?img=47" alt="Avatar" width={36} height={36} decoding="async" className="w-7 h-7 md:w-9 md:h-9 rounded-full object-cover border border-white/20 shadow-md" />
                           <div className="flex flex-col">
                              <span className="text-white text-[10px] md:text-xs font-semibold drop-shadow-md">@gabriel.daily</span>
                              <span className="text-white/50 text-[8px] md:text-[9px] drop-shadow-md">3 h</span>
                           </div>
                        </div>
                        <div className="flex gap-1">
                           <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                           <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                           <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                        </div>
                     </div>

                     {/* Tela Rica Stikz Aplicada - Contexto LIFESTYLE NEUTRO */}
                     <div className="flex-1 bg-[#111] rounded-[2rem] md:rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-between pb-5 md:pb-8 relative overflow-hidden group mb-6 md:mb-10 shadow-[inset_0_0_34px_rgba(0,0,0,0.75)]">
                        <Image src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=640&q=72" alt="Contexto Lifestyle Coffee" width={640} height={960} decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

                        {/* Top Spacer */}
                        <div></div>

                        {/* Sticker Hiper Imersivo Aplicado no Story */}
                        <motion.div
                           initial={{ scale: 0.8, rotate: -6, opacity: 0 }}
                           animate={{ scale: 1, rotate: -2, opacity: 1 }}
                           transition={{ delay: 1.5, type: "spring", stiffness: 120, damping: 10 }}
                           className="bg-black/80 p-3 md:p-5 rounded-2xl shadow-[0_14px_28px_rgba(0,0,0,0.72),_0_0_22px_rgba(255,106,0,0.32),_inset_0_2px_2px_rgba(255,255,255,0.18)] backdrop-blur-md md:backdrop-blur-xl relative z-10 transform-gpu flex flex-col items-center"
                        >
                           <div className="bg-[#ff6a00] text-black text-[8px] md:text-[10px] uppercase font-black tracking-widest px-2 md:px-3 py-1 rounded-sm mb-2 transform -skew-x-12">Presença</div>
                           <span className="text-white font-black text-2xl md:text-3xl uppercase tracking-tighter leading-[0.9] block drop-shadow-2xl text-center">
                              Visual<br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-[#aaa]">Premium</span>
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
         {/* 1.4 VITRINE PRIMÁRIA (Duplicada para peso visual forte em cima) */}
         {/* ------------------------------------------------------------- */}
         <section className="pt-8 sm:pt-14 md:pt-20 pb-4 md:pb-10 bg-[#030303] overflow-hidden relative">
             <VitrineSlider />
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 1.5 PROVA VISUAL DE IMPACTO (Antes vs Depois)                   */}
         {/* ------------------------------------------------------------- */}
         <section className="py-20 md:py-32 relative z-10 bg-[#050505] overflow-hidden">
            {/* Transição suave do Hero para cá (Fade do preto pro escuro) */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[#0b0b0b] to-transparent"></div>

            {/* Luz de Fundo da Seção */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[900px] h-[320px] md:h-[400px] bg-[#ff6a00]/[0.03] rounded-full blur-[70px] md:blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
               <FadeIn>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-5 md:mb-6 tracking-tighter text-white leading-tight">
                     A diferença está em <span className="text-[#ff6a00] drop-shadow-[0_0_15px_rgba(255,106,0,0.5)]">como você apresenta.</span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-2xl text-white/50 mb-12 md:mb-20 max-w-2xl mx-auto font-light leading-relaxed">
                     Antes: Stories comuns, ignorados. Depois: Stories com presença, destaque e impacto.
                  </p>
               </FadeIn>

               <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24 max-w-5xl mx-auto relative perspective-1000">

                  {/* ------------------------ ANTES (Sem stikz) ------------------------ */}
                  <FadeIn delay={0.2} className="relative flex flex-col items-center w-full lg:w-auto">
                     <div className="mb-8 bg-[#111] border border-white/10 text-white/40 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-[0.25em]">
                        Antes: comum
                     </div>

                     <div className="w-full max-w-[300px] aspect-[9/19] rounded-[3rem] bg-[#0f0f0f] border-4 border-[#1a1a1a] shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col px-5 pt-10 ring-1 ring-white/5 opacity-80 filter grayscale-[30%]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-[#1a1a1a] rounded-b-2xl"></div>
                        <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-black/50 to-transparent mix-blend-overlay"></div>

                        <div className="flex items-center justify-between mb-4 relative z-10 pt-2 px-1">
                           <div className="flex items-center gap-2">
                              <Image src="https://i.pravatar.cc/120?img=33" alt="Avatar" width={28} height={28} loading="lazy" decoding="async" className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-md" />
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

                        {/* Fundo do Story comum */}
                        <div className="flex-1 rounded-[2rem] bg-[#1a1a1a] flex flex-col justify-between items-center relative overflow-hidden mb-6 border border-white/5 pb-8">
                           <Image src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=520&q=72" alt="Produto Tech" width={520} height={920} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-60" />

                           <div></div>

                           {/* Texto nativo do instagram "feio" */}
                           <div className="bg-black/40 px-3 py-1 rounded-sm relative z-10 flex flex-col items-center">
                              <span className="text-white font-sans text-xs bg-[#ff2200] max-w-max px-1">NOVIDADE NO PERFIL</span>
                              <span className="text-white font-sans font-bold text-sm bg-black px-1 mt-1">CONFIRA AGORA</span>
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
                        Depois: com presença
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
                              <Image src="https://i.pravatar.cc/120?img=33" alt="Avatar" width={28} height={28} loading="lazy" decoding="async" className="w-7 h-7 rounded-full object-cover border border-white/20 shadow-md" />
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

                        {/* Fundo do Story com presença visual */}
                        <div className="flex-1 rounded-[2rem] bg-[#111] flex flex-col justify-between items-center relative overflow-hidden mb-6 border border-white/10 shadow-[inner_0_0_30px_rgba(0,0,0,0.8)] group pb-8">
                           <Image src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=520&q=72" alt="Produto Tech" width={520} height={920} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                           <div></div>

                           {/* Figurinha STIKZ Hiper Premium no Story */}
                           <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
                              className="bg-black/40 px-4 py-3 border border-white/20 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.9),_0_0_20px_rgba(255,106,0,0.3),_inset_0_1px_2px_rgba(255,255,255,0.4)] backdrop-blur-xl relative z-10 transform -rotate-3 flex flex-col items-center"
                           >
                              <div className="bg-[#ff6a00] text-black text-[9px] uppercase font-black px-2 py-0.5 rounded-sm mb-1">Conteúdo em destaque</div>
                              <span className="text-white font-black text-lg uppercase tracking-tighter block drop-shadow-xl text-center">
                                 Visual que prende
                                 <div className="text-[#ff6a00] flex justify-center drops-shadow-xl">
                                    <span className="text-2xl font-black">o olhar</span>
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
         <section className="py-20 md:py-36 relative z-10 bg-[#0b0b0b]">
            {/* LUZ DE FUNDO SUAVE */}
            <div className="absolute top-0 right-[-30%] md:right-[-20%] w-[420px] md:w-[800px] h-[420px] md:h-[800px] bg-[#ff6a00]/[0.02] rounded-full blur-[70px] md:blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <FadeIn>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black mb-6 md:mb-8 tracking-tight leading-[1.05] text-white">
                     A atenção hoje é disputada<br />
                     <span className="text-[#ff6a00]/90">em segundos.</span>
                  </h2>
               </FadeIn>

               <FadeIn delay={0.2} className="relative z-10">
                  <p className="text-base sm:text-lg md:text-2xl text-white/50 mb-12 md:mb-24 max-w-4xl mx-auto font-light leading-[1.6]">
                     Se o seu Story não chama atenção no primeiro olhar, ele simplesmente é ignorado. Você não perde engajamento por falta de conteúdo. Você perde por falta de impacto visual.
                  </p>
               </FadeIn>

               <div className="grid md:grid-cols-2 gap-6 md:gap-10 text-left max-w-5xl mx-auto relative perspective-1000">
                  {/* Linha Divisória de Luz Cinematográfica */}
                  <div className="hidden md:block absolute top-[50%] left-[45%] right-[45%] h-[2px] bg-gradient-to-r from-transparent via-[#ff6a00]/40 to-transparent z-0 blur-[1px]"></div>

                  {/* Card comum (neutro e discreto) */}
                  <FadeIn delay={0.3} className="relative z-10 h-full">
                     <div className="bg-gradient-to-br from-[#141414] to-[#0a0a0a] p-7 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[3rem] border border-white/[0.03] opacity-75 md:opacity-60 hover:opacity-100 transition-opacity duration-700 h-full flex flex-col justify-center gap-6 md:gap-8 shadow-2xl relative overflow-hidden group">
                        {/* Inner top highlight */}
                        <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] pointer-events-none"></div>

                        <h3 className="font-bold text-white/40 text-base sm:text-xl flex items-center gap-3 sm:gap-4 uppercase tracking-[0.15em]">
                           <span className="w-3 h-3 rounded-full bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.12)]"></span>
                           Story comum
                        </h3>
                        <ul className="space-y-4 sm:space-y-6 text-white/40 font-light text-base sm:text-lg">
                           <li className="flex gap-4 items-start"><MonitorSmartphone className="w-7 h-7 shrink-0 opacity-30 mt-0.5" /> Compete com centenas de publicações parecidas.</li>
                           <li className="flex gap-4 items-start"><MonitorSmartphone className="w-7 h-7 shrink-0 opacity-30 mt-0.5" /> Passa rápido, sem criar retenção visual.</li>
                        </ul>
                     </div>
                  </FadeIn>

                  {/* Card Stikz (Quente, Rico, Iluminado) */}
                  <FadeIn delay={0.5} className="relative z-10 h-full">
                     <div className="bg-gradient-to-br from-[#1c140d] via-[#120a05] to-[#0b0b0b] p-7 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[3rem] border border-[#ff6a00]/40 shadow-[0_28px_56px_rgba(0,0,0,0.72),_0_0_44px_rgba(255,106,0,0.1),_inset_0_2px_4px_rgba(255,255,255,0.08)] md:shadow-[0_40px_80px_rgba(0,0,0,0.8),_0_0_80px_rgba(255,106,0,0.12),_inset_0_2px_4px_rgba(255,255,255,0.1)] backdrop-blur-xl md:backdrop-blur-3xl h-full flex flex-col justify-center gap-6 md:gap-8 relative overflow-hidden transform hover:-translate-y-3 transition-transform duration-500">
                        {/* Efeito Glass/Blurry Glow interior */}
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#ff6a00]/10 rounded-full blur-[80px] pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none"></div>

                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#ff6a00] to-[#e65a00] text-white px-6 py-2 text-[10px] font-extrabold uppercase tracking-[0.25em] rounded-bl-3xl rounded-tr-[3rem] shadow-[0_0_20px_rgba(255,106,0,0.5)]">
                           Mais impacto
                        </div>

                        <h3 className="font-bold text-white text-base sm:text-xl flex items-center gap-3 sm:gap-4 uppercase tracking-[0.15em] relative z-10 mt-2">
                           <span className="w-3 h-3 rounded-full bg-[#ff6a00] shadow-[0_0_15px_#ff6a00]"></span>
                           Com Stikz
                        </h3>
                        <ul className="space-y-4 sm:space-y-6 text-white/90 font-light text-base sm:text-lg relative z-10">
                           <li className="flex gap-4 items-start"><CheckCircle2 className="w-7 h-7 shrink-0 text-[#ff6a00] drop-shadow-[0_0_8px_#ff6a00] mt-0.5" /> Stories com presença visual imediatamente maior.</li>
                           <li className="flex gap-4 items-start"><CheckCircle2 className="w-7 h-7 shrink-0 text-[#ff6a00] drop-shadow-[0_0_8px_#ff6a00] mt-0.5" /> Mais clareza para chamadas, avisos e mensagens importantes.</li>
                           <li className="flex gap-4 items-start"><CheckCircle2 className="w-7 h-7 shrink-0 text-[#ff6a00] drop-shadow-[0_0_8px_#ff6a00] mt-0.5" /> Percepção mais profissional, mesmo com conteúdo simples.</li>
                           <li className="flex gap-4 items-start"><CheckCircle2 className="w-7 h-7 shrink-0 text-[#ff6a00] drop-shadow-[0_0_8px_#ff6a00] mt-0.5" /> Escolha, copie, cole e publique.</li>
                        </ul>
                     </div>
                  </FadeIn>
               </div>
            </div>
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 2.5 IMPACTO VISUAL (Atenção -> Presença)                         */}
         {/* ------------------------------------------------------------- */}
         <section className="py-20 md:py-32 relative z-10 bg-[#020202] border-y border-white/[0.05] overflow-hidden">
            <div className="absolute top-0 right-1/2 w-[380px] md:w-[600px] h-[380px] md:h-[600px] bg-[#ff6a00]/[0.03] rounded-full blur-[70px] md:blur-[120px] pointer-events-none translate-x-1/2"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                  <FadeIn>
                     <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-[#ff6a00]/10 border border-[#ff6a00]/20 text-[#ff8b3d] font-black text-[10px] md:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] mb-7 md:mb-10 shadow-[0_0_20px_rgba(255,106,0,0.15)]">
                        <TrendingUp className="w-4 h-4" /> O que muda
                     </div>
                     <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter mb-6 md:mb-8 text-white leading-tight">
                        O que muda quando o visual <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#ff6a00] to-[#cc5600] drop-shadow-xl">chama atenção</span>
                     </h2>
                  </FadeIn>
                  
                  <FadeIn delay={0.2}>
                     <p className="text-base sm:text-lg md:text-2xl text-white/50 mb-12 md:mb-20 font-light leading-[1.6]">
                        Um Story com presença visual não depende de exagero. Ele organiza a mensagem, valoriza o conteúdo e faz a pessoa parar por mais alguns segundos.
                     </p>
                  </FadeIn>
               </div>

               <div className="grid md:grid-cols-3 gap-5 md:gap-8 max-w-6xl mx-auto relative z-10">
                  <FadeIn delay={0.3}>
                     <div className="bg-[#111] border border-white/5 p-7 sm:p-10 md:p-12 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center text-center shadow-[0_22px_44px_rgba(0,0,0,0.72),_inset_0_1px_1px_rgba(255,255,255,0.02)] md:shadow-[0_30px_60px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.02)] backdrop-blur-xl md:backdrop-blur-3xl h-full transform hover:-translate-y-2 transition-transform duration-500 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Eye className="w-9 h-9 md:w-12 md:h-12 text-white/30 mb-5 md:mb-8 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-black text-xl md:text-2xl mb-3 md:mb-4 uppercase tracking-wider">1. Mais atenção imediata</h4>
                        <p className="text-white/50 text-base leading-relaxed font-light">Seus Stories deixam de ser ignorados e passam a ser notados.</p>
                     </div>
                  </FadeIn>
                  
                  <FadeIn delay={0.4}>
                     <div className="bg-[#111] border border-white/5 p-7 sm:p-10 md:p-12 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center text-center shadow-[0_22px_44px_rgba(0,0,0,0.72),_inset_0_1px_1px_rgba(255,255,255,0.02)] md:shadow-[0_30px_60px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.02)] backdrop-blur-xl md:backdrop-blur-3xl h-full transform hover:-translate-y-2 transition-transform duration-500 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <MousePointerClick className="w-9 h-9 md:w-12 md:h-12 text-white/50 mb-5 md:mb-8 relative z-10 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-black text-xl md:text-2xl mb-3 md:mb-4 uppercase tracking-wider relative z-10">2. Mais interação</h4>
                        <p className="text-white/50 text-base leading-relaxed font-light relative z-10">Quando o visual chama atenção, as pessoas param, respondem e interagem.</p>
                     </div>
                  </FadeIn>

                  <FadeIn delay={0.5}>
                     <div className="bg-gradient-to-br from-[#1c140d] to-[#0a0a0a] border border-[#ff6a00]/30 p-7 sm:p-10 md:p-12 rounded-[2rem] md:rounded-[3rem] flex flex-col items-center text-center shadow-[0_28px_56px_rgba(255,106,0,0.12),_0_18px_34px_rgba(0,0,0,0.72),_inset_0_1px_2px_rgba(255,255,255,0.08)] md:shadow-[0_40px_80px_rgba(255,106,0,0.15),_0_20px_40px_rgba(0,0,0,0.8),_inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-xl md:backdrop-blur-3xl h-full transform hover:-translate-y-3 transition-transform duration-500 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 bg-[#ff6a00]/16 md:bg-[#ff6a00]/20 blur-[40px] md:blur-[60px] rounded-full mix-blend-screen pointer-events-none"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        
                        <Trophy className="w-9 h-9 md:w-12 md:h-12 text-[#ff6a00] mb-5 md:mb-8 drop-shadow-[0_0_12px_#ff6a00] md:drop-shadow-[0_0_15px_#ff6a00] relative z-10 group-hover:scale-110 transition-transform" />
                        <h4 className="text-white font-black text-xl md:text-2xl mb-3 md:mb-4 uppercase tracking-wider relative z-10">3. Mais presença digital</h4>
                        <p className="text-white/80 text-base leading-relaxed font-light relative z-10">Seu perfil passa a transmitir mais profissionalismo, mesmo com conteúdo simples.</p>
                     </div>
                  </FadeIn>
               </div>
            </div>
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 3. A SOLUÇÃO (Illuminated Steps)                                */}
                           {/* ------------------------------------------------------------- */}
                           <section className="py-24 md:py-40 relative overflow-hidden bg-[#070707]">
                              {/* Luz que vem do chão (Bottom Light) */}
                              <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[80%] max-w-[1200px] h-[220px] md:h-[300px] bg-[#ff6a00]/5 rounded-[100%] blur-[70px] md:blur-[120px] pointer-events-none"></div>

                              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                                 <FadeIn className="text-center">
                                    <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 md:mb-8 text-white leading-tight">
                                       Tudo o que você precisa,<br />
                                       <span className="text-[#ff6a00] drop-shadow-md">em um único lugar.</span>
                                    </h2>
                                 </FadeIn>
                                 <FadeIn delay={0.2}>
                                    <p className="mt-4 md:mt-6 text-base sm:text-lg md:text-xl text-white/50 font-light max-w-3xl mx-auto mb-14 md:mb-28 text-center leading-[1.6]">
                                       Pare de depender de edições complexas, apps confusos ou ideias que não funcionam. Tenha recursos prontos para melhorar seu visual, destacar seu conteúdo e elevar a percepção do seu perfil.
                                    </p>
                                 </FadeIn>

                                 <div className="grid md:grid-cols-3 gap-6 md:gap-12 max-w-6xl mx-auto relative">

                                    <FadeIn delay={0.3} className="relative group">
                                       <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] p-7 sm:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-[0_22px_44px_rgba(0,0,0,0.78),_inset_0_1px_1px_rgba(255,255,255,0.05)] md:shadow-[0_30px_60px_rgba(0,0,0,0.9),_inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl md:backdrop-blur-3xl h-full flex flex-col items-center text-center hover:border-white/10 transition-colors relative z-10 hover:-translate-y-2 duration-500">
                                          <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] pointer-events-none"></div>
                                          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#1a1a1a] rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-8 border border-white/5 relative z-10 shadow-[0_16px_28px_rgba(0,0,0,0.68)] md:shadow-[0_20px_40px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500">
                                             <DownloadCloud className="w-9 h-9 md:w-12 md:h-12 text-white/50 group-hover:text-white transition-colors" />
                                             <div className="absolute -inset-2 bg-white/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"></div>
                                             <span className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a00] to-[#cc5600] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,106,0,0.4)] text-lg border border-[#ffb15c]/30 z-20">1</span>
                                          </div>
                                          <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 tracking-tight text-white relative z-10">Melhore seu visual</h3>
                                          <p className="text-white/50 font-light text-base md:text-lg leading-relaxed relative z-10">Acesse peças prontas para dar mais acabamento aos seus Stories.</p>
                                       </div>
                                    </FadeIn>

                                    <FadeIn delay={0.5} className="relative group">
                                       <div className="bg-gradient-to-b from-[#1c140d] to-[#0b0b0b] p-7 sm:p-10 rounded-[2rem] md:rounded-[3rem] border border-[#ff6a00]/20 shadow-[0_28px_56px_rgba(255,106,0,0.12),_0_18px_34px_rgba(0,0,0,0.72),_inset_0_1px_1px_rgba(255,255,255,0.08)] md:shadow-[0_40px_80px_rgba(255,106,0,0.15),_0_20px_40px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl md:backdrop-blur-3xl h-full flex flex-col items-center text-center hover:border-[#ff6a00]/40 transition-[colors,transform] transform hover:-translate-y-3 duration-500 relative z-20">
                                          <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none"></div>
                                          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-gradient-to-br from-[#331100] to-[#110500] rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-8 border border-[#ff6a00]/30 relative z-10 shadow-[0_18px_34px_rgba(255,106,0,0.1)] group-hover:scale-105 transition-transform duration-500">
                                             <Copy className="w-9 h-9 md:w-12 md:h-12 text-[#ff6a00] drop-shadow-[0_0_10px_#ff6a00]" />
                                             <div className="absolute -inset-4 bg-[#ff6a00]/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-200 z-0"></div>
                                             <span className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a00] to-[#cc5600] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,106,0,0.6)] text-lg border border-[#ffb15c]/30 z-20">2</span>
                                          </div>
                                          <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 tracking-tight text-white relative z-10">Destaque seu conteúdo</h3>
                                          <p className="text-white/80 font-light text-base md:text-lg leading-relaxed relative z-10">Use chamadas, selos e elementos visuais que valorizam a mensagem.</p>
                                       </div>
                                    </FadeIn>

                                    <FadeIn delay={0.7} className="relative group">
                                       <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] p-7 sm:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 shadow-[0_22px_44px_rgba(0,0,0,0.78),_inset_0_1px_1px_rgba(255,255,255,0.05)] md:shadow-[0_30px_60px_rgba(0,0,0,0.9),_inset_0_1px_1px_rgba(255,255,255,0.05)] backdrop-blur-xl md:backdrop-blur-3xl h-full flex flex-col items-center text-center hover:border-white/10 transition-colors relative z-10 hover:-translate-y-2 duration-500">
                                          <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.03)] pointer-events-none"></div>
                                          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-[#1a1a1a] rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center mb-6 md:mb-8 border border-white/5 relative z-10 shadow-[0_16px_28px_rgba(0,0,0,0.68)] md:shadow-[0_20px_40px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-500">
                                             <MonitorSmartphone className="w-9 h-9 md:w-12 md:h-12 text-white/50 group-hover:text-white transition-colors" />
                                             <div className="absolute -inset-2 bg-white/5 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"></div>
                                             <span className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6a00] to-[#cc5600] flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(255,106,0,0.4)] text-lg border border-[#ffb15c]/30 z-20">3</span>
                                          </div>
                                          <h3 className="text-2xl md:text-3xl font-black mb-3 md:mb-4 tracking-tight text-white relative z-10">Publique com presença</h3>
                                          <p className="text-white/50 font-light text-base md:text-lg leading-relaxed relative z-10">Escolha, copie, cole e publique com um visual mais profissional.</p>
                                       </div>
                                    </FadeIn>
                                 </div>
                              </div>
                           </section>
         {/* ------------------------------------------------------------- */}
         {/* 5. A BIBLIOTECA (Vitrine Premium Dupla)                         */}
         {/* ------------------------------------------------------------- */}
         <section className="pt-20 md:pt-32 pb-24 md:pb-44 bg-[#030303] overflow-hidden relative border-y border-white/[0.02] group/carousel-wrapper">
            {/* Luz de Separação Superior/Inferior Cinematográfica */}
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff6a00]/30 to-transparent"></div>
            <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff6a00]/30 to-transparent"></div>

            {/* Ambient Glow */}
            <div className="absolute top-[20%] left-[10%] w-[320px] md:w-[500px] h-[320px] md:h-[500px] bg-[#ff6a00]/[0.02] rounded-full blur-[70px] md:blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[20%] right-[10%] w-[360px] md:w-[600px] h-[360px] md:h-[600px] bg-[#ff9d2e]/[0.02] rounded-full blur-[80px] md:blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-10 md:mb-20">
               <FadeIn>
                  <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] text-white/60 font-bold text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.25em] mb-6 md:mb-8 backdrop-blur-md">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] shadow-[0_0_8px_#ff6a00] animate-pulse"></div>
                     Biblioteca premium
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-5 md:mb-6 tracking-tighter text-white drop-shadow-2xl leading-tight">
                     Sistema completo <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-[#ffb15c] drop-shadow-[0_0_15px_rgba(255,106,0,0.3)]">de figurinhas.</span>
                  </h2>
                  <p className="text-white/50 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed">
                     Um acervo visual desenvolvido com base no que realmente chama atenção dentro dos Stories. Nada genérico: cada elemento foi pensado para destacar.
                  </p>
               </FadeIn>
            </div>

            {/* Aplicando o componente isolado */}
            <VitrineSlider />
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 6. Benefícios Silenciosos (Cinematic View)                      */}
         {/* ------------------------------------------------------------- */}
         <section className="py-20 md:py-32 bg-[#0b0b0b] relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <FadeIn>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-14 md:mb-28 text-center tracking-tighter text-white leading-tight">
                     Por que escolher <br className="hidden md:block" /> <span className="text-[#ff6a00] drop-shadow-md">a Stikz</span>
                  </h2>
               </FadeIn>

               <div className="grid md:grid-cols-3 gap-y-12 md:gap-y-20 gap-x-16 relative z-10">
                  <FadeIn delay={0.1} className="flex flex-col text-left group">
                     <div className="w-full h-px bg-white/10 mb-6 md:mb-10 relative">
                        <div className="absolute top-0 left-0 h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#ff6a00] to-transparent group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                     </div>
                     <h3 className="font-bold text-2xl md:text-3xl mb-4 md:mb-6 text-white tracking-tight flex items-center gap-4">01. Visual mais profissional</h3>
                     <p className="text-white/40 text-base md:text-lg font-light leading-[1.7] md:leading-[1.8]">
                        Eleve o acabamento dos seus Stories instantaneamente, sem depender de design complexo.
                     </p>
                  </FadeIn>

                  <FadeIn delay={0.3} className="flex flex-col text-left group">
                     <div className="w-full h-px bg-white/10 mb-6 md:mb-10 relative">
                        <div className="absolute top-0 left-0 h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#ff6a00] to-transparent group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                     </div>
                     <h3 className="font-bold text-2xl md:text-3xl mb-4 md:mb-6 text-white tracking-tight flex items-center gap-4">02. Mais atenção e retenção</h3>
                     <p className="text-white/40 text-base md:text-lg font-light leading-[1.7] md:leading-[1.8]">
                        Elementos visuais bem posicionados ajudam a prender o olhar no primeiro contato.
                     </p>
                  </FadeIn>

                  <FadeIn delay={0.5} className="flex flex-col text-left group">
                     <div className="w-full h-px bg-white/10 mb-6 md:mb-10 relative">
                        <div className="absolute top-0 left-0 h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#ff6a00] to-transparent group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                     </div>
                     <h3 className="font-bold text-2xl md:text-3xl mb-4 md:mb-6 text-white tracking-tight flex items-center gap-4">03. Conteúdo mais atrativo</h3>
                     <p className="text-white/40 text-base md:text-lg font-light leading-[1.7] md:leading-[1.8]">
                        Transforme chamadas simples em mensagens mais claras, bonitas e memoráveis.
                     </p>
                  </FadeIn>

                  <FadeIn delay={0.2} className="flex flex-col text-left group">
                     <div className="w-full h-px bg-white/10 mb-6 md:mb-10 relative">
                        <div className="absolute top-0 left-0 h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#ff6a00] to-transparent group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                     </div>
                     <h3 className="font-bold text-2xl md:text-3xl mb-4 md:mb-6 text-white tracking-tight flex items-center gap-4">04. Processo simples</h3>
                     <p className="text-white/40 text-base md:text-lg font-light leading-[1.7] md:leading-[1.8]">
                        Escolha, copie e cole. O fluxo é rápido, direto e pensado para uso no celular.
                     </p>
                  </FadeIn>

                  <FadeIn delay={0.4} className="flex flex-col text-left group">
                     <div className="w-full h-px bg-white/10 mb-6 md:mb-10 relative">
                        <div className="absolute top-0 left-0 h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#ff6a00] to-transparent group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                     </div>
                     <h3 className="font-bold text-2xl md:text-3xl mb-4 md:mb-6 text-white tracking-tight flex items-center gap-4">05. Biblioteca organizada</h3>
                     <p className="text-white/40 text-base md:text-lg font-light leading-[1.7] md:leading-[1.8]">
                        Recursos prontos para encontrar rapidamente o que combina com cada publicação.
                     </p>
                  </FadeIn>

                  <FadeIn delay={0.6} className="flex flex-col text-left group">
                     <div className="w-full h-px bg-white/10 mb-6 md:mb-10 relative">
                        <div className="absolute top-0 left-0 h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#ff6a00] to-transparent group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                     </div>
                     <h3 className="font-bold text-2xl md:text-3xl mb-4 md:mb-6 text-white tracking-tight flex items-center gap-4">06. Atualizações frequentes</h3>
                     <p className="text-white/40 text-base md:text-lg font-light leading-[1.7] md:leading-[1.8]">
                        Novas figurinhas são adicionadas para manter seu conteúdo atual e relevante.
                     </p>
                  </FadeIn>

                  <FadeIn delay={0.7} className="flex flex-col text-left group md:col-start-2">
                     <div className="w-full h-px bg-white/10 mb-6 md:mb-10 relative">
                        <div className="absolute top-0 left-0 h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#ff6a00] to-transparent group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                     </div>
                     <h3 className="font-bold text-2xl md:text-3xl mb-4 md:mb-6 text-white tracking-tight flex items-center gap-4">07. Acesso imediato</h3>
                     <p className="text-white/40 text-base md:text-lg font-light leading-[1.7] md:leading-[1.8]">
                        Comece a usar logo após o acesso, sem instalar aplicativo ou aprender ferramentas complexas.
                     </p>
                  </FadeIn>
               </div>
            </div>
         </section>

         {/* ------------------------------------------------------------- */}
         {/* 8. OFERTA PRINCIPAL (A "Masterpiece" Box)                      */}
         {/* ------------------------------------------------------------- */}
         <section className="py-24 md:py-44 relative bg-[#070707] flex justify-center">
            {/* LUZ DE FUNDO DA OFERTA SUPER INTENSA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[760px] md:max-w-[900px] h-[520px] md:h-[900px] bg-[#ff6a00]/[0.04] rounded-full blur-[90px] md:blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-0 w-full h-[200px] bg-gradient-to-t from-[#ff6a00]/10 to-transparent"></div>

            <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
               <FadeIn>
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-5 md:mb-6 tracking-tighter leading-[1.0] text-white">
                     Chegou a hora de se destacar.
                  </h2>
                  <p className="text-white/50 text-base sm:text-lg md:text-2xl mb-12 md:mb-20 max-w-3xl mx-auto font-light leading-[1.6]">
                     Pare de postar conteúdo comum. Comece a postar com presença.
                  </p>
               </FadeIn>

               <FadeIn delay={0.3}>
                  <motion.div
                     className="bg-gradient-to-b from-[#1c1c1c] to-[#0b0b0b] border-[2px] md:border-[3px] border-[#ff6a00]/40 max-w-2xl mx-auto rounded-[2rem] md:rounded-[3.5rem] p-7 sm:p-12 md:p-16 shadow-[0_30px_60px_rgba(0,0,0,0.86),_0_0_44px_rgba(255,106,0,0.12),_inset_0_1px_1px_rgba(255,255,255,0.08)] md:shadow-[0_50px_100px_rgba(0,0,0,1),_0_0_80px_rgba(255,106,0,0.15),_inset_0_1px_1px_rgba(255,255,255,0.1)] relative overflow-hidden flex flex-col items-center"
                  >
                     {/* Cúpula de luz suave interir ao card */}
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-[#ff6a00]/10 blur-[100px] rounded-full pointer-events-none"></div>

                     <div className="inline-flex bg-[#000] border border-[#ff6a00]/30 text-[#ff6a00] font-black px-4 sm:px-6 py-2.5 rounded-full text-[10px] md:text-sm mb-8 md:mb-12 uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-[0_0_22px_rgba(255,106,0,0.16)]">
                        Acesso vitalício
                     </div>

                     <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 tracking-tight">O que você vai receber</h3>

                     <div className="text-7xl md:text-[8rem] font-black text-white mb-8 md:mb-10 flex justify-center items-center gap-1 drop-shadow-2xl">
                        <div className="flex flex-col items-end mr-2 md:mr-3 pb-5 md:pb-8">
                           <span className="text-xl md:text-2xl text-white/20 line-through font-light block mb-2 relative -top-2">R$ 197</span>
                           <span className="text-4xl md:text-5xl text-[#ff6a00] font-bold">R$</span>
                        </div>
                        <span className="tracking-[-0.08em] relative text-transparent bg-clip-text bg-gradient-to-b from-white to-[#a0a0a0]">
                           37
                        </span>
                        <span className="text-2xl md:text-3xl text-white/30 font-light pb-6 md:pb-8 ml-3">,00</span>
                     </div>

                     <div className="h-px w-[80%] bg-gradient-to-r from-transparent via-[#ff6a00]/40 to-transparent mb-12"></div>

                     <ul className="space-y-4 md:space-y-6 text-left mb-10 md:mb-16 w-full font-light text-base md:text-lg text-white/70 px-1 sm:px-4">
                        <li className="flex gap-5 items-start"><Check className="text-[#ff6a00] drop-shadow-[0_0_5px_#ff6a00] w-6 h-6 shrink-0 mt-0.5" /> <span><strong className="text-white font-semibold">Sistema completo de figurinhas.</strong> Um acervo visual desenvolvido para destacar seus Stories.</span></li>
                        <li className="flex gap-5 items-start"><Check className="text-[#ff6a00] drop-shadow-[0_0_5px_#ff6a00] w-6 h-6 shrink-0 mt-0.5" /> <span><strong className="text-white font-semibold">Atualizações constantes.</strong> Novas figurinhas adicionadas frequentemente para manter seu conteúdo atual.</span></li>
                        <li className="flex gap-5 items-start"><Check className="text-[#ff6a00] drop-shadow-[0_0_5px_#ff6a00] w-6 h-6 shrink-0 mt-0.5" /> <span><strong className="text-white font-semibold">Compatível com qualquer plataforma.</strong> Use no Instagram, WhatsApp, TikTok, Reels e outros formatos.</span></li>
                        <li className="flex gap-5 items-start"><Check className="text-[#ff6a00] drop-shadow-[0_0_5px_#ff6a00] w-6 h-6 shrink-0 mt-0.5" /> <span><strong className="text-white font-semibold">Simples e imediato.</strong> Escolha, copie, cole e publique.</span></li>
                     </ul>

                     <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full max-w-full sm:max-w-[90%] mx-auto relative group">
                        {/* Super Glow no CTA Hero */}
                        <div className="absolute -inset-1.5 md:-inset-2 bg-gradient-to-r from-[#ff6a00] to-[#ff9d2e] rounded-full blur-lg md:blur-xl opacity-45 md:opacity-55 group-hover:opacity-75 transition-opacity duration-200"></div>
                        <Link href="/cadastro" className="relative flex items-center justify-center bg-gradient-to-b from-[#ff8b3d] to-[#e65a00] border border-white/20 text-white w-full py-4 sm:py-6 md:py-7 rounded-full font-black text-sm sm:text-xl md:text-2xl transition-[transform,opacity,box-shadow] duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden">
                           <div className="absolute inset-0 texture-sheen opacity-20 mix-blend-overlay"></div>
                           <span className="relative z-10 tracking-[0.14em] sm:tracking-widest uppercase drop-shadow-md">Quero melhorar meus Stories</span>
                        </Link>
                     </motion.div>
                     <span className="block text-[11px] text-center font-bold text-[#ff6a00]/60 mt-10 uppercase tracking-[0.3em]">Acesso imediato e pagamento seguro</span>
                  </motion.div>
               </FadeIn>
            </div>
         </section>

         {/* 9. FAQ Minimalista (Acordeão Moderno) */}
         <section className="py-24 md:py-40 bg-[#0b0b0b] border-t border-white/[0.02]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
               <FadeIn>
                  <h2 className="text-3xl md:text-5xl font-black mb-12 md:mb-20 text-center text-white tracking-tight">Perguntas frequentes</h2>
               </FadeIn>
               <FadeIn delay={0.2} className="space-y-4 max-w-3xl mx-auto">
                  {faqs.map((faq, i) => (
                     <div key={i} className={`rounded-3xl overflow-hidden transition-[border-color,box-shadow] duration-300 bg-[#121212] border ${openFaq === i ? 'border-[#ff6a00]/30 shadow-[0_10px_30px_rgba(255,106,0,0.05)]' : 'border-white/5 hover:border-white/10'}`}>
                        <button
                           onClick={() => toggleFaq(i)}
                           className="w-full flex items-center justify-between p-5 sm:p-8 md:p-10 text-left focus:outline-none"
                        >
                           <span className={`font-bold text-base sm:text-lg md:text-xl tracking-tight pr-4 transition-colors duration-300 ${openFaq === i ? 'text-white' : 'text-white/60'}`}>{faq.q}</span>
                           <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-[background-color,color,box-shadow] duration-300 shadow-inner ${openFaq === i ? 'bg-gradient-to-br from-[#ff6a00] to-[#cc5600] text-white shadow-[0_0_15px_rgba(255,106,0,0.5)]' : 'bg-[#1a1a1a] text-white/30 border border-white/5'}`}>
                              <ChevronDown className={`w-5 h-5 md:w-6 md:h-6 transform transition-transform duration-500 ${openFaq === i ? 'rotate-180' : ''}`} />
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
                                 <div className="px-5 sm:px-8 md:px-10 pb-7 md:pb-10 pt-0">
                                    <p className="text-white/40 text-base md:text-xl font-light leading-[1.7] md:leading-[1.8]">{faq.a}</p>
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
         <section className="pt-24 md:pt-36 pb-28 md:pb-48 relative overflow-hidden bg-[#070707] text-center flex flex-col items-center border-y border-white/[0.02]">
            <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
               <FadeIn>
                  <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-gradient-to-b from-[#1a1a1a] to-transparent flex items-center justify-center mb-8 md:mb-12 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_20px_40px_rgba(0,0,0,1)] border border-[#ff6a00]/20 relative">
                     <ShieldCheck className="w-9 h-9 md:w-12 md:h-12 text-[#ff6a00] drop-shadow-[0_0_5px_#ff6a00]" />
                     <div className="absolute inset-0 rounded-full border border-[#ff6a00]/10 scale-[1.3] opacity-30"></div>
                     <div className="absolute inset-0 rounded-full border border-[#ff6a00]/10 scale-[1.6] opacity-10"></div>
                  </div>
               </FadeIn>
               <FadeIn delay={0.2}>
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 md:mb-10 tracking-tighter text-white">Teste sem risco por 7 dias.</h2>
               </FadeIn>
               <FadeIn delay={0.3}>
                  <p className="text-base sm:text-lg md:text-2xl text-white/40 mb-10 md:mb-16 max-w-3xl mx-auto font-light leading-[1.65] md:leading-[1.7]">
                     Você pode usar, testar e avaliar com calma. Se não fizer sentido para você, devolvemos 100% do valor. Sem burocracia.
                  </p>
               </FadeIn>

               <FadeIn delay={0.4}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                     <Link href="/cadastro" className="inline-flex items-center justify-center gap-4 border border-white/20 text-white bg-transparent hover:bg-white/5 hover:border-white/40 px-7 sm:px-12 py-4 sm:py-6 rounded-full font-bold text-[11px] md:text-sm transition-[transform,opacity,background-color,border-color] duration-200 uppercase tracking-[0.16em] sm:tracking-[0.25em] shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                        Quero usar agora
                     </Link>
                  </motion.div>
               </FadeIn>
            </div>
         </section>

         {/* 11. Fechamento Premium */}
         <section className="py-24 md:py-36 relative overflow-hidden bg-[#050505] text-center">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff6a00]/30 to-transparent"></div>
            <div className="absolute left-1/2 top-1/2 w-[420px] md:w-[760px] h-[420px] md:h-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6a00]/[0.035] blur-[90px] md:blur-[150px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
               <FadeIn>
                  <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-5 md:mb-7 tracking-tighter leading-[1.0] text-white">
                     Seu conteúdo já é bom.
                  </h2>
                  <p className="text-white/50 text-lg sm:text-xl md:text-3xl mb-10 md:mb-14 font-light leading-[1.45]">
                     Só falta o visual acompanhar.
                  </p>
               </FadeIn>

               <FadeIn delay={0.2}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="relative group mx-auto inline-block w-full max-w-[320px] sm:max-w-none sm:w-auto">
                     <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-r from-[#ff6a00] to-[#ff9d2e] rounded-full blur-lg sm:blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-200 pointer-events-none"></div>
                     <Link href="/cadastro" className="relative flex items-center justify-center gap-3 bg-gradient-to-b from-[#ff832b] via-[#ff6a00] to-[#cc5600] border-t border-[#ffb15c]/50 border-b-2 border-black/50 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-full font-black text-[0.8rem] sm:text-lg transition-[transform,opacity,box-shadow] duration-200 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),_0_16px_30px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="absolute inset-0 texture-sheen opacity-20 mix-blend-overlay"></div>
                        <span className="relative z-10 tracking-[0.12em] sm:tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-nowrap">Quero usar agora</span>
                        <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200 text-white" />
                     </Link>
                  </motion.div>
               </FadeIn>
            </div>
         </section>

         {/* Footer Minimalista Elite */}
         <footer className="py-14 md:py-20 bg-[#000] text-text-secondary font-light text-sm border-t border-white/[0.03]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-10 text-center">
               <div className="flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity duration-500 cursor-default">
                  <div className="flex items-center gap-3">
                     <div className="w-6 h-6 rounded-md flex items-center justify-center bg-white/20 shadow-inner">
                        <Z className="w-3.5 h-3.5 text-white" />
                     </div>
                     <span className="font-extrabold text-2xl text-white tracking-tighter">Stikz<span className="text-[#ff6a00]">.</span></span>
                  </div>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.3em]">Stikz © {new Date().getFullYear()}</p>
               </div>

               <div className="flex flex-wrap justify-center gap-8 md:gap-12 tracking-[0.25em] text-[10px] uppercase font-bold opacity-30 mt-4">
                  <Link href="#" className="hover:text-white hover:opacity-100 transition-[color,opacity] duration-200">Privacidade</Link>
                  <Link href="#" className="hover:text-white hover:opacity-100 transition-[color,opacity] duration-200">Termos</Link>
                  <Link href="#" className="hover:text-white hover:opacity-100 transition-[color,opacity] duration-200">Suporte</Link>
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
