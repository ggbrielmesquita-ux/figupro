import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { supabaseAdmin } from '@/lib/supabase';
import { hashSenha, verificarSenha } from '@/lib/hash';

export async function PUT(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

  try {
    const { senhaAtual, novaSenha } = await request.json();

    if (!senhaAtual || !novaSenha) {
      return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400 });
    }

    if (novaSenha.length < 6) {
      return NextResponse.json({ error: 'A nova senha deve ter no mínimo 6 caracteres' }, { status: 400 });
    }

    const { data: usuario } = await supabaseAdmin
      .from('usuarios')
      .select('senha_hash')
      .eq('id', payload.sub)
      .single();

    if (!usuario) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const senhaValida = await verificarSenha(senhaAtual, usuario.senha_hash);
    if (!senhaValida) {
      return NextResponse.json({ error: 'Senha atual incorreta' }, { status: 400 });
    }

    const hash = await hashSenha(novaSenha);
    await supabaseAdmin.from('usuarios').update({ senha_hash: hash }).eq('id', payload.sub);

    return NextResponse.json({ message: 'Senha alterada com sucesso!' });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
