"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFile = (file: File) => {
        if (!file.type.startsWith("image/")) return;
        
        const reader = new FileReader();
        reader.onloadend = () => {
            onChange(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, [onChange]);

    return (
        <div className="space-y-4">
            {label && <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</label>}
            
            <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={`relative group border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center gap-4 ${
                    isDragging ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20 bg-black/40"
                } ${value ? "h-auto" : "h-48"}`}
            >
                {value ? (
                    <div className="relative w-full">
                        <img src={value} alt="Preview" className="w-full h-auto grayscale hover:grayscale-0 transition-all border border-white/5" />
                        <button 
                            onClick={() => onChange("")}
                            className="absolute top-2 right-2 p-2 bg-black/80 text-white hover:text-primary border border-white/10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 text-white/20 group-hover:text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-white uppercase tracking-widest italic">DRAG_DROP_EVIDENCE</p>
                            <p className="text-[9px] text-white/20 uppercase tracking-widest mt-1">PNG_JPG_WEBP_DIRECT_STORAGE</p>
                        </div>
                        <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFile(file);
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </>
                )}
            </div>
        </div>
    );
}
