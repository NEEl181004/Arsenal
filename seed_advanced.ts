import mongoose from "mongoose";
import Tool from "./src/models/Tool";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/arsenal";

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB for ultimate tactical seeding...");

        const nmap = {
            name: "NMAP",
            category: "Discovery",
            developer: "Gordon Lyon",
            tier: "Expert",
            bestFor: "Red Teaming",
            overview: `
                <p>Nmap (Network Mapper) is an open-source tool for <strong>network exploration</strong> and security auditing. It was designed to rapidly scan large networks, although it works fine against single hosts.</p>
                <p>It uses raw IP packets in novel ways to determine what hosts are available on the network, what services those hosts are offering, what operating systems they are running, and what type of packet filters/firewalls are in use.</p>
            `,
            core_modules: [
                {
                    name: "Scanning",
                    icon: "Target",
                    title: "Network Interrogation",
                    description: "Highly optimized port discovery utilizing SYN, ACK, and UDP probes. Includes parallel scanning capabilities and adaptive timing algorithms.",
                    telemetry: [
                        { key: "Target Status", value: "Up/Down" },
                        { key: "Port State", value: "Open/Filtered" },
                        { key: "Latency (RTT)", value: "MS_Precision" }
                    ]
                },
                {
                    name: "Enumeration",
                    icon: "Search",
                    title: "Service Fingerprinting",
                    description: "Intensive interrogation of open ports to determine service versions, application names, and underlying OS signatures.",
                    telemetry: [
                        { key: "Version Confidence", value: "98.2%" },
                        { key: "OS Match", value: "Linux 5.4.x" },
                        { key: "CPE Vectors", value: "Active" }
                    ]
                }
            ],
            installation_sequence: [
                {
                    tabName: "Debian/Ubuntu",
                    steps: [
                        { id: "01", name: "ENVIRONMENT SYNC", desc: "Refresh the local package index to ensure the latest binaries are accessible.", cmd: "sudo apt-get update && sudo apt-get upgrade -y" },
                        { id: "02", name: "REPOSITORY ACQUISITION", desc: "Clone the official Nmap source repository for the most up-to-date scripts.", cmd: "git clone https://github.com/nmap/nmap.git" },
                        { id: "03", name: "DEPLOYMENT", desc: "Install the Nmap package directly via the standardized package manager.", cmd: "sudo apt-get install nmap -y" }
                    ]
                },
                {
                    tabName: "Windows 11",
                    steps: [
                        { id: "01", name: "DEPENDENCY_INIT", desc: "Download and install Npcap for raw packet capture capabilities.", cmd: "winget install Npcap" },
                        { id: "02", name: "BINARY_DEPLOY", desc: "Install the Nmap Windows binary package.", cmd: "winget install nmap" }
                    ]
                }
            ],
            scenarios: [
                {
                    name: "Stealth Reconnaissance",
                    objective: "Deep interrogation of the ALPHA-7 node infrastructure.",
                    objectiveList: ["Bypass port-security on edge routers", "Enumerate hidden broadcast domains", "Export raw packet captures for decryption"],
                    script: "import hades_core.engine as core\nexec target_id = \"10.0.4.129\"\n// Initialize stealth recon sequence\ncore.initialize_stealth_recon(target_id, intensity=5, evasion=TRUE)\ncore.set_payload_anchor(\"vault_auth_v2\")",
                    logsImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
                    implications: [
                        { title: "PAYLOAD_SIGNATURE", content: "Low packet volume helps avoid heuristic IDS triggers." },
                        { title: "NETWORK_VISIBILITY", content: "Origin IP masked via transient ephemeral nodes." }
                    ],
                    attackPaths: [
                        { title: "PRIVILEGE_ESCALATION", risk: "MEDIUM_PROBABILITY", desc: "Exploit misconfigured SUID binaries found during scan." }
                    ]
                },
                {
                    name: "Aggressive Enumeration",
                    objective: "Force disclosure of hidden services on Segment-D clusters.",
                    objectiveList: ["Intensive service versioning", "OS fingerprinting across DMZ", "Script-based vulnerability auditing"],
                    script: "import hades_core.engine as core\nexec target_range = \"10.0.4.0/24\"\n// High-intensity tactical scan\ncore.initialize_aggro_recon(target_range, threads=50, timing=5)\ncore.execute_vuln_scan(engine=\"NSE_FULL\")",
                    logsImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=2000",
                    implications: [
                        { title: "PAYLOAD_SIGNATURE", content: "Extremely high packet volume. Will trigger all IDS layers." },
                        { title: "DATA_INTEGRITY", content: "Rapid results but higher risk of service disruption." }
                    ],
                    attackPaths: [
                        { title: "LATERAL_MOVEMENT", risk: "HIGH_RISK", desc: "Pivot through detected vulnerable SMB shares." }
                    ]
                }
            ],
            troubleshooting: [
                { problem: "Npcap Loopback Missing", cause: "Windows 11 loopback adapter not initialized correctly.", resolution: "Reinstall Npcap with 'Support loopback adapter' checked." }
            ],
            references_list: [
                { name: "Official Documentation", type: "Docs", url: "https://nmap.org/docs.html", updatedAt: "2024.01.15" }
            ]
        };

        await Tool.deleteMany({ name: "NMAP" });
        await Tool.create(nmap);
        
        console.log("Ultimate seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
