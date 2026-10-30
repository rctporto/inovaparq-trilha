import { NextResponse, type NextRequest } from "next/server";

// Barreira leve: sem cookie de sessão, nem renderiza as áreas internas.
// A autorização real (papel, situação da conta) é feita no servidor em src/lib/session.ts.
const PUBLIC = ["/", "/cadastro", "/acesso-negado"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.includes(pathname)) return NextResponse.next();
  const hasSession = req.cookies.has("authjs.session-token") || req.cookies.has("__Secure-authjs.session-token");
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|brand).*)"],
};
