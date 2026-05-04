"use client";

import { useRef } from "react";
import { Bold, Underline } from "lucide-react";

interface RichInputProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
    label?: string;
}

export default function RichInput({ value, onChange, placeholder, className, label }: RichInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const applyTag = (tag: string) => {
        if (!inputRef.current) return;

        const input = inputRef.current;
        const start = input.selectionStart || 0;
        const end = input.selectionEnd || 0;
        const selectedText = value.substring(start, end);
        const before = value.substring(0, start);
        const after = value.substring(end);

        const newValue = `${before}<${tag}>${selectedText}</${tag}>${after}`;
        onChange(newValue);

        // Reset focus and selection
        setTimeout(() => {
            input.focus();
            const newPos = start + tag.length + 2 + selectedText.length + tag.length + 3;
            input.setSelectionRange(newPos, newPos);
        }, 10);
    };

    return (
        <div className="space-y-2 w-full">
            <div className="flex items-center justify-between">
                {label && <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</label>}
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={() => applyTag("b")}
                        className="p-1.5 bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all"
                        title="Bold"
                    >
                        <Bold className="w-2.5 h-2.5" />
                    </button>
                    <button 
                        type="button"
                        onClick={() => applyTag("u")}
                        className="p-1.5 bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all"
                        title="Underline"
                    >
                        <Underline className="w-2.5 h-2.5" />
                    </button>
                </div>
            </div>
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-black border border-white/10 p-4 text-white font-black focus:border-primary outline-none transition-all ${className}`}
            />
        </div>
    );
}
