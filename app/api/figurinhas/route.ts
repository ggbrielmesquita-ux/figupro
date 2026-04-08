import { NextRequest, NextResponse } from 'next/server';
import { listarCategorias } from '@/lib/figurinhas';
import { verifyJWT } from '@/lib/jwt';

const RESPONSE_HEADERS = {
  'Cache-Control': 'private, max-age=60, stale-while-revalidate=300',
};

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token || !(await verifyJWT(token))) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  try {
    const categorias = await listarCategorias();
    return NextResponse.json({ categorias }, { headers: RESPONSE_HEADERS });
  } catch (error) {
    console.error('[/api/figurinhas] Erro:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        categorias: [],
      },
      {
        status: 500,
        headers: RESPONSE_HEADERS,
      }
    );
  }
}
