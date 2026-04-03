import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import { supabaseAdmin } from '@/lib/supabase';

const BUCKET = 'figurinhas';
const SIGNED_URL_EXPIRY = 60 * 60; // 1 hora

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token || !(await verifyJWT(token))) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const { path: pathSegments } = await params;
  const storagePath = pathSegments.map(decodeURIComponent).join('/');

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_EXPIRY);

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl, { status: 302 });
}
