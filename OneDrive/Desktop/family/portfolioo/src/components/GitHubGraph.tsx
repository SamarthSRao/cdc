"use client";

import { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Github } from "lucide-react";
import { motion } from "framer-motion";

export default function GitHubGraph() {
  const username = "SamarthSRao";
  const [totalContributions, setTotalContributions] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.02, zIndex: 100 }}
      initial={{ zIndex: 10 }}
      className="rounded-2xl p-3 flex flex-col h-full w-full relative overflow-hidden group bg-[#111111] border border-white/[0.08] shadow-2xl cursor-grab active:cursor-grabbing backdrop-blur-3xl"
    >
      {/* Widget Handle Decoration */}
      <div className="flex justify-center mb-2">
        <div className="w-10 h-[2px] rounded-full bg-white/10" />
      </div>

      {/* Header Info synced to the requested snippet style */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <Github className="w-[11px] h-[11px] text-white/30" />
          <span className="text-[10px] font-medium text-white/60">
            {username}
          </span>
        </div>
        <span className="text-[10px] text-white/20">
          {totalContributions > 0 ? `${totalContributions.toLocaleString()} contributions` : "fetching..."}
        </span>
      </div>

      {/* Heatmap Area */}
      <div className="flex-grow flex items-center justify-center overflow-hidden w-full select-none">
        <div className="w-full overflow-x-auto scrollbar-hide opacity-80 group-hover:opacity-100 transition-opacity duration-300">
          <div className="min-w-max pb-1 scale-[0.98] origin-left">
            {mounted ? (
              <GitHubCalendar
                username={username}
                colorScheme="dark"
                theme={{
                  dark: ['#161b22', '#21262d', '#30363d', '#484f58', '#ffffff'],
                }}
                blockSize={9}
                blockMargin={2}
                blockRadius={2}
                fontSize={8}
                showMonthLabels={true}
                showColorLegend={false}
                showTotalCount={false}
                labels={{
                  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                }}
                transformData={(data) => {
                  const total = data.reduce((acc, day) => acc + day.count, 0);
                  if (total !== totalContributions) {
                    setTimeout(() => setTotalContributions(total), 0);
                  }
                  return data;
                }}
              />
            ) : (
              <div className="h-[120px] w-full bg-white/[0.02] animate-pulse rounded-lg" />
            )}
          </div>
        </div>
      </div>

      {/* Legend / Info Footer */}
      <div className="mt-4 flex justify-between items-center px-1">
        <p className="text-[9px] font-mono text-white/10 uppercase tracking-widest">
          Activity Matrix
        </p>
        <div className="flex gap-[3px] items-center">
          <span className="text-[9px] text-white/10 mr-1">Less</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className="w-2 h-2 rounded-[1px]"
              style={{
                backgroundColor: level === 0 ? '#161b22' :
                  level === 1 ? '#21262d' :
                    level === 2 ? '#30363d' :
                      level === 3 ? '#484f58' : '#ffffff'
              }}
            />
          ))}
          <span className="text-[9px] text-white/10 ml-1">More</span>
        </div>
      </div>
    </motion.div>
  );
}
