'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User, Mail, Phone, Calendar, Shield, Lock,
  Eye, EyeOff, CheckCircle, AlertCircle, LogOut, ArrowLeft
} from 'lucide-react';
import { Usuario } from '@/types';

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Formulário de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [msgSenha, setMsgSenha] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.usuario) setUsuario(data.usuario);
        else router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function handleAlterarSenha(e: React.FormEvent) {
    e.preventDefault();
    setMsgSenha(null);

    if (novaSenha !== confirmarSenha) {
      setMsgSenha({ tipo: 'erro', texto: 'As senhas não coincidem' });
      return;
    }

    setSalvandoSenha(true);

    try {
      const res = await fetch('/api/usuario/senha', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });

      const data = await res.json();

      if (res.ok) {
        setMsgSenha({ tipo: 'sucesso', texto: 'Senha alterada com sucesso!' });
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
      } else {
        setMsgSenha({ tipo: 'erro', texto: data.error || 'Erro ao alterar senha' });
      }
    } catch {
      setMsgSenha({ tipo: 'erro', texto: 'Erro de conexão' });
    } finally {
      setSalvandoSenha(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  function formatarData(data: string | null) {
    if (!data) return 'Sem expiração';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  function expiracaoStatus() {
    if (!usuario?.data_expiracao) return null;
    const expira = new Date(usuario.data_expiracao);
    const agora = new Date();
    const diasRestantes = Math.ceil((expira.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) return { tipo: 'expirado', texto: 'Acesso expirado', dias: null };
    if (diasRestantes <= 7) return { tipo: 'alerta', texto: `Expira em ${diasRestantes} dias`, dias: diasRestantes };
    return { tipo: 'ok', texto: `${diasRestantes} dias restantes`, dias: diasRestantes };
  }

  const statusExpiracao = expiracaoStatus();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="w-10 h-10 border-2 border-[#ff6b00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 lg:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/painel"
            className="p-2 rounded-lg text-[#606060] hover:text-white hover:bg-[#1a1a1a] border border-[#2a2a2a] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Meu Perfil</h1>
            <p className="text-[#606060] text-sm">Gerencie sua conta</p>
          </div>
        </div>

        {/* Card de informações */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-[#ff6b00]/20 border border-[#ff6b00]/30 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#ff6b00]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{usuario?.nome || 'Usuário'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                  usuario?.status === 'ativo'
                    ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                    : 'bg-red-500/15 text-red-400 border border-red-500/20'
                }`}>
                  {usuario?.status === 'ativo' ? 'ATIVO' : 'INATIVO'}
                </span>
                {usuario?.role === 'admin' && (
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-[#ff6b00]/15 text-[#ff6b00] border border-[#ff6b00]/20">
                    ADMIN
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={usuario?.email || '-'} />
            {usuario?.whatsapp && (
              <InfoRow icon={<Phone className="w-4 h-4" />} label="WhatsApp" value={usuario.whatsapp} />
            )}
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Membro desde"
              value={formatarData(usuario?.data_criacao || null)}
            />
            <div className="flex items-center gap-3 py-3 border-t border-[#2a2a2a]">
              <div className="text-[#606060]">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#606060]">Expiração do acesso</p>
                <p className="text-sm text-white font-medium">
                  {formatarData(usuario?.data_expiracao || null)}
                </p>
              </div>
              {statusExpiracao && (
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  statusExpiracao.tipo === 'ok'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : statusExpiracao.tipo === 'alerta'
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {statusExpiracao.texto}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card de alterar senha */}
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#ff6b00]" />
            Alterar Senha
          </h3>

          <form onSubmit={handleAlterarSenha} className="space-y-4">
            {[
              { label: 'Senha atual', value: senhaAtual, onChange: setSenhaAtual, placeholder: '••••••••' },
              { label: 'Nova senha', value: novaSenha, onChange: setNovaSenha, placeholder: 'Mínimo 6 caracteres' },
              { label: 'Confirmar nova senha', value: confirmarSenha, onChange: setConfirmarSenha, placeholder: 'Repita a nova senha' },
            ].map((campo) => (
              <div key={campo.label} className="space-y-1.5">
                <label className="text-xs font-semibold text-[#a0a0a0] uppercase tracking-wider">
                  {campo.label}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#606060]" />
                  <input
                    type={mostrarSenhas ? 'text' : 'password'}
                    value={campo.value}
                    onChange={(e) => campo.onChange(e.target.value)}
                    required
                    placeholder={campo.placeholder}
                    className="w-full bg-[#111111] border border-[#2a2a2a] rounded-xl pl-10 pr-12 py-3.5 text-white placeholder-[#404040] text-sm focus:outline-none focus:border-[#ff6b00] focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)] transition-all"
                  />
                  {campo.label === 'Senha atual' && (
                    <button
                      type="button"
                      onClick={() => setMostrarSenhas(!mostrarSenhas)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606060] hover:text-[#a0a0a0]"
                    >
                      {mostrarSenhas ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {msgSenha && (
              <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${
                msgSenha.tipo === 'sucesso'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {msgSenha.tipo === 'sucesso'
                  ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  : <AlertCircle className="w-4 h-4 flex-shrink-0" />
                }
                {msgSenha.texto}
              </div>
            )}

            <button
              type="submit"
              disabled={salvandoSenha}
              className="w-full bg-[#ff6b00] hover:bg-[#ff8c2a] disabled:opacity-50 text-white font-black py-3.5 rounded-xl text-sm uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,107,0,0.25)]"
            >
              {salvandoSenha ? 'Salvando...' : 'SALVAR SENHA'}
            </button>
          </form>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#2a2a2a] hover:border-red-500/30 text-[#606060] hover:text-red-400 hover:bg-red-500/5 transition-all font-semibold text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#1f1f1f]">
      <div className="text-[#606060]">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#606060]">{label}</p>
        <p className="text-sm text-white font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
