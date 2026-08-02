import React from 'react';
import AppLayout from '@/components/AppLayout';
import OcrVerificationClient from './components/OcrVerificationClient';

export default function AiOcrPage() {
  return (
    <AppLayout activeTab="scan">
      <OcrVerificationClient />
    </AppLayout>
  );
}