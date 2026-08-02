'use client';
import React from 'react';
import Link from 'next/link';
import { ScanLine, LayoutDashboard, Zap } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface BottomNavProps {
  activeTab: 'scan' | 'dashboard' | 'upgrade';
}

const navItems = [
  {
    key: 'scan' as const,
    label: 'Scan',
    icon: ScanLine,
    href: '/',
  },
  {
    key: 'dashboard' as const,
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard-bulk-export',
  },
  {
    key: 'upgrade' as const,
    label: 'Upgrade',
    icon: Zap,
    href: '/upgrade',
  },
];

export default function BottomNav({ activeTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border bottom-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.key;
          const Icon = item.icon;
          return (
            <Link
              key={`nav-${item.key}`}
              href={item.href}
              className="flex flex-col items-center gap-1 flex-1 py-2 transition-all duration-200"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'gradient-primary glow-primary' :'bg-transparent hover:bg-muted'
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? 'text-white' : 'text-muted-foreground'}
                />
              </div>
              <span
                className={`text-2xs font-semibold ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}