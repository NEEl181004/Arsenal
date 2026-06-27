"use client";

import { motion } from "framer-motion";
import { FileText, Globe, Shield, Zap } from "lucide-react";

const features = [
  {
    title: "Structured & Actionable",
    desc: "Clear, consistent, and actionable documentation for every tool and technique.",
    icon: FileText,
  },
  {
    title: "Real-World Focus",
    desc: "Practical examples, use cases, and tested scenarios from real-world engagements.",
    icon: Globe,
  },
  {
    title: "Operator Driven",
    desc: "Built by operators, for operators. Community-driven and constantly improved.",
    icon: Shield,
  },
  {
    title: "Always Up-to-Date",
    desc: "Continuously updated content to keep up with the evolving threat landscape.",
    icon: Zap,
  },
];

export default function Features() {
  return (
    <section className="relative py-10">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border border-zinc-800/60 bg-[#040507]/80 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.8)] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y xl:divide-y-0 xl:divide-x divide-zinc-800/40 overflow-hidden"
      >
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-8 group hover:bg-red-500/[0.025] transition-all duration-300 relative"
            >
              {/* subtle top accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/0 to-transparent group-hover:via-red-500/30 transition-all duration-500" />

              {/* Icon */}
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/6 text-red-500 transition duration-300 group-hover:border-red-500/40 group-hover:bg-red-500/12">
                <Icon size={18} className="stroke-[2]" />
              </div>

              {/* Title */}
              <h3
                className="mb-2 text-white uppercase"
                style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "0.14em" }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                className="leading-relaxed text-zinc-500"
                style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "12px" }}
              >
                {feature.desc}
              </p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}