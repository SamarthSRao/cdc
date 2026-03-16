"use client";

import useSWR from "swr";
import { Music, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Spotify() {
  const { data, error } = useSWR("/api/now-playing", fetcher, {
    refreshInterval: 10000, // refresh every 10 seconds
  });

  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.02, zIndex: 100 }}
      initial={{ zIndex: 10 }}
      className="glass rounded-2xl flex flex-col w-[272px] relative overflow-hidden cursor-grab active:cursor-grabbing bg-background/30 backdrop-blur-xl border border-white/10 shadow-2xl p-1"
    >
      {/* Top Window Bar */}
      <div className="flex justify-center mt-1.2 py-1 m-1 opacity-30 border-b border-white/10 ">
        <div className="w-6 h-[2px]  color-light-orange rounded-full bg-white/10"></div>
      </div>

      <div className="flex items-center gap-3 px-2 py-2 ">
        {error || !data || !data.isPlaying ? (
          <div className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
              <Music className="w-4 h-4 text-white/20" />
            </div>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-tight">
              {error ? "Error" : "Not Playing"}
            </p>
          </div>
        ) : (
          <>
            <div className="relative w-8 h-8 flex-none overflow-hidden rounded-[4px] shadow-md ">
              <img src={data.albumImageUrl} alt={data.album} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
              <a href={data.songUrl} target="_blank" rel="noreferrer" className="font-bold text-[11px] leading-tight hover:underline truncate block">
                {data.title}
              </a>
              <p className="text-[10px] text-foreground/50 truncate">
                {data.artist}
              </p>
            </div>

            {/* Visualizer (EQ) */}
            <div className="flex items-end gap-[2px] h-3 flex-none pr-1">
              {[0.7, 0.85, 0.6].map((duration, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [0.3, 1, 0.3] }}
                  transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
                  className="w-[2px] h-full bg-[#1DB954] origin-bottom rounded-full"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}