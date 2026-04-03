import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashSenha } from '@/lib/hash';

export async function POST(request: NextRequest) {
  try {
    const { token, novaSenha } = await request.json();

    if (!token || !novaSenha) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    if (novaSenha.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres' }, { status: 400 });
    }

    // Busca usuário pelo token
    const { data: usuario } = await supabaseAdmin
      .from('usuarios')
      .select('id, reset_token_expira')
      .eq('reset_token', token)
      .single();

    if (!usuario) {
      return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 400 });
    }

    // Verifica expiração
    if (new Date(usuario.reset_token_expira) < new Date()) {
      return NextResponse.json({ error: 'Link expirado. Solicite um novo.' }, { status: 400 });
    }

    // Atualiza senha e remove token
    const hash = await hashSenha(novaSenha);
    await supabaseAdmin
      .from('usuarios')
      .update({ senha_hash: hash, reset_token: null, reset_token_expira: null })
      .eq('id', usuario.id);

    return NextResponse.json({ message: 'Senha alterada com sucesso!' });
  } catch (err) {
    console.error('Erro ao resetar senha:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
