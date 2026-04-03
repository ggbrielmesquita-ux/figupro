import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token || !(await verifyJWT(token))) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const resultado: Record<string, unknown> = {
    env: {
      SUPABASE_URL: url ? `${url.slice(0, 30)}...` : 'NÃO DEFINIDA',
      SERVICE_ROLE_KEY: key ? `${key.slice(0, 20)}...` : 'NÃO DEFINIDA',
      JWT_SECRET: process.env.JWT_SECRET ? 'definida' : 'NÃO DEFINIDA',
    },
  };

  if (!url || !key) {
    resultado.erro = 'Variáveis de ambiente faltando no Vercel!';
    return NextResponse.json(resultado);
  }

  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase.storage.from('figurinhas').list('', { limit: 10 });
    resultado.storage = {
      erro: error?.message ?? null,
      itens: data?.map((i) => ({ nome: i.name, id: i.id })) ?? [],
      total: data?.length ?? 0,
    };
  } catch (err) {
    resultado.storage = { excecao: String(err) };
  }

  return NextResponse.json(resultado);
}
