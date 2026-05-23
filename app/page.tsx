'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlignLeft,
  ArrowRight,
  Bike,
  Car,
  Check,
  ChevronDown,
  Clock,
  Copy,
  FolderOpen,
  Gift,
  Layers,
  MessageCircle,
  RefreshCw,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const CHECKOUT_URL = '/cadastro';

const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ??
  'https://api.whatsapp.com/send?text=Oi%2C%20quero%20saber%20mais%20sobre%20as%20Figurinhas%20Premium';

const stickerRows = {
  top: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  bottom: [10, 11, 12, 13, 14, 15, 16, 17, 18],
} as const;

type CategoryCard = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
};

const categoryCards: readonly CategoryCard[] = [
  { icon: Bike,        title: 'Grau de Moto',  description: 'Figurinhas para perfis de moto e grau',          color: '#ff8c00' },
  { icon: MessageCircle, title: 'Interativas', description: 'Caixinhas, enquetes e engajamento',               color: '#ff6b00' },
  { icon: Gift,        title: 'Rifas',          description: 'Selos, chamadas e urgência para rifeiros',        color: '#ffb86b' },
  { icon: Scissors,    title: 'Barbearia',      description: 'Visual premium para barbeiros',                   color: '#ff8c00' },
  { icon: ShoppingBag, title: 'Lojistas',       description: 'Promoções, preços e chamadas de venda',           color: '#ff6b00' },
  { icon: Car,         title: 'Carros',          description: 'Figurinhas para perfis automotivos',              color: '#ffb86b' },
  { icon: Layers,      title: 'Plataformas',    description: 'Pixbet, Sportingbet e outras',                    color: '#ff8c00' },
  { icon: AlignLeft,   title: 'Frases',          description: 'Chamadas poderosas e textos de impacto',          color: '#ff6b00' },
] as const;

type BenefitCard = {
  icon: React.ElementType;
  title: string;
  description: string;
};

const benefitCards: readonly BenefitCard[] = [
  { icon: FolderOpen,  title: 'Biblioteca por pastas',       description: 'Figurinhas organizadas em categorias para você achar o que precisa em segundos.' },
  { icon: Copy,        title: 'Copiar em 2 cliques',         description: 'Clicou, copiou. Cole direto no seu Story do Instagram sem complicação.' },
  { icon: RefreshCw,   title: 'Atualizações frequentes',     description: 'Novos packs adicionados regularmente para você nunca ficar desatualizado.' },
  { icon: Smartphone,  title: 'Funciona no celular',          description: 'Otimizado para uso mobile. Abra no celular e use na hora.' },
  { icon: Zap,         title: 'Acesso imediato',              description: 'Pagou, acessou. Sem esperar aprovação manual ou envio por e-mail.' },
  { icon: TrendingUp,  title: 'Mais engajamento',             description: 'Stories com identidade visual geram mais respostas, cliques e vendas.' },
] as const;

type StepCard = {
  step: string;
  title: string;
  description: string;
};

const howItWorksSteps: readonly StepCard[] = [
  { step: '01', title: 'Entre na STIKZ',               description: 'Faça login no painel e escolha a categoria que combina com seu perfil ou campanha.' },
  { step: '02', title: 'Escolha uma pasta',             description: 'Navegue pelas pastas organizadas: Rifas, Barbearia, Lojistas, Carros e muito mais.' },
  { step: '03', title: 'Copie e cole no Instagram',     description: 'Clique em Copiar, abra o Instagram e cole a figurinha direto no seu Story.' },
] as const;

type FaqItem = {
  q: string;
  a: string;
};

