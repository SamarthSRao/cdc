"use client";

import { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { Github } from "lucide-react";

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
      className="rounded-xl p-5 flex flex-col h-full w-full relative overflow-hidden group bg-[#0D0D0D] border border-white/10 shadow-md"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 w-full">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
        >
          <Github className="w-4 h-4" />
          <span className="text-[13px] font-semibold tracking-tight leading-none">{username}</span>
        </a>
        <span className="text-[12px] text-[#8b949e] leading-none">
          {totalContributions > 0 ? `${totalContributions} contributions this year` : "Loading..."}
        </span>
      </div>

      {/* Graph Area */}
      <div className="flex-grow flex items-center justify-center overflow-hidden w-full select-none">
        <div className="w-full overflow-x-auto scrollbar-hide opacity-90 hover:opacity-100 transition-opacity duration-300">
          <div className="min-w-max pb-1">
            {mounted ? (
              <GitHubCalendar
                username={username}
                colorScheme="dark"
                theme={{
                  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
                }}
                blockSize={11}
                blockMargin={3}
                blockRadius={2}
                fontSize={11}
                showColorLegend={false}
                showTotalCount={false}
                transformData={(data) => {
                  const total = data.reduce((acc, day) => acc + day.count, 0);
                  if (total !== totalContributions) {
                    setTimeout(() => setTotalContributions(total), 0);
                  }
                  return data;
                }}
              />
            ) : (
              <div className="h-[120px] w-full" /> // Placeholder while mounting
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
