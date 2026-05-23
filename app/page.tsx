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
  top:    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  bottom: [10, 11, 12, 13, 14, 15, 16, 17, 18],
} as const;

type CategoryCard = { icon: React.ElementType; title: string; description: string; color: string };

const categoryCards: readonly CategoryCard[] = [
  { icon: Bike,         title: 'Grau de Moto',  description: 'Perfis de moto e grau',         color: '#ff7a00' },
  { icon: MessageCircle,title: 'Interativas',   description: 'Enquetes e engajamento',         color: '#ff5500' },
  { icon: Gift,         title: 'Rifas',          description: 'Urgência para rifeiros',         color: '#ffaa00' },
  { icon: Scissors,     title: 'Barbearia',      description: 'Visual premium para barbearias', color: '#ff7a00' },
  { icon: ShoppingBag,  title: 'Lojistas',       description: 'Promoções e chamadas de venda',  color: '#ff5500' },
  { icon: Car,          title: 'Carros',          description: 'Perfis automotivos',             color: '#ffaa00' },
  { icon: Layers,       title: 'Plataformas',    description: 'Pixbet, Sportingbet e outras',   color: '#ff7a00' },
  { icon: AlignLeft,    title: 'Frases',          description: 'Textos e chamadas de impacto',   color: '#ff5500' },
] as const;

type BenefitCard = { icon: React.ElementType; title: string; description: string };

const benefitCards: readonly BenefitCard[] = [
  { icon: FolderOpen,  title: 'Biblioteca por pastas',    description: 'Tudo separado por nicho. Encontre o que precisa em segundos.' },
  { icon: Copy,        title: 'Copiar em 2 cliques',      description: 'Clicou, copiou. Cole direto no Story do Instagram.' },
  { icon: RefreshCw,   title: 'Atualizações frequentes',  description: 'Novos packs adicionados regularmente.' },
  { icon: Smartphone,  title: 'Funciona no celular',       description: 'Otimizado para uso mobile. Abra e use na hora.' },
  { icon: Zap,         title: 'Acesso imediato',           description: 'Pagou, acessou. Sem espera, sem aprovação manual.' },
  { icon: TrendingUp,  title: 'Mais engajamento',          description: 'Stories com identidade visual geram mais respostas e vendas.' },
] as const;

type StepCard = { step: string; title: string; description: string };

const howItWorksSteps: readonly StepCard[] = [
  { step: '01', title: 'Entre na STIKZ',             description: 'Faça login e escolha a categoria que combina com seu perfil ou campanha.' },
  { step: '02', title: 'Escolha uma pasta',           description: 'Navegue pelas pastas: Rifas, Barbearia, Lojistas, Carros e muito mais.' },
  { step: '03', title: 'Copie e cole no Instagram',   description: 'Clique em Copiar, abra o Instagram e cole direto no seu Story.' },
] as const;

type FaqItem = { q: string; a: string };

const faqs: readonly FaqItem[] = [
  { q: 'Como recebo o acesso?',                         a: 'Após o pagamento ser aprovado, seu acesso é liberado automaticamente. Você já pode entrar no painel na mesma hora.' },
  { q: 'Funciona no Instagram?',                        a: 'Sim. As figurinhas são imagens PNG otimizadas para Stories do Instagram. Basta copiar na STIKZ e colar no seu Story.' },
  { q: 'Preciso instalar algum app?',                   a: 'Não. A STIKZ funciona 100% pelo navegador. Pode abrir no celular ou no computador, sem download.' },
  { q: 'O pagamento libera automaticamente?',           a: 'Sim. Assim que o pagamento for confirmado, sua conta é ativada de forma automática, sem aprovação manual.' },
  { q: 'Tem atualizações?',                             a: 'Sim. Novos packs são adicionados com frequência durante a vigência do seu acesso.' },
  { q: 'Posso usar pelo celular?',                      a: 'Pode. O sistema é responsivo e foi pensado para quem usa o celular para criar conteúdo.' },
  { q: 'As figurinhas são organizadas por categorias?', a: 'Sim. Tudo dividido por pastas: Grau de moto, Rifas, Barbearia, Lojistas, Carros, Plataformas e muito mais.' },
] as const;

