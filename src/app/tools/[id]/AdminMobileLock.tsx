"use client";

import { ShieldAlert } from "lucide-react";

export default function AdminMobileLock() {
    const handleLockClick = () => {
        alert("ADMIN_SECURITY_LOCK: Tool modifications are restricted to desktop environments for operational integrity.");
    };

    return (
        <button 
            onClick={handleLockClick}
            className="md:hidden flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/[0.03] px-4 py-2 hover:bg-primary/20 transition-all border border-white/10 whitespace-nowrap"
        >
            <ShieldAlert className="w-3.5 h-3.5 text-primary" /> MODIFY
        </button>
    );
}
