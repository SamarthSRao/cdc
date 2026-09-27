"use client";

import { motion } from "framer-motion";

// 1. Data Structure Principle: Each object now includes a 'url' for the anchor tags
const WORTH_READING = [

    {
        title: "Code is cheap . Show me the talk.",
        author: "Kailash Nadh",
        category: "systems",
        url: "https://nadh.in/blog/code-is-cheap/",
    },
    {
        title: "Why gRPC uses HTTP2",
        author: "Arpit Bhayani",
        category: "systems",
        url: "https://arpitbhayani.com/blogs/grpc-http2",
    },
    {
        title: "Meditations",
        author: "Marcus Aurelius",
        category: "philosophy",
        url: "https://www.gutenberg.org/ebooks/2680",
    },
    {
        title: "Solana Program Library",
        author: "Solana Labs",
        category: "solana",
        url: "https://spl.solana.com",
    },
];

export default function Books() {
    return (
        <motion.div
            drag // Principle: Spatial UI allows the user to organize their workspace
            dragMomentum={false}
            whileDrag={{ scale: 1.02, zIndex: 50 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            // Component Principle: Absolute positioning for the draggable widget
            className="absolute select-none w-[240px] glass rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing z-10"
            style={{ left: "24px", top: "228px" }}
        >
            {/* Widget Handle Principle: Indicates where to grab the element */}
            <div className="flex justify-center py-2">
                <div className="w-6 h-[2px] rounded-full bg-white/10" />
            </div>

            <div className="flex flex-col">
                {/* Section Header Principle: Small, mono-spaced labels (OS-inspired) */}
                <div className="px-3 pt-2.5 pb-1 border-b border-white/5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-white/30">
                        Articles <span className="text-white/10">·</span> worth reading
                    </p>
                </div>

                {/* Action Principle: Mapping to Anchor tags for actual external links */}
                {WORTH_READING.map((item, index) => (
                    <a
                        key={item.title}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        // Layout Principle: Tight vertical spacing for a technical list feel
                        className="flex flex-col px-3 py-2 group border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors"
                    >
                        {/* Primary Typography: 11px sized secondary content color */}
                        <p className="text-[11px] leading-tight truncate text-white/70 group-hover:text-white transition-colors">
                            {item.title}
                        </p>

                        {/* Secondary Typography: 9px mono content for metadata */}
                        <p className="font-mono text-[9px] mt-0.5 text-white/30">
                            {item.author} <span className="text-white/10">·</span> {item.category}
                        </p>
                    </a>
                ))}
            </div>
        </motion.div>
    );
}