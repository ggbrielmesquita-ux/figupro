'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Store,
  User
} from 'lucide-react';
import { Usuario } from '@/types';

type Mensagem = { tipo: 'sucesso' | 'erro'; texto: string } | null;

type EmpresaFormState = {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  endereco: string;
  telefone: string;
  email: string;
};

const EMPTY_EMPRESA_FORM: EmpresaFormState = {
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  endereco: '',
  telefone: '',
  email: '',
};

function formatarCNPJ(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 14);

  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

function formatarTelefone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getEmpresaForm(usuario: Usuario | null): EmpresaFormState {
  if (!usuario) return EMPTY_EMPRESA_FORM;

  return {
    cnpj: usuario.empresa_cnpj || '',
    razaoSocial: usuario.empresa_razao_social || '',
    nomeFantasia: usuario.empresa_nome_fantasia || '',
    endereco: usuario.empresa_endereco || '',
    telefone: usuario.empresa_telefone || '',
    email: usuario.empresa_email || '',
  };
}

function normalizeEmpresaForm(form: EmpresaFormState) {
  return {
    cnpj: form.cnpj.trim(),
    razaoSocial: form.razaoSocial.trim(),
    nomeFantasia: form.nomeFantasia.trim(),
    endereco: form.endereco.trim(),
    telefone: form.telefone.trim(),
    email: form.email.trim().toLowerCase(),
  };
}

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const [empresaForm, setEmpresaForm] = useState<EmpresaFormState>(EMPTY_EMPRESA_FORM);
  const [empresaInicial, setEmpresaInicial] = useState<EmpresaFormState>(EMPTY_EMPRESA_FORM);
  const [salvandoEmpresa, setSalvandoEmpresa] = useState(false);
  const [msgEmpresa, setMsgEmpresa] = useState<Mensagem>(null);

  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenhas, setMostrarSenhas] = useState(false);
  const [salvandoSenha, setSalvandoSenha] = useState(false);
  const [msgSenha, setMsgSenha] = useState<Mensagem>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.usuario) {
          setUsuario(data.usuario);
          const form = getEmpresaForm(data.usuario);
          setEmpresaForm(form);
          setEmpresaInicial(form);
        } else {
          router.push('/login');
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const empresaAlterada = useMemo(() => {
    return JSON.stringify(normalizeEmpresaForm(empresaForm)) !== JSON.stringify(normalizeEmpresaForm(empresaInicial));
  }, [empresaForm, empresaInicial]);

  async function handleSalvarEmpresa(e: React.FormEvent) {
    e.preventDefault();
    setMsgEmpresa(null);
    setSalvandoEmpresa(true);

    try {
      const res = await fetch('/api/usuario/empresa', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empresaForm),
      });

      const data = await res.json();

      if (res.ok) {
        const usuarioAtualizado = data.usuario as Usuario;
        setUsuario(usuarioAtualizado);

        const formAtualizado = getEmpresaForm(usuarioAtualizado);
        setEmpresaForm(formAtualizado);
        setEmpresaInicial(formAtualizado);
        setMsgEmpresa({ tipo: 'sucesso', texto: data.message || 'Configuracoes da empresa salvas com sucesso!' });
      } else {
        setMsgEmpresa({ tipo: 'erro', texto: data.error || 'Erro ao salvar configuracoes da empresa' });
      }
    } catch {
      setMsgEmpresa({ tipo: 'erro', texto: 'Erro de conexao ao salvar configuracoes da empresa' });
    } finally {
      setSalvandoEmpresa(false);
    }
  }

  async function handleAlterarSenha(e: React.FormEvent) {
    e.preventDefault();
    setMsgSenha(null);

    if (novaSenha !== confirmarSenha) {
      setMsgSenha({ tipo: 'erro', texto: 'As senhas nao coincidem' });
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
      setMsgSenha({ tipo: 'erro', texto: 'Erro de conexao' });
    } finally {
      setSalvandoSenha(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  function formatarData(data: string | null) {
    if (!data) return 'Sem expiracao';
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  function expiracaoStatus() {
    if (!usuario?.data_expiracao) return null;
    const expira = new Date(usuario.data_expiracao);
    const agora = new Date();
    const diasRestantes = Math.ceil((expira.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) return { tipo: 'expirado', texto: 'Acesso expirado' };
    if (diasRestantes <= 7) return { tipo: 'alerta', texto: `Expira em ${diasRestantes} dias` };
    return { tipo: 'ok', texto: `${diasRestantes} dias restantes` };
  }

  const statusExpiracao = expiracaoStatus();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#ff6b00] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-[28px] border border-[#262626] bg-[radial-gradient(circle_at_top_right,rgba(255,107,0,0.18),transparent_28%),linear-gradient(180deg,#171717_0%,#111111_100%)] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.38)] lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Link
                href="/painel"
                className="rounded-2xl border border-[#2c2c2c] bg-[#111111] p-3 text-[#8a8a8a] transition-all hover:border-[#3a3a3a] hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#ff8b3d]">Configuracoes</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-white">Conta e empresa</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9a9a9a]">
                  Organize os dados da sua empresa com uma aparencia profissional. Essas informacoes podem ser refletidas nos laudos e documentos gerados pela plataforma.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <StatusPill
                label="Status da conta"
                value={usuario?.status === 'ativo' ? 'Ativa' : usuario?.status === 'pendente' ? 'Pendente' : 'Inativa'}
                color={usuario?.status === 'ativo' ? 'green' : usuario?.status === 'pendente' ? 'yellow' : 'red'}
              />
              <StatusPill
                label="Acesso"
                value={statusExpiracao?.texto || 'Sem expiracao'}
                color={statusExpiracao?.tipo === 'ok' ? 'green' : statusExpiracao?.tipo === 'alerta' ? 'yellow' : statusExpiracao?.tipo === 'expirado' ? 'red' : 'orange'}
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#252525] bg-[#151515] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)] lg:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ff6b00]/25 bg-[#ff6b00]/10 text-[#ff6b00]">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Configuracoes da empresa</h2>
                  <p className="mt-1 text-sm leading-6 text-[#8b8b8b]">
                    Preencha os dados institucionais que devem acompanhar seus laudos, documentos e materiais oficiais.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSalvarEmpresa} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="CNPJ"
                    placeholder="00.000.000/0000-00"
                    icon={<FileText className="h-4 w-4" />}
                    value={empresaForm.cnpj}
                    onChange={(value) => setEmpresaForm((current) => ({ ...current, cnpj: formatarCNPJ(value) }))}
                  />
                  <InputField
                    label="Email da empresa"
                    placeholder="contato@suaempresa.com"
                    icon={<Mail className="h-4 w-4" />}
                    type="email"
                    value={empresaForm.email}
                    onChange={(value) => setEmpresaForm((current) => ({ ...current, email: value }))}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <InputField
                    label="Razao social"
                    placeholder="Razao social da empresa"
                    icon={<Building2 className="h-4 w-4" />}
                    value={empresaForm.razaoSocial}
                    onChange={(value) => setEmpresaForm((current) => ({ ...current, razaoSocial: value }))}
                  />
                  <InputField
                    label="Nome fantasia"
                    placeholder="Nome fantasia"
                    icon={<Store className="h-4 w-4" />}
                    value={empresaForm.nomeFantasia}
                    onChange={(value) => setEmpresaForm((current) => ({ ...current, nomeFantasia: value }))}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
                  <TextareaField
                    label="Endereco"
                    placeholder="Rua, numero, bairro, cidade, estado e CEP"
                    icon={<MapPin className="h-4 w-4" />}
                    value={empresaForm.endereco}
                    onChange={(value) => setEmpresaForm((current) => ({ ...current, endereco: value }))}
                  />
                  <InputField
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    icon={<Phone className="h-4 w-4" />}
                    value={empresaForm.telefone}
                    onChange={(value) => setEmpresaForm((current) => ({ ...current, telefone: formatarTelefone(value) }))}
                  />
                </div>

                {msgEmpresa && <MessageBox message={msgEmpresa} />}

                <div className="flex flex-col gap-3 rounded-2xl border border-[#232323] bg-[#101010] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Pronto para usar nos laudos</p>
                    <p className="mt-1 text-xs leading-5 text-[#7d7d7d]">
                      Salve aqui os dados oficiais da empresa para manter seus documentos consistentes e profissionais.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={salvandoEmpresa || !empresaAlterada}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff6b00] px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition-all hover:bg-[#ff8440] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Save className="h-4 w-4" />
                    {salvandoEmpresa ? 'Salvando...' : 'Salvar empresa'}
                  </button>
                </div>
              </form>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-[#252525] bg-[#151515] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ff6b00]/25 bg-[#ff6b00]/10 text-[#ff6b00]">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white">Dados da conta</h2>
                  <p className="mt-1 text-sm text-[#8b8b8b]">Resumo do acesso e do perfil principal.</p>
                </div>
              </div>

              <div className="mb-5 rounded-2xl border border-[#232323] bg-[#111111] p-4">
                <p className="text-lg font-bold text-white">{usuario?.nome || 'Usuario'}</p>
                <p className="mt-1 text-sm text-[#8a8a8a]">{usuario?.email || '-'}</p>
              </div>

              <div className="space-y-1">
                <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={usuario?.email || '-'} />
                {usuario?.whatsapp && (
                  <InfoRow icon={<Phone className="h-4 w-4" />} label="WhatsApp" value={usuario.whatsapp} />
                )}
                <InfoRow
                  icon={<Calendar className="h-4 w-4" />}
                  label="Membro desde"
                  value={formatarData(usuario?.data_criacao || null)}
                />
                <InfoRow
                  icon={<Shield className="h-4 w-4" />}
                  label="Expiracao do acesso"
                  value={formatarData(usuario?.data_expiracao || null)}
                  borderless
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-[#252525] bg-[#151515] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <h3 className="mb-5 flex items-center gap-3 text-lg font-black text-white">
                <Lock className="h-5 w-5 text-[#ff6b00]" />
                Seguranca da conta
              </h3>

              <form onSubmit={handleAlterarSenha} className="space-y-4">
                {[
                  { label: 'Senha atual', value: senhaAtual, onChange: setSenhaAtual, placeholder: '********' },
                  { label: 'Nova senha', value: novaSenha, onChange: setNovaSenha, placeholder: 'Minimo 6 caracteres' },
                  { label: 'Confirmar nova senha', value: confirmarSenha, onChange: setConfirmarSenha, placeholder: 'Repita a nova senha' },
                ].map((campo, index) => (
                  <div key={campo.label} className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0a0a0]">
                      {campo.label}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#606060]" />
                      <input
                        type={mostrarSenhas ? 'text' : 'password'}
                        value={campo.value}
                        onChange={(e) => campo.onChange(e.target.value)}
                        required
                        placeholder={campo.placeholder}
                        className="w-full rounded-2xl border border-[#2a2a2a] bg-[#111111] py-3.5 pl-10 pr-12 text-sm text-white placeholder-[#404040] transition-all focus:border-[#ff6b00] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)]"
                      />
                      {index === 0 && (
                        <button
                          type="button"
                          onClick={() => setMostrarSenhas(!mostrarSenhas)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606060] hover:text-[#a0a0a0]"
                        >
                          {mostrarSenhas ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {msgSenha && <MessageBox message={msgSenha} />}

                <button
                  type="submit"
                  disabled={salvandoSenha}
                  className="w-full rounded-2xl bg-[#ff6b00] py-3.5 text-sm font-black uppercase tracking-[0.14em] text-white transition-all hover:bg-[#ff8440] disabled:opacity-50"
                >
                  {salvandoSenha ? 'Salvando...' : 'Salvar senha'}
                </button>
              </form>
            </section>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#2a2a2a] py-4 text-sm font-semibold text-[#707070] transition-all hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Sair da conta
        </button>
      </div>
    </div>
  );
}

function StatusPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: 'green' | 'yellow' | 'red' | 'orange';
}) {
  const colorMap = {
    green: 'border-green-500/20 bg-green-500/10 text-green-400',
    yellow: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
    red: 'border-red-500/20 bg-red-500/10 text-red-400',
    orange: 'border-[#ff6b00]/20 bg-[#ff6b00]/10 text-[#ff8b3d]',
  };

  return (
    <div className={`rounded-2xl border px-4 py-3 ${colorMap[color]}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-75">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  icon,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0a0a0]">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]">{icon}</div>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-[#2a2a2a] bg-[#101010] py-3.5 pl-10 pr-4 text-sm text-white placeholder-[#434343] transition-all focus:border-[#ff6b00] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)]"
        />
      </div>
    </div>
  );
}

function TextareaField({
  label,
  placeholder,
  icon,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0a0a0]">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-4 text-[#606060]">{icon}</div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className="w-full resize-none rounded-2xl border border-[#2a2a2a] bg-[#101010] py-3.5 pl-10 pr-4 text-sm text-white placeholder-[#434343] transition-all focus:border-[#ff6b00] focus:outline-none focus:shadow-[0_0_0_3px_rgba(255,107,0,0.15)]"
        />
      </div>
    </div>
  );
}

function MessageBox({ message }: { message: NonNullable<Mensagem> }) {
  return (
    <div className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm ${
      message.tipo === 'sucesso'
        ? 'border border-green-500/20 bg-green-500/10 text-green-400'
        : 'border border-red-500/20 bg-red-500/10 text-red-400'
    }`}>
      {message.tipo === 'sucesso'
        ? <CheckCircle className="h-4 w-4 flex-shrink-0" />
        : <AlertCircle className="h-4 w-4 flex-shrink-0" />
      }
      {message.texto}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  borderless = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  borderless?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 py-3 ${borderless ? '' : 'border-b border-[#1f1f1f]'}`}>
      <div className="text-[#606060]">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#606060]">{label}</p>
        <p className="truncate text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}
