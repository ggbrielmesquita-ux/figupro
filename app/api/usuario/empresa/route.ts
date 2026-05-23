import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { supabaseAdmin } from '@/lib/supabase';

function emptyToNull(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function sanitizeDigits(value: string | null) {
  if (!value) return '';
  return value.replace(/\D/g, '');
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: 'Token invalido' }, { status: 401 });

  try {
    const body = await request.json();

    const empresa_cnpj = emptyToNull(body.cnpj);
    const empresa_razao_social = emptyToNull(body.razaoSocial);
    const empresa_nome_fantasia = emptyToNull(body.nomeFantasia);
    const empresa_endereco = emptyToNull(body.endereco);
    const empresa_telefone = emptyToNull(body.telefone);
    const empresa_email_raw = emptyToNull(body.email);
    const empresa_email = empresa_email_raw ? empresa_email_raw.toLowerCase() : null;

    const cnpjDigits = sanitizeDigits(empresa_cnpj);
    const telefoneDigits = sanitizeDigits(empresa_telefone);

    if (empresa_cnpj && cnpjDigits.length !== 14) {
      return NextResponse.json({ error: 'Informe um CNPJ valido com 14 digitos' }, { status: 400 });
    }

    if (empresa_telefone && (telefoneDigits.length < 10 || telefoneDigits.length > 11)) {
      return NextResponse.json({ error: 'Informe um telefone valido com DDD' }, { status: 400 });
    }

    if (empresa_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa_email)) {
      return NextResponse.json({ error: 'Informe um e-mail valido' }, { status: 400 });
    }

    const { data: usuarioAtualizado, error } = await supabaseAdmin
      .from('usuarios')
      .update({
        empresa_cnpj,
        empresa_razao_social,
        empresa_nome_fantasia,
        empresa_endereco,
        empresa_telefone,
        empresa_email,
      })
      .eq('id', payload.sub)
      .select('id, email, nome, whatsapp, empresa_cnpj, empresa_razao_social, empresa_nome_fantasia, empresa_endereco, empresa_telefone, empresa_email, data_criacao, data_expiracao, status, role')
      .single();

    if (error) {
      const schemaHint = error.message.toLowerCase().includes('column')
        ? ' Execute o schema.sql atualizado no Supabase para criar os novos campos da empresa.'
        : '';

      return NextResponse.json({ error: `Nao foi possivel salvar as configuracoes da empresa.${schemaHint}` }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Configuracoes da empresa salvas com sucesso!',
      usuario: usuarioAtualizado,
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno ao salvar configuracoes da empresa' }, { status: 500 });
  }
}
