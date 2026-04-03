import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { listarFigurinhas } from '@/lib/figurinhas';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoria: string; subcategoria: string }> }
) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token || !(await verifyJWT(token))) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { categoria, subcategoria } = await params;
  const figurinhas = listarFigurinhas(categoria, subcategoria);
  return NextResponse.json({ figurinhas });
}
