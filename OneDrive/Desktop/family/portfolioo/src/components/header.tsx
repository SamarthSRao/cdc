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
    <header className="fixed top-0 left-0 right-0 h-10 flex items-center justify-end px-6 z-50 pointer-events-none">
      <div className="flex items-center gap-6 font-mono text-[13px] text-foreground/40 pointer-events-auto">
        {/* Visitors/Metric */}
        <div className="flex items-center gap-1.5 hover:text-foreground/80 transition-colors cursor-default">
          <ArrowUp className="w-3.5 h-3.5" />
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
