import { NextRequest, NextResponse } from "next/server";


export default function middleware(request: NextRequest){
    const {pathname} = request.nextUrl;

    const publicPaths = ['/login', '/sign-up'];

    if(publicPaths.some((path) => pathname.startsWith(path))){
        return NextResponse.next();
    }

      if (
            pathname.startsWith("/_next") ||
            pathname.startsWith("/api") ||
            pathname.startsWith("/favicon.ico") ||
            pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)
        ) {
            return NextResponse.next();
        }
    const sessionId = request.cookies.get("sessionId")?.value;

     if (!sessionId) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";

    return NextResponse.redirect(loginUrl);
  }

  // ✅ Session exists → continue
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};
