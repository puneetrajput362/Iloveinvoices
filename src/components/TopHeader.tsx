'use client';
import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Bell } from 'lucide-react';

export default function TopHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 glass-card border-b border-border">
      <Link href="/" className="flex items-center gap-2">
        <AppLogo size={32} />
        <span className="font-extrabold text-base tracking-tight text-foreground">
          ILoveInvoice
        </span>
        <span className="text-2xs font-bold px-1.5 py-0.5 rounded-full gradient-primary text-white ml-1">
          PRO
        </span>
      </Link>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-muted hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun size={16} className="text-warning" />
          ) : (
            <Moon size={16} className="text-primary" />
          )}
        </button>
        <button className="relative w-8 h-8 rounded-full flex items-center justify-center bg-muted hover:bg-secondary transition-colors">
          <Bell size={16} className="text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-danger" />
        </button>
      </div>
    </header>
  );
}