import mongoose from "mongoose";

declare global {
    var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Arsenal";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function migrateDatabase(conn: any) {
    try {
        // Access model via connection to prevent circular dependency imports
        const Tool = conn.models.Tool || conn.model("Tool");
        
        const toolsToMigrate = await Tool.find({
            $or: [
                { system_support: { $exists: false } },
                { system_support: { $size: 0 } },
                { minimum_spec: { $exists: false } },
                { minimum_spec: { $size: 0 } },
                { optimized_spec: { $exists: false } },
                { optimized_spec: { $size: 0 } }
            ]
        });

        if (toolsToMigrate.length > 0) {
            console.log(`[Migration] Found ${toolsToMigrate.length} tools lacking specs. Applying defaults...`);
            for (const tool of toolsToMigrate) {
                let updated = false;
                if (!tool.system_support || tool.system_support.length === 0) {
                    tool.system_support = [
                        { os: "Debian/Ubuntu", icon: "Terminal", sub: "Kernel 5.x+ Required" },
                        { os: "Windows 11", icon: "Monitor", sub: "WSL2 Subsystem Refined" },
                        { os: "macOS Silicon", icon: "Globe", sub: "ARM64 Native Architecture" }
                    ];
                    updated = true;
                }
                if (!tool.minimum_spec || tool.minimum_spec.length === 0) {
                    tool.minimum_spec = [
                        { k: "CPU", v: "8 CORES" },
                        { k: "RAM", v: "16 GB DDR5" },
                        { k: "STORAGE", v: "5 GB SSD" },
                        { k: "GPU", v: "SUPPORTED" }
                    ];
                    updated = true;
                }
                if (!tool.optimized_spec || tool.optimized_spec.length === 0) {
                    tool.optimized_spec = [
                        { k: "CPU", v: "32 CORES (5.0GHz+)" },
                        { k: "RAM", v: "64 GB DDR5" },
                        { k: "STORAGE", v: "25 GB NVMe Gen5" },
                        { k: "NETWORK", v: "10Gbps+ SYMMETRIC" }
                    ];
                    updated = true;
                }
                if (updated) {
                    await tool.save();
                    console.log(`[Migration] Updated specs for tool: ${tool.name}`);
                }
            }
        }
    } catch (err) {
        console.error("[Migration] Error running database migration:", err);
    }
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        await migrateDatabase(cached.conn);
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectToDatabase;
