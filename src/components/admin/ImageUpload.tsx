"use client";

import { useState, useCallback } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

const parseImages = (val: string): string[] => {
    if (!val) return [];
    const str = val.trim();
    if (!str) return [];
    if (str.includes("||")) {
        return str.split("||").map(s => s.trim()).filter(Boolean);
    }
    if (str.includes(",data:")) {
        return str.split(/,(?=data:)/).map(s => s.trim()).filter(Boolean);
    }
    return [str];
};

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const images = parseImages(value);

    const handleFiles = (files: File[]) => {
        const imageFiles = files.filter(f => f.type.startsWith("image/"));
        if (imageFiles.length === 0) return;

        const promises = imageFiles.map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(promises).then(newImages => {
            const currentImages = parseImages(value);
            const updated = [...currentImages, ...newImages];
            onChange(updated.join(" || "));
        });
    };

    const handleRemove = (indexToRemove: number) => {
        const updatedImages = images.filter((_, idx) => idx !== indexToRemove);
        onChange(updatedImages.join(" || "));
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    }, [value, onChange]);

    return (
        <div className="space-y-4">
            {label && <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</label>}
            
            {/* Grid of uploaded images */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative group border border-white/5 bg-black/40 p-2 flex items-center justify-center min-h-[120px]">
                            <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-auto grayscale hover:grayscale-0 transition-all object-contain max-h-[140px]" />
                            <button 
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className="absolute top-2 right-2 p-1.5 bg-black/80 text-white hover:text-primary border border-white/10 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Upload Area */}
            <div 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                className={`relative group border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center gap-4 cursor-pointer ${
                    isDragging ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20 bg-black/40"
                } h-32`}
            >
                <div className="w-10 h-10 bg-white/5 border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-4 h-4 text-white/20 group-hover:text-primary" />
                </div>
                <div className="text-center">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest italic">DRAG_DROP_EVIDENCE_IMGS</p>
                    <p className="text-[8px] text-white/20 uppercase tracking-widest mt-1">PNG_JPG_WEBP_MULTIPLE_SUPPORTED</p>
                </div>
                <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        handleFiles(files);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
}
