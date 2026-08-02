'use client';
import React from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { ChevronRight, Building2, AlertTriangle } from 'lucide-react';

const recentInvoices = [
  {
    id: 'inv-2026-034',
    vendor: 'Sharma Traders Pvt Ltd',
    gstin: '27AAPCS1234K1ZR',
    invoiceNo: 'ST/2026/3421',
    date: '31/07/2026',
    total: '₹12,450',
    status: 'verified' as const,
    hasWarning: false,
  },
  {
    id: 'inv-2026-033',
    vendor: 'Gupta Electronics',
    gstin: '07AAACG5678M1ZT',
    invoiceNo: 'GE-INV-890',
    date: '30/07/2026',
    total: '₹3,200',
    status: 'review' as const,
    hasWarning: true,
  },
  {
    id: 'inv-2026-032',
    vendor: 'Patel Stationery House',
    gstin: '24ABCPP9012B1ZQ',
    invoiceNo: 'PSH/2026/112',
    date: '29/07/2026',
    total: '₹870',
    status: 'verified' as const,
    hasWarning: false,
  },
  {
    id: 'inv-2026-031',
    vendor: 'Mehta Packaging Works',
    gstin: '06AABCM3456N1ZS',
    invoiceNo: 'MPW-26-0445',
    date: '28/07/2026',
    total: '₹5,640',
    status: 'exported' as const,
    hasWarning: false,
  },
  {
    id: 'inv-2026-030',
    vendor: 'Jain Chemicals & Co.',
    gstin: '08AAABJ7890P1ZU',
    invoiceNo: 'JCC/AUG/078',
    date: '27/07/2026',
    total: '₹18,900',
    status: 'review' as const,
    hasWarning: true,
  },
  {
    id: 'inv-2026-029',
    vendor: 'Kapoor Office Supplies',
    gstin: '29AABCK1234Q1ZV',
    invoiceNo: 'KOS-2026-234',
    date: '26/07/2026',
    total: '₹2,150',
    status: 'verified' as const,
    hasWarning: false,
  },
];

const statusLabel: Record<string, string> = {
  verified: 'Verified',
  review: 'Needs Review',
  scanning: 'Scanning',
  exported: 'Exported',
  error: 'Error',
};

export default function RecentInvoices() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-foreground">Recent Scans</h2>
        <Link
          href="/dashboard-bulk-export"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View All →
        </Link>
      </div>
      <div className="space-y-2">
        {recentInvoices.map((inv) => (
          <Link
            key={inv.id}
            href="/ai-ocr-scanning-verification-screen"
            className="card-elevated rounded-xl p-3 flex items-center gap-3 invoice-row-hover block"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-foreground truncate">
                  {inv.vendor}
                </p>
                {inv.hasWarning && (
                  <AlertTriangle size={12} className="text-warning flex-shrink-0" />
                )}
              </div>
              <p className="text-2xs text-muted-foreground mt-0.5">
                {inv.invoiceNo} · {inv.date}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <p className="text-sm font-bold font-tabular text-foreground">{inv.total}</p>
              <Badge variant={inv.status}>{statusLabel[inv.status]}</Badge>
            </div>
            <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}