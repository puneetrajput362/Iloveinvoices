import React from 'react';
import AppLayout from '@/components/AppLayout';
import PricingPaywall from './components/PricingPaywall';

export default function UpgradePage() {
  return (
    <AppLayout activeTab="upgrade">
      <PricingPaywall />
    </AppLayout>
  );
}