'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const MonthlyChartInner = dynamic(() => import('./MonthlyChartInner'), { ssr: false });

export default function MonthlyChart() {
  return (
    <div className="card-elevated rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Monthly Invoice Volume</h3>
          <p className="text-2xs text-muted-foreground mt-0.5">
            Last 6 months — count of scanned invoices
          </p>
        </div>
      </div>
      <MonthlyChartInner />
    </div>
  );
}