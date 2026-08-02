'use client';
import React, { useState } from 'react';
import GstSummaryCards from './GstSummaryCards';
import MonthlyChart from './MonthlyChart';
import InvoiceTable from './InvoiceTable';
import ExportModal from './ExportModal';
import { Download, FileSpreadsheet, FileText, Database } from 'lucide-react';

export default function DashboardClient() {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<'excel' | 'csv' | 'tally'>('excel');

  const openExport = (type: 'excel' | 'csv' | 'tally') => {
    setExportType(type);
    setExportModalOpen(true);
  };

  return (
    <div className="px-4 pt-4 pb-6 max-w-screen-2xl mx-auto space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-extrabold text-foreground">Invoice Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          August 2026 — 34 invoices · Last synced 2 min ago
        </p>
      </div>

      {/* GST Summary */}
      <GstSummaryCards />

      {/* Export Actions */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-foreground">Bulk Export</h2>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => openExport('excel')}
            className="card-elevated rounded-xl p-3 flex flex-col items-center gap-2 hover:border-success/40 transition-all duration-200 hover:bg-success/5 active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
              <FileSpreadsheet size={20} className="text-success" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">GST Excel</p>
              <p className="text-2xs text-muted-foreground">.xlsx</p>
            </div>
          </button>

          <button
            onClick={() => openExport('csv')}
            className="card-elevated rounded-xl p-3 flex flex-col items-center gap-2 hover:border-accent/40 transition-all duration-200 hover:bg-accent/5 active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
              <FileText size={20} className="text-accent" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">Download CSV</p>
              <p className="text-2xs text-muted-foreground">.csv</p>
            </div>
          </button>

          <button
            onClick={() => openExport('tally')}
            className="card-elevated rounded-xl p-3 flex flex-col items-center gap-2 hover:border-primary/40 transition-all duration-200 hover:bg-primary/5 active:scale-95"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Database size={20} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground">Tally Ready</p>
              <p className="text-2xs text-muted-foreground">.xml</p>
            </div>
          </button>
        </div>
      </div>

      {/* Monthly Chart */}
      <MonthlyChart />

      {/* Invoice Table */}
      <InvoiceTable />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        exportType={exportType}
      />
    </div>
  );
}