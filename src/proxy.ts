import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Pages qui nécessitent une authentification
  const protectedRoutes = ['/dashboard', '/builder', '/products', '/invoices', '/finance'];
  
  const pathname = request.nextUrl.pathname;
  
  // Vérifie si c'est une route protégée
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // TODO: Vérifier la session ici
    // Pour l'instant, laisser passer
    console.log('Protected route accessed:', pathname);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protéger ces routes
    '/dashboard/:path*',
    '/builder/:path*',
    '/products/:path*',
    '/invoices/:path*',
    '/finance/:path*',
  ],
};
