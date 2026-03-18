'use client';

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-7 flex items-center justify-between px-4 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white/90">Samarth S</span>
        <span className="text-white/10 text-[9px]">|</span>
        <span className="font-mono text-[10px] tracking-wide text-white/30">Desktop</span>
      </div>

      <div className="flex items-center gap-4 font-mono text-[11px] text-foreground/30 pointer-events-auto">
        {/* Visitors/Metric */}
        <div className="flex items-center gap-1 hover:text-foreground/80 transition-colors cursor-default">
          <ArrowUp className="w-2.5 h-2.5" />
          <span>651</span>
        </div>

        {/* Date */}
        <div className="hover:text-foreground/80 transition-colors cursor-default">
          {format(time, 'EEE, MMM dd')}
        </div>

        {/* Time */}
        <div className="hover:text-foreground/80 transition-colors cursor-default">
          {format(time, 'HH:mm')}
        </div>
      </div>
    </header>
  );
}
