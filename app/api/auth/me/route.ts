import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ error: 'Token invalido' }, { status: 401 });
  }

  const { data: usuario, error } = await supabaseAdmin
    .from('usuarios')
    .select('*')
    .eq('id', payload.sub)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Erro ao carregar usuario' }, { status: 500 });
  }

  if (!usuario) {
    return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 });
  }

  return NextResponse.json({
    usuario: {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      whatsapp: usuario.whatsapp,
      empresa_cnpj: usuario.empresa_cnpj ?? null,
      empresa_razao_social: usuario.empresa_razao_social ?? null,
      empresa_nome_fantasia: usuario.empresa_nome_fantasia ?? null,
      empresa_endereco: usuario.empresa_endereco ?? null,
      empresa_telefone: usuario.empresa_telefone ?? null,
      empresa_email: usuario.empresa_email ?? null,
      data_criacao: usuario.data_criacao,
      data_expiracao: usuario.data_expiracao,
      status: usuario.status,
      role: usuario.role,
    }
  });
}
