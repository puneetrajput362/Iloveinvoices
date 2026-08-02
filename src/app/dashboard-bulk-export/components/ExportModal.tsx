'use client';
import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { FileSpreadsheet, FileText, Database, Download, CheckCircle, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';


interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exportType: 'excel' | 'csv' | 'tally';
}

const exportConfig = {
  excel: {
    icon: FileSpreadsheet,
    color: 'text-success',
    bg: 'bg-success/15',
    label: 'GST Excel Export',
    ext: '.xlsx',
    desc: 'GSTR-2A compatible Excel sheet with CGST/SGST/IGST columns, vendor-wise summary, and ITC calculation.',
    size: '~48 KB',
  },
  csv: {
    icon: FileText,
    color: 'text-accent',
    bg: 'bg-accent/15',
    label: 'CSV Export',
    ext: '.csv',
    desc: 'Flat CSV file with all invoice fields — import directly into any accounting software.',
    size: '~12 KB',
  },
  tally: {
    icon: Database,
    color: 'text-primary',
    bg: 'bg-primary/15',
    label: 'Tally-Ready XML',
    ext: '.xml',
    desc: 'Tally Prime / Tally ERP 9 compatible XML with ledger entries, GST details, and narration.',
    size: '~28 KB',
  },
};

type ExportState = 'idle' | 'loading' | 'done';

export default function ExportModal({ isOpen, onClose, exportType }: ExportModalProps) {
  const [exportState, setExportState] = useState<ExportState>('idle');
  const [selectedRange, setSelectedRange] = useState('aug-2026');

  const cfg = exportConfig[exportType];
  const Icon = cfg.icon;

  const handleExport = async () => {
    setExportState('loading');
    // BACKEND: POST /api/export?type=exportType&range=selectedRange — returns file blob
    await new Promise((r) => setTimeout(r, 1800));
    setExportState('done');
    toast.success(`${cfg.label} downloaded successfully!`);
    setTimeout(() => {
      setExportState('idle');
      onClose();
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Invoices" size="md">
      <div className="space-y-4">
        {/* Export type card */}
        <div className={`flex items-start gap-3 p-3 rounded-xl border border-border ${cfg.bg}`}>
          <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={20} className={cfg.color} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {cfg.label}
              <span className="ml-2 text-xs font-mono text-muted-foreground">{cfg.ext}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{cfg.desc}</p>
            <p className="text-2xs text-muted-foreground mt-1">
              Estimated size: {cfg.size} · 34 invoices included
            </p>
          </div>
        </div>

        {/* Date range */}
        <div>
          <label className="text-xs font-semibold text-foreground block mb-2">
            <Calendar size={12} className="inline mr-1" />
            Select Period
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'aug-2026', label: 'August 2026', count: 34 },
              { value: 'jul-2026', label: 'July 2026', count: 26 },
              { value: 'q2-2026', label: 'Q2 FY2026-27', count: 72 },
              { value: 'all', label: 'All Time', count: 127 },
            ].map((range) => (
              <button
                key={`range-${range.value}`}
                onClick={() => setSelectedRange(range.value)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-150 ${
                  selectedRange === range.value
                    ? 'border-primary bg-primary/10' :'border-border hover:border-primary/40 hover:bg-muted/50'
                }`}
              >
                <p className="text-xs font-semibold text-foreground">{range.label}</p>
                <p className="text-2xs text-muted-foreground">{range.count} invoices</p>
              </button>
            ))}
          </div>
        </div>

        {/* Include options */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground">Include in Export</p>
          {[
            { id: 'opt-verified', label: 'Verified invoices only', checked: true },
            { id: 'opt-pending', label: 'Include needs-review', checked: false },
            { id: 'opt-notes', label: 'Include notes column', checked: true },
          ].map((opt) => (
            <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={opt.checked}
                className="w-4 h-4 rounded accent-primary"
              />
              <span className="text-xs text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleExport}
          disabled={exportState !== 'idle'}
          className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {exportState === 'loading' ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Preparing file…
            </>
          ) : exportState === 'done' ? (
            <>
              <CheckCircle size={16} />
              Downloaded!
            </>
          ) : (
            <>
              <Download size={16} />
              Download {cfg.ext}
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}