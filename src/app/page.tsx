import React from 'react';
import AppLayout from '@/components/AppLayout';
import ScannerHero from './components/ScannerHero';
import ScanLimitBanner from './components/ScanLimitBanner';
import QuickStats from './components/QuickStats';
import RecentInvoices from './components/RecentInvoices';

export default function LandingScannerPage() {
  return (
    <AppLayout activeTab="scan">
      <div className="px-4 pt-4 pb-6 max-w-screen-2xl mx-auto space-y-5">
        <ScanLimitBanner />
        <ScannerHero />
        <QuickStats />
        <RecentInvoices />
      </div>
    </AppLayout>
  );
}