const faqs: readonly FaqItem[] = [
  { q: 'Como recebo o acesso?',                          a: 'Após o pagamento ser aprovado, seu acesso é liberado automaticamente. Você recebe os dados de login e já pode entrar no painel na mesma hora.' },
  { q: 'Funciona no Instagram?',                         a: 'Sim. As figurinhas são imagens PNG otimizadas para Stories do Instagram. Basta copiar na STIKZ e colar no seu Story.' },
  { q: 'Preciso instalar algum app?',                    a: 'Não. A STIKZ funciona 100% pelo navegador. Pode abrir no celular ou no computador, sem download.' },
  { q: 'O pagamento libera automaticamente?',            a: 'Sim. Assim que o pagamento for confirmado, sua conta é ativada de forma automática, sem aprovação manual.' },
  { q: 'Tem atualizações?',                              a: 'Sim. Novos packs são adicionados com frequência durante a vigência do seu acesso.' },
  { q: 'Posso usar pelo celular?',                       a: 'Pode. O sistema é responsivo e foi pensado para quem usa o celular para criar conteúdo.' },
  { q: 'As figurinhas são organizadas por categorias?',  a: 'Sim. Tudo está dividido por pastas: Grau de moto, Rifas, Barbearia, Lojistas, Carros, Plataformas e muito mais.' },
] as const;

// ─── Marquee ─────────────────────────────────────────────────────────────────

type MarqueeTrackProps = {
  items: readonly number[];
  direction: 'left' | 'right';
  tone: 'orange' | 'amber';
};

