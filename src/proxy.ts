import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default async function proxy(req: NextRequest, event: any) {
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.nextUrl.protocol || "http:";
    process.env.NEXTAUTH_URL = `${protocol}//${host}`;
    
    const handler = withAuth(
        function proxy(req) {
            if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "admin") {
                return NextResponse.redirect(new URL("/", req.url));
            }
        },
        {
            callbacks: {
                authorized: ({ token }) => !!token,
            },
        }
    );
    
    return (handler as any)(req, event);
}

export const config = { matcher: ["/admin/:path*", "/tools/:path*"] };
