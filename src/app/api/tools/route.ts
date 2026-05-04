import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Tool from "@/models/Tool";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: Request) {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query: any = {};
    if (category) query.category = category;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } }
        ];
    }

    const tools = await Tool.find(query).sort({ createdAt: -1 });
    return NextResponse.json(tools);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await request.json();
    const tool = await Tool.create(data);
    return NextResponse.json(tool);
}
