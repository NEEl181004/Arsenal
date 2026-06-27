"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteToolButton({ id }: { id: string }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this payload documentation? This action cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/tools/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                router.push("/");
                router.refresh();
            } else {
                alert("Failed to delete documentation");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 transition-all disabled:opacity-50 cursor-pointer"
            style={{
                background: "rgba(255,0,60,0.06)",
                border: "1px solid rgba(255,0,60,0.25)",
                color: "#FF003C",
                fontFamily: "var(--font-mono), monospace",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,0,60,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,0,60,0.06)"; }}
        >
            <Trash2 className="w-3 h-3" /> {isDeleting ? "DELETING..." : "DELETE"}
        </button>
    );
}
