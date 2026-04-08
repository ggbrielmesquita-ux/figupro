import { NextRequest, NextResponse } from 'next/server';
import { listarFigurinhas } from '@/lib/figurinhas';
import { verifyJWT } from '@/lib/jwt';

const RESPONSE_HEADERS = {
  'Cache-Control': 'private, max-age=60, stale-while-revalidate=300',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ categoria: string }> }
) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token || !(await verifyJWT(token))) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 });
  }

  try {
    const { categoria } = await params;
    const figurinhas = await listarFigurinhas(categoria);
    return NextResponse.json({ figurinhas }, { headers: RESPONSE_HEADERS });
  } catch (error) {
    console.error('[/api/figurinhas/[categoria]] Erro:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        figurinhas: [],
      },
      {
        status: 500,
        headers: RESPONSE_HEADERS,
      }
    );
  }
}
