import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User";
import Tool from "./src/models/Tool";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/arsenal";

const nmapContent = `
<div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
<div class="space-y-6">
<h3 class="text-3xl font-black tracking-tighter uppercase text-primary-container italic">Network Scanning</h3>
<p>Highly optimized port discovery utilizing SYN, ACK, and UDP probes. Includes parallel scanning capabilities and adaptive timing algorithms to bypass simple traffic monitoring systems.</p>
</div>
<div class="bg-black/40 p-8 border-l-2 border-primary-container">
<p class="text-[10px] font-black tracking-widest text-[#5b403d] uppercase mb-4">Output_Telemetry</p>
<ul class="space-y-4 text-sm uppercase">
<li class="flex items-center gap-3">
<span class="w-1.5 h-1.5 bg-primary-container"></span>
<span class="flex-1 opacity-80">Target Availability Status</span>
<span class="text-primary-container font-bold">UP/DOWN</span>
</li>
<li class="flex items-center gap-3 border-t border-white/5 pt-4">
<span class="w-1.5 h-1.5 bg-primary-container"></span>
<span class="flex-1 opacity-80">Port State Classification</span>
<span class="text-primary-container font-bold">OPEN/FILTERED</span>
</li>
</ul>
</div>
</div>
`;

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        // Create Admin User
        const existingAdmin = await User.findOne({ email: "admin@crimsonvault.net" });
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                username: "AdminGhost",
                email: "admin@crimsonvault.net",
                password: hashedPassword,
                role: "admin",
            });
            console.log("Admin user created (admin@crimsonvault.net / admin123)");
        } else {
            console.log("Admin user already exists");
        }

        // Create Dummy Tool
        const existingTool = await Tool.findOne({ name: "NMAP" });
        if (!existingTool) {
            await Tool.create({
                name: "NMAP",
                category: "Discovery & Recon",
                developer: "Gordon Lyon",
                tier: "Expert",
                bestFor: "Red Teaming",
                content: nmapContent,
            });
            console.log("Dummy Tool (NMAP) created");
        } else {
            console.log("Dummy Tool (NMAP) already exists");
        }

        console.log("Seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