function MarqueeTrack({ items, direction, tone }: MarqueeTrackProps) {
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
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

function FaqAccordion({ faq, isOpen, onToggle }: { faq: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
        isOpen ? 'border-[#ff8c00]/25 bg-[#111]' : 'border-white/5 bg-[#0d0d0d] hover:border-white/10'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8c00]/50 sm:p-6"
      >
        <span className={`text-sm font-bold transition-colors duration-200 sm:text-base ${isOpen ? 'text-white' : 'text-white/55'}`}>
          {faq.q}
        </span>
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
            isOpen ? 'bg-[#ff8c00] text-white' : 'border border-white/10 bg-white/5 text-white/35'
          }`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm font-light leading-relaxed text-white/45 sm:px-6 sm:pb-6 sm:text-base">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-fit">
      {/* floating badges */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        className="absolute -left-12 top-14 z-20 hidden rounded-xl border border-[#ff8c00]/30 bg-black/80 px-3 py-2 text-[11px] font-black uppercase tracking-wide text-[#ff8c00] shadow-[0_0_18px_rgba(255,140,0,0.2)] backdrop-blur sm:block"
      >
        🔥 Trending
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 1 }}
        className="absolute -right-10 top-28 z-20 hidden rounded-xl border border-white/10 bg-black/80 px-3 py-2 text-[11px] font-bold text-white/65 shadow-lg backdrop-blur sm:block"
      >
        ✅ Acesso ativo
      </motion.div>
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -right-8 bottom-20 z-20 hidden rounded-2xl border border-[#ff8c00]/20 bg-[#ff8c00]/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#ffb566] backdrop-blur sm:block"
      >
        Copiar · 2 cliques
      </motion.div>

      {/* glow behind phone */}
      <div className="pointer-events-none absolute inset-0 -z-10 scale-75 rounded-full bg-[#ff8c00]/10 blur-[60px]" />

      {/* phone shell */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        className="relative w-[220px] rounded-[3rem] border-[3px] border-[#252525] bg-[#050505] p-3 shadow-[-18px_28px_60px_rgba(0,0,0,0.9),0_0_36px_rgba(255,140,0,0.1)] sm:w-[260px]"
      >
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-10 h-5 w-1/3 -translate-x-1/2 rounded-b-2xl bg-[#111]" />

        {/* screen */}
        <div className="overflow-hidden rounded-[2.4rem] bg-[#0a0a0a]">
          {/* top bar */}
          <div className="flex items-center justify-between bg-[#111] px-4 pb-3 pt-7">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#ff8c00] to-[#ff6b00] text-[10px] font-black text-white shadow-[0_0_10px_rgba(255,140,0,0.3)]">
                S
              </div>
              <div>
                <p className="text-[10px] font-bold leading-none text-white">STIKZ</p>
                <p className="mt-0.5 text-[8px] text-white/35">Selecione uma categoria</p>
              </div>
            </div>
            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-white/10">
              <div className="h-2 w-2 rounded-sm bg-white/25" />
            </div>
          </div>

          {/* category grid */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#0a0a0a] p-2.5">
            {(['Rifas', 'Barbearia', 'Carros', 'Lojistas'] as const).map((label, i) => {
              const colors = ['#ff8c00', '#ffb566', '#ff6b00', '#ff8c00'];
              return (
                <div key={label} className="rounded-xl border border-white/5 bg-[#111] p-2.5">
                  <div className="mb-1.5 h-2 w-2 rounded-full" style={{ background: colors[i] }} />
                  <p className="text-[9px] font-bold text-white/70">{label}</p>
                  <p className="mt-0.5 text-[7px] text-white/25">Pack disponível</p>
                </div>
              );
            })}
          </div>

          {/* sticker preview strip */}
          <div className="bg-[#0a0a0a] px-2.5 pb-3">
            <div className="rounded-xl border border-[#ff8c00]/20 bg-[#111] p-2">
              <p className="mb-1.5 text-[8px] font-black uppercase tracking-wider text-[#ff8c00]/60">Preview</p>
              <div className="mb-2 flex gap-1.5">
                {[0, 1, 2].map((n) => (
                  <div key={n} className="aspect-square flex-1 rounded-lg border border-white/5 bg-[#1a1a1a]" />
                ))}
              </div>
              <div className="rounded-lg bg-gradient-to-r from-[#ff8c00] to-[#ff6b00] py-1.5 text-center">
                <p className="text-[8px] font-black uppercase tracking-wider text-white">Copiar figurinha</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Z logo icon ──────────────────────────────────────────────────────────────

function ZIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 6h16M4 18h16M7 6l10 12" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-screen max-w-[100vw] overflow-x-hidden bg-[#080808] text-white selection:bg-[#ff8c00] selection:text-black">

      {/* ambient radial */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(255,140,0,0.05),transparent)]" />
      </div>

      {/* ─── 1. Header ──────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full border-b border-white/[0.05] bg-[#080808]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

          <Link href="/" aria-label="STIKZ início" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff8c00] to-[#ff6b00] shadow-[0_0_14px_rgba(255,140,0,0.28)]">
              <ZIcon className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              Stikz<span className="text-[#ff8c00]">.</span>
            </span>
          </Link>

          <nav aria-label="Navegação principal" className="hidden items-center gap-7 text-[13px] font-semibold text-white/45 md:flex">
            <Link href="#como-funciona" className="transition-colors hover:text-white">Como funciona</Link>
            <Link href="#categorias"    className="transition-colors hover:text-white">Categorias</Link>
            <Link href="#beneficios"    className="transition-colors hover:text-white">Benefícios</Link>
            <Link href="#precos"        className="transition-colors hover:text-white">Preço</Link>
          </nav>

          <Link
            href={CHECKOUT_URL}
            className="rounded-full bg-gradient-to-b from-[#ff9d2e] to-[#ff6b00] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_18px_rgba(255,140,0,0.22)] transition-transform hover:scale-105 sm:px-5 sm:text-sm"
          >
            Começar agora
          </Link>
        </div>
      </header>

      {/* ─── 2. Hero ────────────────────────────────────────────────── */}
      <section className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-28 sm:pt-36 lg:min-h-0 lg:py-40">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[30%] h-[700px] w-full max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff8c00]/[0.055] blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-14 lg:flex-row lg:items-center lg:gap-16">

          {/* text */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ff8c00]/20 bg-[#ff8c00]/[0.08] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#ffb566]"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff8c00]" />
              Para rifeiros, lojistas e criadores
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-[2.35rem] font-black leading-[1.0] tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-[3.6rem] xl:text-[4.2rem]"
            >
              Figurinhas prontas para{' '}
              <span className="bg-gradient-to-r from-[#ff8c00] via-[#ff9d2e] to-[#ffb86b] bg-clip-text text-transparent">
                transformar seus stories
              </span>{' '}
              em chamadas impossíveis de ignorar
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 text-base font-light leading-relaxed text-white/50 sm:text-lg lg:max-w-lg"
            >
              Copie, cole e use direto no Instagram. Packs organizados por categorias para criar stories mais chamativos, rápidos e profissionais.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center gap-3 sm:flex-row lg:items-start"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group relative w-full sm:w-auto">
                <div className="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff6b00] opacity-25 blur-xl transition-opacity group-hover:opacity-45" />
                <Link
                  href={CHECKOUT_URL}
                  className="relative flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#ff9d2e] to-[#ff6b00] px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.28),0_12px_28px_rgba(0,0,0,0.4)]"
                >
                  Quero acessar por R$ 19,99
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <Link
                href="#como-funciona"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white/60 transition-all hover:border-white/20 hover:text-white sm:w-auto"
              >
                Ver como funciona
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/35">
                <Check className="h-3.5 w-3.5 text-[#ff8c00]" /> Acesso imediato após o pagamento
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-white/35">
                <Check className="h-3.5 w-3.5 text-[#ff8c00]" /> Copiar e colar em 2 cliques
              </span>
            </motion.div>
          </div>

          {/* phone */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-shrink-0"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </section>

      {/* ─── 3. Vitrine ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#050505] py-8 sm:py-12">
        <p className="mb-6 text-center text-[10px] font-black uppercase tracking-[0.28em] text-white/20 sm:mb-8">
          Um arsenal visual pronto para seus stories
        </p>
        <div className="sticker-marquee">
          <MarqueeTrack items={stickerRows.top}    direction="right" tone="orange" />
          <MarqueeTrack items={stickerRows.bottom} direction="left"  tone="amber"  />
        </div>
      </section>

      {/* ─── 4. Problema ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#070707] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-12 text-center sm:mb-16">
            <h2 className="text-3xl font-black leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl">
              Seu story pode estar bom,
              <br />
              <span className="text-white/30">mas sem visual ele passa batido</span>
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base font-light text-white/40 sm:text-lg">
              Não importa se você tem uma boa oferta. Sem impacto visual, a mensagem passa reto.
            </p>
          </div>

          {/* problem cards */}
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {(
              [
                { icon: TrendingUp,    label: 'Pouco destaque',     text: 'Sem figurinhas que chamem atenção, seu story se perde entre dezenas de outros.' },
                { icon: MessageCircle, label: 'Baixa interação',    text: 'Ninguém para para responder quando o visual não convida. Engajamento cai.' },
                { icon: Clock,         label: 'Demora para criar',  text: 'Montar um story com visual forte do zero toma tempo. Tempo que você não tem.' },
              ] as const
            ).map(({ icon: Icon, label, text }) => (
              <motion.div key={label} whileHover={{ y: -6 }} className="rounded-2xl border border-red-500/10 bg-[#0e0e0e] p-6 sm:p-7">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/[0.07]">
                  <Icon className="h-5 w-5 text-red-400/60" />
                </div>
                <h3 className="mb-2 text-base font-black text-white">{label}</h3>
                <p className="text-sm font-light leading-relaxed text-white/40">{text}</p>
              </motion.div>
            ))}
          </div>

          {/* solution bridge */}
          <div className="mt-10 rounded-2xl border border-[#ff8c00]/18 bg-gradient-to-br from-[#180e00] to-[#0a0a0a] p-7 sm:mt-14 sm:p-10">
            <div className="grid gap-8 sm:grid-cols-3">
              {(
                [
                  { icon: Sparkles,   label: 'Visual pronto',              text: 'Figurinhas criadas por profissionais. Sem precisar criar nada do zero.' },
                  { icon: FolderOpen, label: 'Categorias organizadas',     text: 'Tudo separado por nicho. Encontre o que precisa em segundos.' },
                  { icon: Copy,       label: 'Uso direto no Instagram',    text: 'Copie aqui. Cole no Instagram. Funcionou. Simples assim.' },
                ] as const
              ).map(({ icon: Icon, label, text }) => (
                <div key={label} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ff8c00]/20 bg-[#ff8c00]/[0.08]">
                    <Icon className="h-5 w-5 text-[#ff8c00]" />
                  </div>
                  <div>
                    <p className="mb-1 font-bold text-white">{label}</p>
                    <p className="text-sm font-light text-white/40">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. Como funciona ───────────────────────────────────────── */}
      <section id="como-funciona" className="relative scroll-mt-20 overflow-hidden bg-[#060606] py-20 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-full max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff8c00]/[0.04] blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <span className="mb-3 inline-block text-[11px] font-black uppercase tracking-[0.22em] text-[#ff8c00]/60">Simples assim</span>
            <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl md:text-5xl">
              Copiou. Colou. Postou.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 sm:gap-7">
            {howItWorksSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl border border-white/5 bg-[#0e0e0e] p-7"
              >
                <div className="mb-5 text-4xl font-black text-[#ff8c00]/18">{step.step}</div>
                <h3 className="mb-2 text-lg font-black text-white">{step.title}</h3>
                <p className="text-sm font-light leading-relaxed text-white/40">{step.description}</p>
                {i < howItWorksSteps.length - 1 && (
                  <div className="absolute -right-3.5 top-1/2 hidden -translate-y-1/2 sm:block">
                    <ArrowRight className="h-5 w-5 text-white/12" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. Categorias ──────────────────────────────────────────── */}
      <section id="categorias" className="scroll-mt-20 bg-[#080808] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <span className="mb-3 inline-block text-[11px] font-black uppercase tracking-[0.22em] text-[#ff8c00]/60">Packs disponíveis</span>
            <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl md:text-5xl">
              Figurinhas para cada nicho
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base font-light text-white/40">
              Tudo organizado em pastas. Encontre exatamente o que você precisa.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categoryCards.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.055 }}
                  whileHover={{ y: -5 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#0e0e0e] p-5 transition-colors hover:border-[#ff8c00]/18 sm:p-6"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#ff8c00]/[0.04] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 transition-colors group-hover:border-[#ff8c00]/18"
                    style={{ background: `${cat.color}10` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: cat.color }} />
                  </div>
                  <h3 className="mb-1 text-sm font-black text-white sm:text-base">{cat.title}</h3>
                  <p className="text-xs font-light text-white/35 sm:text-sm">{cat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 7. Antes / Depois ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#050505] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <span className="mb-3 inline-block text-[11px] font-black uppercase tracking-[0.22em] text-[#ff8c00]/60">Diferença real</span>
            <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl md:text-5xl">
              O mesmo story.
              <br />
              <span className="text-white/30">Visual completamente diferente.</span>
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-10">
            {/* Before */}
            <div className="flex flex-col items-center gap-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/[0.07] px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-red-400/80">
                Sem STIKZ
              </span>
              <div className="w-full max-w-[220px] rounded-[2rem] border border-white/8 bg-[#111] p-3 shadow-[0_24px_50px_rgba(0,0,0,0.6)]">
                <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-[#181818]">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2e2e2e] to-[#111]" />
                  <div className="relative flex h-full flex-col items-center justify-center gap-3 p-5">
                    <div className="h-2.5 w-24 rounded-full bg-white/10" />
                    <div className="h-2 w-32 rounded-full bg-white/6" />
                    <div className="h-2 w-20 rounded-full bg-white/6" />
                    <div className="mt-4 h-8 w-24 rounded-xl bg-white/7" />
                  </div>
                </div>
              </div>
              <p className="max-w-[200px] text-center text-xs font-light text-white/28">
                Story simples, sem chamada visual. Passa batido.
              </p>
            </div>

            {/* After */}
            <div className="flex flex-col items-center gap-5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ff8c00]/22 bg-[#ff8c00]/[0.08] px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#ffb566]">
                Com STIKZ
              </span>
              <div className="w-full max-w-[220px] rounded-[2rem] border border-[#ff8c00]/18 bg-[#111] p-3 shadow-[0_24px_50px_rgba(255,140,0,0.08),0_24px_50px_rgba(0,0,0,0.6)]">
                <div className="relative aspect-[9/16] overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-[#1c0e00] to-[#0a0a0a]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,140,0,0.13),transparent_55%)]" />
                  <div className="relative flex h-full flex-col gap-3 p-4">
                    <div className="mt-4 self-start rounded-lg border border-[#ff8c00]/28 bg-black/50 px-3 py-2 shadow-[0_0_14px_rgba(255,140,0,0.18)] backdrop-blur">
                      <div className="mb-1 h-1.5 w-10 rounded-full bg-[#ff8c00]/65" />
                      <div className="h-4 w-20 rounded bg-white/80" />
                    </div>
                    <div className="self-center rounded-2xl border border-[#ff8c00]/35 bg-black/60 px-4 py-3 backdrop-blur">
                      <div className="mb-1 h-1.5 w-14 rounded-full bg-[#ffb566]/55" />
                      <div className="h-5 w-20 rounded bg-white" />
                      <div className="mt-1 h-1.5 w-10 rounded-full bg-white/28" />
                    </div>
                    <div className="mt-auto self-stretch rounded-xl bg-gradient-to-r from-[#ff8c00] to-[#ff6b00] px-4 py-3 shadow-[0_0_18px_rgba(255,140,0,0.35)]">
                      <div className="h-3 w-20 rounded-full bg-white/80" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="max-w-[200px] text-center text-xs font-light text-white/45">
                Story com stickers STIKZ. CTA, destaque e interação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. Benefícios ──────────────────────────────────────────── */}
      <section id="beneficios" className="scroll-mt-20 bg-[#070707] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <span className="mb-3 inline-block text-[11px] font-black uppercase tracking-[0.22em] text-[#ff8c00]/60">O que você recebe</span>
            <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl md:text-5xl">
              O que você recebe na STIKZ
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {benefitCards.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex gap-4 rounded-2xl border border-white/5 bg-[#0e0e0e] p-5 sm:p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ff8c00]/18 bg-[#ff8c00]/[0.07]">
                    <Icon className="h-5 w-5 text-[#ff8c00]" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-bold text-white">{benefit.title}</h3>
                    <p className="text-sm font-light leading-relaxed text-white/40">{benefit.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 9. Preço ───────────────────────────────────────────────── */}
      <section id="precos" className="relative scroll-mt-20 overflow-hidden bg-[#060606] py-20 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-full max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff8c00]/[0.045] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-xl px-4 sm:px-6">
          <div className="mb-10 text-center sm:mb-12">
            <span className="mb-3 inline-block text-[11px] font-black uppercase tracking-[0.22em] text-[#ff8c00]/60">Acesso completo</span>
            <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl md:text-5xl">
              Simples. Direto. Sem enrolação.
            </h2>
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-3xl border border-[#ff8c00]/28 bg-gradient-to-b from-[#1a0e00] to-[#0a0a0a] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(255,140,0,0.07)] sm:p-10"
          >
            <div className="pointer-events-none absolute top-0 right-0 h-60 w-60 rounded-full bg-[#ff8c00]/[0.07] blur-[80px]" />

            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#ff8c00]/28 bg-[#ff8c00]/[0.08] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#ffb566]">
                <Sparkles className="h-3 w-3" /> Acesso STIKZ completo
              </div>

              <div className="my-6 flex flex-wrap items-end gap-3">
                <div>
                  <p className="text-sm font-light text-white/22 line-through">R$ 49,00</p>
                  <p className="text-[3.8rem] font-black leading-none tracking-tight text-white sm:text-[4.5rem]">
                    R$ 19<span className="text-[#ff8c00]">,99</span>
                  </p>
                </div>
                <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-[#ff8c00]">pagamento único</p>
              </div>

              <div className="mb-7 h-px w-full bg-gradient-to-r from-transparent via-[#ff8c00]/18 to-transparent" />

              <ul className="mb-8 space-y-3">
                {[
                  'Acesso à biblioteca completa de figurinhas',
                  'Packs organizados por categorias e nichos',
                  'Copiar e colar direto no Instagram',
                  'Atualizações frequentes incluídas',
                  'Funciona no celular e no computador',
                  'Acesso liberado automaticamente após o pagamento',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff8c00]" />
                    <span className="text-sm font-light text-white/60">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group relative">
                <div className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#ff8c00] to-[#ff6b00] opacity-30 blur-xl transition-opacity group-hover:opacity-50" />
                <Link
                  href={CHECKOUT_URL}
                  className="relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-b from-[#ff9d2e] to-[#ff6b00] py-5 text-center text-base font-black uppercase tracking-wide text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.28)]"
                >
                  Comprar acesso agora
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <p className="mt-5 text-center text-xs font-light text-white/28">
                Garantia de 7 dias · Se não curtir, devolvemos 100% do valor.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 10. Garantia / Segurança ───────────────────────────────── */}
      <section className="bg-[#080808] py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                { icon: Zap,          label: 'Acesso automático', text: 'Sem aprovação manual.' },
                { icon: ShieldCheck,  label: 'Compra segura',     text: 'Pagamento protegido.' },
                { icon: MessageCircle,label: 'Suporte disponível',text: 'Dúvidas? A gente responde.' },
                { icon: Check,        label: 'Garantia de 7 dias',text: 'Reembolso sem perguntas.' },
              ] as const
            ).map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#0d0d0d] p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ff8c00]/[0.08]">
                  <Icon className="h-4 w-4 text-[#ff8c00]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{label}</p>
                  <p className="text-xs font-light text-white/30">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-[10px] font-light leading-relaxed text-white/18">
            Conteúdos relacionados a apostas e cassino disponíveis na plataforma devem ser utilizados exclusivamente por maiores de 18 anos e de forma responsável.
          </p>
        </div>
      </section>

      {/* ─── 11. FAQ ────────────────────────────────────────────────── */}
      <section className="bg-[#060606] py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-12">
            <h2 className="text-3xl font-black tracking-tighter text-white sm:text-4xl">
              Perguntas frequentes
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FaqAccordion
                key={faq.q}
                faq={faq}
                isOpen={openFaq === index}
                onToggle={() => setOpenFaq(openFaq === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 12. CTA Final ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#050505] py-20 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-full max-w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff8c00]/[0.045] blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-black tracking-tighter text-white sm:text-4xl md:text-5xl">
              Pronto para criar stories
              <br />
              <span className="text-[#ff8c00]">que chamam atenção?</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base font-light text-white/40 sm:text-lg">
              Acesse agora e comece a usar figurinhas que transformam seus stories em chamadas impossíveis de ignorar.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group relative w-full sm:w-auto">
                <div className="pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-[#ff8c00] to-[#ff6b00] opacity-25 blur-xl transition-opacity group-hover:opacity-45" />
                <Link
                  href={CHECKOUT_URL}
                  className="relative flex items-center justify-center gap-3 rounded-full bg-gradient-to-b from-[#ff9d2e] to-[#ff6b00] px-8 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.28),0_16px_40px_rgba(0,0,0,0.4)] sm:py-5 sm:text-base"
                >
                  Começar agora por R$ 19,99
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <Link
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/8 bg-white/[0.04] px-6 py-4 text-sm font-bold text-white/50 transition-all hover:border-white/16 hover:text-white/80 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </Link>
            </div>

            <p className="mt-5 text-xs font-light text-white/25">
              Garantia de 7 dias · Acesso imediato · Pagamento único
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] bg-[#000] py-12 text-center">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-4">
          <div className="flex items-center gap-2 opacity-40">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15">
              <ZIcon className="h-3 w-3 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              Stikz<span className="text-[#ff8c00]">.</span>
            </span>
          </div>

          <nav aria-label="Links do rodapé" className="flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-[0.25em] text-white/22">
            <Link href="#" className="transition-colors hover:text-white/55">Privacidade</Link>
            <Link href="#" className="transition-colors hover:text-white/55">Termos</Link>
            <Link href="#" className="transition-colors hover:text-white/55">Suporte</Link>
          </nav>

          <p className="text-[10px] uppercase tracking-[0.3em] text-white/18">
            Stikz &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
