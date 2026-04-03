import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { listarCategorias } from '@/lib/figurinhas';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token || !(await verifyJWT(token))) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const categorias = await listarCategorias();
  return NextResponse.json({ categorias });
}
