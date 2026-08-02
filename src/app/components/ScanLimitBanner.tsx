'use client';
import React from 'react';
import Link from 'next/link';
import { Zap, AlertTriangle } from 'lucide-react';

const SCANS_USED = 7;
const SCANS_TOTAL = 10;
const pct = Math.round((SCANS_USED / SCANS_TOTAL) * 100);
const isNearLimit = SCANS_USED >= SCANS_TOTAL * 0.7;

export default function ScanLimitBanner() {
  return (
    <div
      className={`card-elevated p-3 rounded-xl flex items-center gap-3 ${
        isNearLimit ? 'border-warning/40' : 'border-border'
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isNearLimit ? 'bg-warning/15' : 'bg-primary/15'
        }`}
      >
        {isNearLimit ? (
          <AlertTriangle size={18} className="text-warning" />
        ) : (
          <Zap size={18} className="text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-foreground">
            Free Plan: {SCANS_USED}/{SCANS_TOTAL} Scans Used
          </span>
          <Link
            href="/upgrade"
            className="text-2xs font-bold text-primary hover:underline flex-shrink-0"
          >
            Upgrade →
          </Link>
        </div>
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isNearLimit ? 'bg-warning' : 'gradient-primary'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {isNearLimit && (
          <p className="text-2xs text-warning mt-1">
            Only {SCANS_TOTAL - SCANS_USED} scans remaining this month!
          </p>
        )}
      </div>
    </div>
  );
}