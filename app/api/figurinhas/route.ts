import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { listarCategorias } from '@/lib/figurinhas';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token || !(await verifyJWT(token))) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  try {
    const categorias = await listarCategorias();
    return NextResponse.json({ categorias });
  } catch (err) {
    console.error('[/api/figurinhas] Erro:', err);
    return NextResponse.json({ error: String(err), categorias: [] }, { status: 500 });
  }
}
