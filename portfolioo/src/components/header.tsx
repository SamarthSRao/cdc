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
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      {/* Top small bar (OS style) */}
      <div className="h-7 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-white/90">Samarth S</span>
          <span className="hidden md:inline text-white/10 text-[9px]">|</span>
          <span className="hidden md:inline font-mono text-[10px] tracking-wide text-white/30">Desktop</span>
        </div>

        <div className="flex items-center gap-4 font-mono text-[11px] text-foreground/30 pointer-events-auto">
          <div className="flex md:hidden hover:text-foreground/80 transition-colors cursor-default">
            {format(time, 'HH:mm')}
          </div>
          <div className="hidden md:flex items-center gap-1 hover:text-foreground/80 transition-colors cursor-default">
            <ArrowUp className="w-2.5 h-2.5" />
            <span>651</span>
          </div>
          <div className="hidden md:block hover:text-foreground/80 transition-colors cursor-default">
            {format(time, 'EEE, MMM dd')}
          </div>
          <div className="hidden md:block hover:text-foreground/80 transition-colors cursor-default">
            {format(time, 'HH:mm')}
          </div>
        </div>
      </div>

      {/* Main Nav Bar (Featured in screenshot) */}
      <nav className="h-10 flex items-center px-4 overflow-x-auto scrollbar-hide border-t border-white/5">
        <div className="flex gap-6 min-w-max">
          {[
            { label: 'ABOUT', id: 'about-section', hiddenOnMobile: false },
            { label: 'EXPERIENCE', id: 'experience-section', hiddenOnMobile: false },
            { label: 'PROJECTS', id: 'projects-section', hiddenOnMobile: false },
            { label: 'WRITING', id: 'books-section', hiddenOnMobile: true },
            { label: 'CONTACT', id: 'contact-section', hiddenOnMobile: false },
            { label: 'RÉSUMÉ', id: 'resume-section', hiddenOnMobile: false }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => {
                const el = document.getElementById(item.id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-[10px] font-bold tracking-[0.15em] text-white/40 hover:text-white transition-colors uppercase ${item.hiddenOnMobile ? 'hidden md:inline-block' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}
