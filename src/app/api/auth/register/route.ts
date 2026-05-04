import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { username, email, password, role } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "user", // defaults to "user" if not specified
        });

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
}
