import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, nome, senha } = await request.json();

    if (!email || !senha) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 });
    }

    // Verification if user already exists
    const { data: usuarioExistente } = await supabaseAdmin
      .from('usuarios')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (usuarioExistente) {
      return NextResponse.json({ error: 'Este e-mail já está em uso.' }, { status: 400 });
    }

    const senhaHash = await bcrypt.hash(senha, 12);

    const { data: novoUsuario, error } = await supabaseAdmin.from('usuarios').insert({
      email: email.toLowerCase().trim(),
      senha_hash: senhaHash,
      nome: nome || null,
      role: 'user', // Default role
      status: 'pendente', // This is crucial. Pendente until Stripe Webhook changes to 'ativo'.
    }).select().single();

    if (error) {
       console.error('Database Error:', error.message);
       return NextResponse.json({ error: 'Erro ao criar conta no BD.' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Conta criada com sucesso',
      usuario: novoUsuario,
    });
  } catch (err) {
    console.error('Server logic error:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
