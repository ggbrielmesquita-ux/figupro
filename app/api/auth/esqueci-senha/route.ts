import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { enviarEmailRecuperacao } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 });
    }

    const { data: usuario } = await supabaseAdmin
      .from('usuarios')
      .select('id, email')
      .eq('email', email.toLowerCase().trim())
      .single();

    // Sempre retorna sucesso para não vazar quais emails existem
    if (!usuario) {
      return NextResponse.json({
        message: 'Se este email estiver cadastrado, você receberá um link de recuperação.',
      });
    }

    // Gera token único
    const token = crypto.randomBytes(32).toString('hex');
    const expira = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await supabaseAdmin
      .from('usuarios')
      .update({ reset_token: token, reset_token_expira: expira.toISOString() })
      .eq('id', usuario.id);

    await enviarEmailRecuperacao(usuario.email, token);

    return NextResponse.json({
      message: 'Se este email estiver cadastrado, você receberá um link de recuperação.',
    });
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    return NextResponse.json({ error: 'Erro ao processar solicitação' }, { status: 500 });
  }
}
