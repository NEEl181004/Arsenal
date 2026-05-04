"use client";

import { useRef } from "react";
import { Bold, Underline } from "lucide-react";

interface RichTextareaProps {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
    label?: string;
}

export default function RichTextarea({ value, onChange, placeholder, className, rows = 4, label }: RichTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const applyTag = (tag: string) => {
        if (!textareaRef.current) return;

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const before = value.substring(0, start);
        const after = value.substring(end);

        const newValue = `${before}<${tag}>${selectedText}</${tag}>${after}`;
        onChange(newValue);

        // Reset focus and selection
        setTimeout(() => {
            textarea.focus();
            const newPos = start + tag.length + 2 + selectedText.length + tag.length + 3;
            textarea.setSelectionRange(newPos, newPos);
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
                        className="p-2 bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all group"
                        title="Bold"
                    >
                        <Bold className="w-3 h-3" />
                    </button>
                    <button 
                        type="button"
                        onClick={() => applyTag("u")}
                        className="p-2 bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all group"
                        title="Underline"
                    >
                        <Underline className="w-3 h-3" />
                    </button>
                </div>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className={`w-full bg-black border border-white/10 p-5 text-white text-sm font-light leading-relaxed focus:border-primary outline-none transition-all ${className}`}
            />
        </div>
    );
}
