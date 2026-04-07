import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verificarSenha } from '@/lib/hash';
import { signJWT } from '@/lib/jwt';

// Credencial de teste — remover antes de ir para produção
const TESTE_EMAIL = 'teste@stikz.com';
const TESTE_SENHA = 'teste123';

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    // Login de teste sem Supabase
    if (email.toLowerCase().trim() === TESTE_EMAIL && senha === TESTE_SENHA) {
      const token = await signJWT({
        sub: 'teste-id-000',
        email: TESTE_EMAIL,
        nome: 'Usuário Teste',
        role: 'admin',
      });

      const response = NextResponse.json({
        message: 'Login realizado com sucesso',
        usuario: { id: 'teste-id-000', email: TESTE_EMAIL, nome: 'Usuário Teste', role: 'admin' },
      });

      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });

      return response;
    }

    // Busca usuário no Supabase
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !usuario) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 });
    }

    // Verifica senha
    const senhaValida = await verificarSenha(senha, usuario.senha_hash);
    if (!senhaValida) {
      return NextResponse.json({ error: 'Email ou senha incorretos' }, { status: 401 });
    }

    // Verifica status
    if (usuario.status !== 'ativo') {
      return NextResponse.json(
        { error: 'Conta inativa. Entre em contato com o suporte.' },
        { status: 403 }
      );
    }

    // Verifica expiração
    if (usuario.data_expiracao && new Date(usuario.data_expiracao) < new Date()) {
      return NextResponse.json(
        { error: 'Seu acesso expirou. Renove sua assinatura.' },
        { status: 403 }
      );
    }

    // Gera JWT
    const token = await signJWT({
      sub: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      role: usuario.role,
    });

    // Retorna com cookie
    const response = NextResponse.json({
      message: 'Login realizado com sucesso',
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        role: usuario.role,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Erro no login:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
