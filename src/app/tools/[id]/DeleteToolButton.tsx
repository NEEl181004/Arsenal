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
            className="flex items-center gap-2 text-xs font-label uppercase tracking-widest bg-error-container text-on-error-container px-4 py-2 hover:brightness-110 transition-colors disabled:opacity-50"
        >
            <Trash2 className="w-4 h-4" /> {isDeleting ? "DELETING..." : "DELETE"}
        </button>
    );
}
