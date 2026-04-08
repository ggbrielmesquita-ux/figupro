import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

const ROTAS_PROTEGIDAS = ['/painel', '/perfil'];
const ROTAS_AUTH = ['/login', '/esqueci-senha', '/resetar-senha'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isRotaProtegida = ROTAS_PROTEGIDAS.some((rota) => pathname.startsWith(rota));
  const isRotaAuth = ROTAS_AUTH.some((rota) => pathname.startsWith(rota));

  const token = request.cookies.get('auth_token')?.value;

  if (isRotaProtegida) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }

    // Passa o usuário para as rotas via header
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.sub);
    requestHeaders.set('x-user-email', payload.email);
    requestHeaders.set('x-user-role', payload.role);

    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Se já está logado e tenta acessar login, redireciona para o painel
  if (isRotaAuth && pathname === '/login' && token) {
    const payload = await verifyJWT(token);
    if (payload) {
      return NextResponse.redirect(new URL('/painel', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/painel/:path*',
    '/perfil/:path*',
    '/login',
    '/esqueci-senha',
    '/resetar-senha/:path*',
  ],
};
