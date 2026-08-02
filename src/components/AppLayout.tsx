'use client';
import React from 'react';
import BottomNav from './BottomNav';
import TopHeader from './TopHeader';
import { ThemeProvider } from './ThemeProvider';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: 'scan' | 'dashboard' | 'upgrade';
}

export default function AppLayout({ children, activeTab }: AppLayoutProps) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <TopHeader />
        <main className="flex-1 overflow-y-auto pb-24 pt-16">
          {children}
        </main>
        <BottomNav activeTab={activeTab} />
      </div>
    </ThemeProvider>
  );
}