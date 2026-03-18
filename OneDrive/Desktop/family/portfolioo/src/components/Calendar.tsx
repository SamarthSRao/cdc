"use client";

import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, startOfWeek, endOfWeek } from "date-fns";

export default function Visitors() {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-full min-h-[160px] relative flex flex-col bg-[#111111] border border-white/[0.08] rounded-2xl p-5 shadow-2xl overflow-hidden group hover:border-white/20 transition-colors backdrop-blur-3xl"
    >
      {/* Decorative Pill */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white/[0.05] rounded-full" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 mt-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {format(today, "MMMM yyyy")}
        </p>
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-white/[0.1]" />
          <div className="w-1 h-1 rounded-full bg-white/[0.1]" />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-y-2 gap-x-1 flex-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day} className="text-[9px] font-mono text-white/10 text-center uppercase tracking-widest">
            {day}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`
              relative flex items-center justify-center aspect-square text-[10px] font-mono transition-all rounded-md
              ${!isSameMonth(day, monthStart) ? "text-white/[0.03]" : "text-white/40"}
              ${isToday(day) ? "text-white font-bold bg-white/[0.08]" : ""}
              hover:bg-white/[0.04] cursor-default
            `}
          >
            {format(day, "d")}
            {isToday(day) && (
              <motion.div
                layoutId="today-glow"
                className="absolute inset-[-1px] border border-white/20 rounded-md pointer-events-none"
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
