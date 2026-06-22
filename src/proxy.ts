import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest, event: any) {
    const host = req.headers.get("host") || "localhost:3000";
    // Check x-forwarded-proto first to support reverse proxies / SSL termination correctly
    const protocol = req.headers.get("x-forwarded-proto") || req.nextUrl.protocol.replace(":", "") || "http";
    process.env.NEXTAUTH_URL = `${protocol}://${host}`;
    
    const handler = withAuth(
        function middleware(req) {
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
