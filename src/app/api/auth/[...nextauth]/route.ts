import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { NextRequest } from "next/server";

const handler = (req: NextRequest, ctx: any) => {
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    process.env.NEXTAUTH_URL = `${protocol}://${host}`;
    return NextAuth(authOptions)(req, ctx);
};

export { handler as GET, handler as POST };

