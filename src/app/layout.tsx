import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jetbrains" });

export const metadata: Metadata = {
    title: "Arsenal - Red Team Tool Documentation",
    description: "Red Team Tool Documentation",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} dark`}>
            <body className="bg-[#0a0a0a] text-white selection:bg-primary/20 selection:text-primary antialiased overflow-x-hidden">
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
            </body>
        </html>
    );
}