// ─── Marquee ──────────────────────────────────────────────────────────────────

type MarqueeTrackProps = { items: readonly number[]; direction: 'left' | 'right'; tone: 'orange' | 'amber' };

function MarqueeTrack({ items, direction, tone }: MarqueeTrackProps) {
  const trackRef  = useRef<HTMLDivElement>(null);
  const groupRef  = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;

    const mobileQ = window.matchMedia('(max-width: 767px)');
    const reducedQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    const speed = () => {
      const base = mobileQ.matches ? (direction === 'right' ? 18 : 20) : (direction === 'right' ? 34 : 38);
      return reducedQ.matches ? base * 0.55 : base;
    };

    let groupW = group.scrollWidth;
    let offset  = direction === 'right' ? -groupW : 0;
    let curSpeed = speed();
    let last = performance.now();
    let frame = 0;

    const measure = () => { groupW = group.scrollWidth; offset = direction === 'right' ? -groupW : 0; };

    const animate = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.05); last = t;
      const target = hoveringRef.current ? speed() * 0.42 : speed();
      curSpeed += (target - curSpeed) * Math.min(dt * 4, 1);
      offset += curSpeed * dt * (direction === 'right' ? 1 : -1);
      if (direction === 'right' && offset >= 0) offset -= groupW;
      if (direction === 'left'  && offset <= -groupW) offset += groupW;
      track.style.transform = `translate3d(${offset}px,0,0)`;
      frame = requestAnimationFrame(animate);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(group);
    mobileQ.addEventListener('change', measure);
    reducedQ.addEventListener('change', measure);
    measure();
    frame = requestAnimationFrame(animate);

    return () => { cancelAnimationFrame(frame); ro.disconnect(); mobileQ.removeEventListener('change', measure); reducedQ.removeEventListener('change', measure); };
  }, [direction]);

  return (
    <div
      className={`sticker-marquee-row sticker-marquee-row--${tone}`}
      onPointerEnter={() => { hoveringRef.current = true; }}
      onPointerLeave={() => { hoveringRef.current = false; }}
    >
      <div ref={trackRef} className="sticker-marquee-track">
        {[0, 1].map((copy) => (
          <div key={copy} ref={copy === 0 ? groupRef : undefined} className="sticker-marquee-group" aria-hidden={copy === 1}>
            {items.map((num) => (
              <div className="sticker-tile" key={`${direction}-${copy}-${num}`}>
                <Image src={`/img/optimized/fig-${num}.webp`} alt={copy === 0 ? `Figurinha Premium ${num}` : ''} width={512} height={512} loading="lazy" decoding="async" draggable={false} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

function FaqAccordion({ faq, isOpen, onToggle }: { faq: FaqItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isOpen ? 'border-[#ff7a00]/22 bg-[#0f0f0f]' : 'border-white/[0.05] bg-[#0a0a0a] hover:border-white/[0.09]'}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a00]/40 sm:px-7"
      >
        <span className={`text-sm font-semibold leading-snug transition-colors duration-200 sm:text-base ${isOpen ? 'text-white' : 'text-white/50'}`}>
          {faq.q}
        </span>
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${isOpen ? 'bg-[#ff7a00] text-black' : 'border border-white/10 text-white/30'}`}>
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm font-light leading-relaxed text-white/40 sm:px-7 sm:pb-6 sm:text-[0.95rem]">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Phone Mockup ─────────────────────────────────────────────────────────────

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-fit select-none">

      {/* floating chips */}
      <motion.div animate={{ y: [0, -9, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        className="absolute -left-10 top-12 z-20 hidden items-center gap-1.5 rounded-full border border-[#ff7a00]/30 bg-black/85 px-3 py-1.5 text-[11px] font-bold text-[#ff7a00] backdrop-blur sm:flex">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff7a00]" /> Acesso ativo
      </motion.div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut', delay: 0.8 }}
        className="absolute -right-8 top-24 z-20 hidden items-center gap-1.5 rounded-full border border-white/10 bg-black/85 px-3 py-1.5 text-[11px] font-semibold text-white/60 backdrop-blur sm:flex">
        ✅ Copiado!
      </motion.div>

      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1.5 }}
        className="absolute -right-6 bottom-16 z-20 hidden items-center gap-1.5 rounded-2xl border border-[#ff7a00]/18 bg-[#ff7a00]/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#ffa040] backdrop-blur sm:flex">
        2 cliques
      </motion.div>

      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 scale-[0.7] rounded-full bg-[#ff7a00]/12 blur-[50px]" />

      {/* phone */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ repeat: Infinity, duration: 6.5, ease: 'easeInOut' }}
        className="relative w-[210px] rounded-[2.8rem] border-[3px] border-[#222] bg-[#050505] p-2.5 shadow-[-16px_24px_55px_rgba(0,0,0,0.92),0_0_32px_rgba(255,122,0,0.09)] sm:w-[248px]"
      >
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-10 h-5 w-[38%] -translate-x-1/2 rounded-b-2xl bg-[#111]" />

        <div className="overflow-hidden rounded-[2.3rem] bg-[#080808]">
          {/* topbar */}
          <div className="flex items-center justify-between bg-[#101010] px-3.5 pb-2.5 pt-7">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a00] to-[#cc5500] text-[9px] font-black text-white shadow-[0_0_8px_rgba(255,122,0,0.35)]">S</div>
              <div>
                <p className="text-[9px] font-bold leading-none text-white">STIKZ</p>
                <p className="mt-0.5 text-[7px] text-white/30">Escolha uma pasta</p>
              </div>
            </div>
            <div className="flex h-4 w-4 items-center justify-center rounded border border-white/8">
              <div className="h-1.5 w-1.5 rounded-sm bg-white/20" />
            </div>
          </div>

          {/* category grid */}
          <div className="grid grid-cols-2 gap-1 bg-[#080808] p-2">
            {([['Rifas', '#ff7a00'], ['Barbearia', '#ffaa40'], ['Carros', '#ff5500'], ['Lojistas', '#ff7a00']] as const).map(([label, color]) => (
              <div key={label} className="rounded-lg border border-white/[0.04] bg-[#101010] p-2">
                <div className="mb-1 h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                <p className="text-[8px] font-bold text-white/65">{label}</p>
                <p className="mt-0.5 text-[6px] text-white/22">Pack disponível</p>
              </div>
            ))}
          </div>

          {/* preview strip */}
          <div className="bg-[#080808] px-2 pb-2.5">
            <div className="rounded-xl border border-[#ff7a00]/18 bg-[#101010] p-1.5">
              <p className="mb-1 text-[7px] font-black uppercase tracking-wider text-[#ff7a00]/55">Preview</p>
              <div className="mb-1.5 flex gap-1">
                {[0, 1, 2].map((n) => <div key={n} className="aspect-square flex-1 rounded-md border border-white/[0.04] bg-[#181818]" />)}
              </div>
              <div className="rounded-lg bg-gradient-to-r from-[#ff7a00] to-[#cc5500] py-1.5 text-center">
                <p className="text-[7px] font-black uppercase tracking-wider text-white">Copiar figurinha</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Z Logo Icon ──────────────────────────────────────────────────────────────

function ZIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 6h16M4 18h16M7 6l10 12" />
    </svg>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ff7a00]/18 bg-[#ff7a00]/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#ff9a40] sm:mb-5">
      <span className="h-1 w-1 rounded-full bg-[#ff7a00]" />
      {children}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen w-screen max-w-[100vw] overflow-x-hidden bg-[#060606] text-white selection:bg-[#ff7a00] selection:text-black">

      {/* ambient top glow */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_35%_at_50%_0%,rgba(255,122,0,0.045),transparent)]" />
      </div>

      {/* ─── Header ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full border-b border-white/[0.045] bg-[#060606]/82 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">

          <Link href="/" aria-label="STIKZ início" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff7a00] to-[#cc5500] shadow-[0_0_14px_rgba(255,122,0,0.3)]">
              <ZIcon className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-[1.35rem] font-bold tracking-tight text-white">
              Stikz<span className="text-[#ff7a00]">.</span>
            </span>
          </Link>

          <nav aria-label="Navegação" className="hidden items-center gap-7 text-[13px] font-medium text-white/40 md:flex">
            <Link href="#como-funciona" className="transition-colors hover:text-white">Como funciona</Link>
            <Link href="#categorias"    className="transition-colors hover:text-white">Categorias</Link>
            <Link href="#beneficios"    className="transition-colors hover:text-white">Benefícios</Link>
            <Link href="#precos"        className="transition-colors hover:text-white">Preço</Link>
          </nav>

          <Link href={CHECKOUT_URL}
            className="rounded-full bg-[#ff7a00] px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_16px_rgba(255,122,0,0.22)] transition-all hover:bg-[#ff8f20] hover:shadow-[0_0_22px_rgba(255,122,0,0.35)] sm:px-5 sm:text-sm">
            Começar
          </Link>
        </div>
      </header>

      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section className="relative z-10 overflow-hidden pt-20 pb-10 sm:pt-32 sm:pb-16 lg:pt-44 lg:pb-28">

        {/* layered bg atmosphere */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-[40%] top-[20%] h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-[#ff7a00]/[0.055] blur-[110px]" />
          <div className="absolute right-[-5%] top-[-10%] h-[400px] w-[400px] rounded-full bg-[#ff5500]/[0.03] blur-[80px]" />
          {/* subtle dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,122,0,0.04)_1px,transparent_0)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_70%_60%_at_40%_40%,#000,transparent)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 sm:gap-10 lg:flex-row lg:items-center lg:gap-16">

            {/* ── Text column ── */}
            <div className="flex-1 text-center lg:text-left">

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ff7a00]/20 bg-[#ff7a00]/[0.07] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff9a40]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff7a00]" />
                Para rifeiros, lojistas e criadores
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                className="font-display mb-5 text-[1.95rem] font-bold leading-[1.04] tracking-tight text-white sm:text-[2.8rem] sm:leading-[0.97] md:text-[3.8rem] lg:text-[4.4rem] xl:text-[5.2rem]"
              >
                Figurinhas feitas<br />
                para stories que<br />
                <span className="bg-gradient-to-r from-[#ff7a00] via-[#ff9a40] to-[#ffbb70] bg-clip-text text-transparent">
                  vendem de verdade.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="mb-8 text-base font-light leading-relaxed text-white/45 sm:text-lg lg:max-w-md"
              >
                Copie, cole e use direto no Instagram. Packs organizados por categoria para criar stories chamativos em segundos.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.26 }}
                className="flex flex-col items-center gap-3 sm:flex-row lg:items-start"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group relative w-full sm:w-auto">
                  <div className="pointer-events-none absolute -inset-2 rounded-full bg-[#ff7a00] opacity-20 blur-xl transition-opacity group-hover:opacity-35" />
                  <Link href={CHECKOUT_URL}
                    className="relative flex items-center justify-center gap-2.5 rounded-full bg-[#ff7a00] px-7 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[inset_0_2px_3px_rgba(255,255,255,0.25),0_10px_24px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#ff8f20]">
                    Quero acessar por R$ 19,99
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>

                <Link href="#como-funciona"
                  className="flex w-full items-center justify-center rounded-full border border-white/8 bg-white/[0.04] px-6 py-4 text-sm font-semibold text-white/50 transition-all hover:border-white/15 hover:text-white/80 sm:w-auto">
                  Ver como funciona
                </Link>
              </motion.div>

              {/* trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
              >
                {[
                  'Acesso imediato após o pagamento',
                  'Copiar e colar em 2 cliques',
                ].map((text) => (
                  <span key={text} className="flex items-center gap-1.5 text-xs font-medium text-white/30">
                    <Check className="h-3.5 w-3.5 text-[#ff7a00]" /> {text}
                  </span>
                ))}
              </motion.div>

              {/* stats strip */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/[0.05] bg-[#0c0c0c]"
              >
                {[
                  { value: '+500',    label: 'figurinhas' },
                  { value: '8',       label: 'categorias' },
                  { value: '2 min',   label: 'para acessar' },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col items-center justify-center px-3 py-4 sm:px-6 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-white/[0.05]">
                    <span className="font-display text-xl font-bold text-white sm:text-2xl">{value}</span>
                    <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-white/28">{label}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Phone column ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex-shrink-0"
            >
              <PhoneMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Vitrine ─────────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-[#040404] py-8 sm:py-10">
        <p className="mb-5 text-center text-[10px] font-black uppercase tracking-[0.3em] text-white/16">
          Arsenal visual pronto para seus stories
        </p>
        <div className="sticker-marquee">
          <MarqueeTrack items={stickerRows.top}    direction="right" tone="orange" />
          <MarqueeTrack items={stickerRows.bottom} direction="left"  tone="amber"  />
        </div>
      </section>

      {/* ─── Problema ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#070707] py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* editorial statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="mb-10 text-center sm:mb-14 lg:mb-20"
          >
            <p className="font-display mx-auto max-w-4xl text-[1.5rem] font-bold leading-[1.1] tracking-tight text-white/20 sm:text-4xl md:text-5xl">
              Seu story pode estar bom.
            </p>
            <p className="font-display mx-auto max-w-4xl text-[1.5rem] font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
              Mas sem visual forte, ele passa batido.
            </p>
          </motion.div>

          {/* problem cards */}
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {([
              { icon: TrendingUp,    label: 'Pouco destaque',    text: 'Sem figurinhas que chamem atenção, seu story se perde no feed.' },
              { icon: MessageCircle, label: 'Baixa interação',   text: 'Ninguém para para responder quando o visual não convida.' },
              { icon: Clock,         label: 'Demora para criar', text: 'Montar um story com visual forte do zero toma tempo demais.' },
            ] as const).map(({ icon: Icon, label, text }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-red-500/[0.08] bg-[#0a0a0a] p-6 sm:p-7"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/12 bg-red-500/[0.06]">
                  <Icon className="h-5 w-5 text-red-400/50" />
                </div>
                <h3 className="font-display mb-2 text-base font-bold text-white">{label}</h3>
                <p className="text-sm font-light leading-relaxed text-white/36">{text}</p>
              </motion.div>
            ))}
          </div>

          {/* solution bridge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 rounded-2xl border border-[#ff7a00]/14 bg-gradient-to-br from-[#160900] to-[#080808] p-7 sm:mt-14 sm:p-10"
          >
            <p className="font-display mb-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#ff7a00]/60">A solução</p>
            <div className="grid gap-7 sm:grid-cols-3">
              {([
                { icon: Sparkles,   label: 'Visual pronto',          text: 'Figurinhas criadas por profissionais. Sem criar nada do zero.' },
                { icon: FolderOpen, label: 'Categorias organizadas', text: 'Tudo separado por nicho. Encontre em segundos.' },
                { icon: Copy,       label: 'Uso direto',             text: 'Copie aqui. Cole no Instagram. Simples assim.' },
              ] as const).map(({ icon: Icon, label, text }) => (
                <div key={label} className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#ff7a00]/18 bg-[#ff7a00]/[0.07]">
                    <Icon className="h-4 w-4 text-[#ff7a00]" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-bold text-white">{label}</p>
                    <p className="text-sm font-light text-white/36">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Como Funciona ───────────────────────────────────────────── */}
      <section id="como-funciona" className="relative scroll-mt-20 overflow-hidden bg-[#050505] py-14 sm:py-20 lg:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff7a00]/[0.035] blur-[90px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-14 lg:mb-16">
            <Label>Simples assim</Label>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Copiou. Colou. Postou.
            </h2>
          </div>

          <div className="relative grid gap-0 sm:grid-cols-3">
            {/* connector line (desktop) */}
            <div className="pointer-events-none absolute top-[3.2rem] left-[calc(16.66%+2rem)] right-[calc(16.66%+2rem)] hidden h-px bg-gradient-to-r from-[#ff7a00]/20 via-[#ff7a00]/40 to-[#ff7a00]/20 sm:block" />

            {howItWorksSteps.map((step, i) => (
              <motion.div key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative flex flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-0"
              >
                <div className="font-display relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ff7a00]/22 bg-[#0e0e0e] text-lg font-bold text-[#ff7a00] shadow-[0_0_24px_rgba(255,122,0,0.1)]">
                  {step.step}
                </div>
                <h3 className="font-display mb-2 text-lg font-bold text-white">{step.title}</h3>
                <p className="text-sm font-light leading-relaxed text-white/38">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categorias ──────────────────────────────────────────────── */}
      <section id="categorias" className="scroll-mt-20 bg-[#070707] py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-14 lg:mb-16">
            <Label>Packs disponíveis</Label>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Figurinhas para<br className="hidden sm:block" /> cada nicho
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base font-light text-white/38">
              Tudo organizado em pastas. Encontre exatamente o que você precisa.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categoryCards.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.38, delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.045] bg-[#0c0c0c] p-4 transition-colors hover:border-[#ff7a00]/16 sm:p-5"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#ff7a00]/[0.03] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.05] transition-colors group-hover:border-[#ff7a00]/16"
                    style={{ background: `${cat.color}0e` }}>
                    <Icon className="h-4 w-4" style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-display mb-0.5 text-sm font-bold text-white sm:text-[0.9rem]">{cat.title}</h3>
                  <p className="text-xs font-light text-white/32">{cat.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Antes / Depois ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#050505] py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-14 lg:mb-16">
            <Label>Diferença real</Label>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              O mesmo story.<br />
              <span className="text-white/25">Visual completamente diferente.</span>
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
            {/* Before */}
            <div className="flex flex-col items-center gap-4">
              <span className="rounded-full border border-red-500/16 bg-red-500/[0.06] px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-400/70">
                Sem STIKZ
              </span>
              <div className="w-full max-w-[200px] rounded-[1.8rem] border border-white/6 bg-[#0f0f0f] p-2.5 shadow-[0_20px_44px_rgba(0,0,0,0.6)]">
                <div className="relative aspect-[9/16] overflow-hidden rounded-[1.4rem] bg-[#161616]">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#252525] to-[#0f0f0f]" />
                  <div className="relative flex h-full flex-col items-center justify-center gap-3 p-5">
                    <div className="h-2 w-20 rounded-full bg-white/8" />
                    <div className="h-1.5 w-28 rounded-full bg-white/5" />
                    <div className="h-1.5 w-16 rounded-full bg-white/5" />
                    <div className="mt-3 h-7 w-20 rounded-lg bg-white/6" />
                  </div>
                </div>
              </div>
              <p className="max-w-[180px] text-center text-xs font-light text-white/24">Sem chamada visual. Passa batido.</p>
            </div>

            {/* After */}
            <div className="flex flex-col items-center gap-4">
              <span className="rounded-full border border-[#ff7a00]/18 bg-[#ff7a00]/[0.07] px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#ff9a40]">
                Com STIKZ
              </span>
              <div className="w-full max-w-[200px] rounded-[1.8rem] border border-[#ff7a00]/16 bg-[#0f0f0f] p-2.5 shadow-[0_20px_44px_rgba(255,122,0,0.07),0_20px_44px_rgba(0,0,0,0.6)]">
                <div className="relative aspect-[9/16] overflow-hidden rounded-[1.4rem] bg-gradient-to-b from-[#1a0d00] to-[#080808]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,122,0,0.12),transparent_55%)]" />
                  <div className="relative flex h-full flex-col gap-3 p-4">
                    <div className="mt-4 self-start rounded-lg border border-[#ff7a00]/25 bg-black/55 px-2.5 py-2 backdrop-blur">
                      <div className="mb-1 h-1.5 w-8 rounded-full bg-[#ff7a00]/55" />
                      <div className="h-3.5 w-16 rounded bg-white/80" />
                    </div>
                    <div className="self-center rounded-2xl border border-[#ff7a00]/30 bg-black/60 px-3.5 py-2.5 backdrop-blur">
                      <div className="mb-1 h-1.5 w-12 rounded-full bg-[#ffaa40]/50" />
                      <div className="h-5 w-16 rounded bg-white" />
                      <div className="mt-1 h-1 w-8 rounded-full bg-white/25" />
                    </div>
                    <div className="mt-auto self-stretch rounded-xl bg-gradient-to-r from-[#ff7a00] to-[#cc5500] px-3.5 py-2.5 shadow-[0_0_16px_rgba(255,122,0,0.3)]">
                      <div className="h-2.5 w-16 rounded-full bg-white/75" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="max-w-[180px] text-center text-xs font-light text-white/40">Com stickers STIKZ. CTA e destaque.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefícios ──────────────────────────────────────────────── */}
      <section id="beneficios" className="scroll-mt-20 bg-[#080808] py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-14 lg:mb-16">
            <Label>O que você recebe</Label>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              O que você recebe<br className="hidden sm:block" /> na STIKZ
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {benefitCards.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div key={b.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.38, delay: i * 0.06 }}
                  className="flex gap-4 rounded-2xl border border-white/[0.045] bg-[#0c0c0c] p-5 sm:p-6"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#ff7a00]/16 bg-[#ff7a00]/[0.06]">
                    <Icon className="h-4 w-4 text-[#ff7a00]" />
                  </div>
                  <div>
                    <h3 className="font-display mb-1 text-sm font-bold text-white">{b.title}</h3>
                    <p className="text-sm font-light leading-relaxed text-white/36">{b.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Preço ───────────────────────────────────────────────────── */}
      <section id="precos" className="relative scroll-mt-20 overflow-hidden bg-[#050505] py-14 sm:py-20 lg:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff7a00]/[0.04] blur-[110px]" />

        <div className="relative z-10 mx-auto max-w-lg px-4 sm:px-6">
          <div className="mb-7 text-center sm:mb-10">
            <Label>Acesso completo</Label>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Sem mensalidade.<br />Sem complicação.
            </h2>
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-3xl border border-[#ff7a00]/22 bg-gradient-to-b from-[#160900] to-[#080808] p-5 shadow-[0_36px_72px_rgba(0,0,0,0.82),0_0_44px_rgba(255,122,0,0.06)] sm:p-8 lg:p-10"
          >
            <div className="pointer-events-none absolute top-0 right-0 h-56 w-56 rounded-full bg-[#ff7a00]/[0.06] blur-[70px]" />

            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ff7a00]/25 bg-[#ff7a00]/[0.07] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#ff9a40]">
                <Sparkles className="h-3 w-3" /> Acesso STIKZ completo
              </div>

              {/* price */}
              <div className="mb-7 flex flex-wrap items-end gap-3">
                <div>
                  <p className="text-sm font-light text-white/20 line-through">R$ 49,00</p>
                  <p className="font-display text-[2.8rem] font-bold leading-none tracking-tight text-white sm:text-[3.6rem] lg:text-[4.5rem]">
                    R$ 19<span className="text-[#ff7a00]">,99</span>
                  </p>
                </div>
                <p className="mb-1.5 text-sm font-semibold uppercase tracking-wider text-[#ff9a40]">pagamento único</p>
              </div>

              <div className="mb-7 h-px w-full bg-gradient-to-r from-transparent via-[#ff7a00]/16 to-transparent" />

              <ul className="mb-7 space-y-2.5 sm:mb-8 sm:space-y-3">
                {[
                  'Acesso à biblioteca completa de figurinhas',
                  'Packs organizados por categorias e nichos',
                  'Copiar e colar direto no Instagram',
                  'Atualizações frequentes incluídas',
                  'Funciona no celular e no computador',
                  'Acesso liberado automaticamente',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ff7a00]" />
                    <span className="text-sm font-light text-white/55">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="group relative">
                <div className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-[#ff7a00] opacity-25 blur-xl transition-opacity group-hover:opacity-40" />
                <Link href={CHECKOUT_URL}
                  className="relative flex items-center justify-center gap-3 rounded-2xl bg-[#ff7a00] py-5 text-center text-base font-black uppercase tracking-wide text-white shadow-[inset_0_2px_3px_rgba(255,255,255,0.22)] transition-colors hover:bg-[#ff8f20]">
                  Comprar acesso agora
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <p className="mt-5 text-center text-xs font-light text-white/25">
                Garantia de 7 dias · Se não curtir, devolvemos 100% do valor.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Garantia / Trust ────────────────────────────────────────── */}
      <section className="bg-[#080808] py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {([
              { icon: Zap,           label: 'Acesso automático', text: 'Sem aprovação manual.' },
              { icon: ShieldCheck,   label: 'Compra segura',     text: 'Pagamento protegido.' },
              { icon: MessageCircle, label: 'Suporte',           text: 'Dúvidas? A gente responde.' },
              { icon: Check,         label: 'Garantia 7 dias',   text: 'Reembolso sem perguntas.' },
            ] as const).map(({ icon: Icon, label, text }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-[#0c0c0c] p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ff7a00]/[0.07]">
                  <Icon className="h-4 w-4 text-[#ff7a00]" />
                </div>
                <div>
                  <p className="font-display text-sm font-bold text-white">{label}</p>
                  <p className="text-xs font-light text-white/28">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-7 text-center text-[10px] font-light leading-relaxed text-white/15">
            Conteúdos relacionados a apostas e cassino disponíveis na plataforma devem ser utilizados exclusivamente por maiores de 18 anos e de forma responsável.
          </p>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────────────── */}
      <section className="bg-[#050505] py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="mb-8 text-center sm:mb-10 lg:mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Perguntas frequentes
            </h2>
          </div>
          <div className="space-y-2.5">
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

      {/* ─── CTA Final ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#070707] py-14 sm:py-20 lg:py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[580px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff7a00]/[0.04] blur-[90px]" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Pronto para criar stories
              <br />
              <span className="text-[#ff7a00]">que param o dedo?</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base font-light text-white/38 sm:text-lg">
              Acesse agora e comece a usar figurinhas que transformam seus stories.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group relative w-full sm:w-auto">
                <div className="pointer-events-none absolute -inset-2 rounded-full bg-[#ff7a00] opacity-18 blur-xl transition-opacity group-hover:opacity-30" />
                <Link href={CHECKOUT_URL}
                  className="relative flex items-center justify-center gap-2.5 rounded-full bg-[#ff7a00] px-6 py-4 text-sm font-black uppercase tracking-wide text-white shadow-[inset_0_2px_3px_rgba(255,255,255,0.22),0_12px_32px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#ff8f20] sm:px-8 sm:py-5 sm:text-base">
                  Começar agora por R$ 19,99
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <Link href={WHATSAPP_URL} target="_blank" rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white/40 transition-all hover:border-white/14 hover:text-white/70 sm:w-auto sm:py-5">
                <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
              </Link>
            </div>

            <p className="mt-5 text-xs font-light text-white/22">
              Garantia de 7 dias · Acesso imediato · Pagamento único
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.035] bg-[#030303] py-10 text-center">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4">
          <div className="flex items-center gap-2 opacity-35">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-white/12">
              <ZIcon className="h-2.5 w-2.5 text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Stikz<span className="text-[#ff7a00]">.</span>
            </span>
          </div>

          <nav aria-label="Links do rodapé" className="flex flex-wrap justify-center gap-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/18">
            <Link href="#" className="transition-colors hover:text-white/50">Privacidade</Link>
            <Link href="#" className="transition-colors hover:text-white/50">Termos</Link>
            <Link href="#" className="transition-colors hover:text-white/50">Suporte</Link>
          </nav>

          <p className="text-[9px] uppercase tracking-[0.28em] text-white/14">
            Stikz &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>

    </div>
  );
}
