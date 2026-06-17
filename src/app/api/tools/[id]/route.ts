import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Tool from "@/models/Tool";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await connectToDatabase();
    const { id } = await params;
    const tool = await Tool.findById(id);
    if (!tool) return NextResponse.json({ error: "Tool not found" }, { status: 404 });
    return NextResponse.json(tool);
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const { id } = await params;
        const data = await request.json();
        
        // Load existing tool to retrieve original Base64 screenshots if they haven't changed
        const existingTool = await Tool.findById(id);
        if (!existingTool) {
            return NextResponse.json({ error: "Tool not found" }, { status: 404 });
        }

        if (data.scenarios && Array.isArray(data.scenarios)) {
            data.scenarios = data.scenarios.map((sc: any) => {
                if (sc.logsImage === "__KEEP_EXISTING_IMAGE__") {
                    const existingScenario = existingTool.scenarios.find(
                        (es: any) => es._id && sc._id && es._id.toString() === sc._id.toString()
                    );
                    if (existingScenario) {
                        sc.logsImage = existingScenario.logsImage;
                    } else {
                        sc.logsImage = "";
                    }
                }
                return sc;
            });
        }

        // Update the tool document
        const tool = await Tool.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        return NextResponse.json(tool);
    } catch (error: any) {
        console.error("PUT /api/tools/[id] error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const { id } = await params;
    await Tool.findByIdAndDelete(id);
    return NextResponse.json({ message: "Tool deleted" });
}
