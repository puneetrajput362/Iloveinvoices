'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import {
  Search,
  ChevronUp,
  ChevronDown,
  Eye,
  Trash2,
  CheckSquare,
  Square,
  Filter,
} from 'lucide-react';

const allInvoices = [
  {
    id: 'inv-2026-034',
    vendor: 'Sharma Traders Pvt Ltd',
    gstin: '27AAPCS1234K1ZR',
    invoiceNo: 'ST/2026/3421',
    date: '31/07/2026',
    items: 3,
    subtotal: '₹6,210',
    tax: '₹1,117.80',
    total: '₹7,327.80',
    status: 'verified' as const,
  },
  {
    id: 'inv-2026-033',
    vendor: 'Gupta Electronics',
    gstin: '07AAACG5678M1ZT',
    invoiceNo: 'GE-INV-890',
    date: '30/07/2026',
    items: 2,
    subtotal: '₹2,712',
    tax: '₹488.16',
    total: '₹3,200.16',
    status: 'review' as const,
  },
  {
    id: 'inv-2026-032',
    vendor: 'Patel Stationery House',
    gstin: '24ABCPP9012B1ZQ',
    invoiceNo: 'PSH/2026/112',
    date: '29/07/2026',
    items: 4,
    subtotal: '₹737',
    tax: '₹132.66',
    total: '₹869.66',
    status: 'verified' as const,
  },
  {
    id: 'inv-2026-031',
    vendor: 'Mehta Packaging Works',
    gstin: '06AABCM3456N1ZS',
    invoiceNo: 'MPW-26-0445',
    date: '28/07/2026',
    items: 5,
    subtotal: '₹4,780',
    tax: '₹860.40',
    total: '₹5,640.40',
    status: 'exported' as const,
  },
  {
    id: 'inv-2026-030',
    vendor: 'Jain Chemicals & Co.',
    gstin: '08AAABJ7890P1ZU',
    invoiceNo: 'JCC/AUG/078',
    date: '27/07/2026',
    items: 7,
    subtotal: '₹16,017',
    tax: '₹2,883.06',
    total: '₹18,900.06',
    status: 'review' as const,
  },
  {
    id: 'inv-2026-029',
    vendor: 'Kapoor Office Supplies',
    gstin: '29AABCK1234Q1ZV',
    invoiceNo: 'KOS-2026-234',
    date: '26/07/2026',
    items: 2,
    subtotal: '₹1,822',
    tax: '₹327.96',
    total: '₹2,149.96',
    status: 'verified' as const,
  },
  {
    id: 'inv-2026-028',
    vendor: 'Reddy Auto Parts',
    gstin: '36AABCR2345S1ZW',
    invoiceNo: 'RAP/2026/0189',
    date: '25/07/2026',
    items: 6,
    subtotal: '₹8,900',
    tax: '₹1,602',
    total: '₹10,502',
    status: 'exported' as const,
  },
  {
    id: 'inv-2026-027',
    vendor: 'Singh Fabrics Ltd',
    gstin: '03AABCS6789T1ZX',
    invoiceNo: 'SFL-INV-0034',
    date: '24/07/2026',
    items: 3,
    subtotal: '₹14,500',
    tax: '₹2,610',
    total: '₹17,110',
    status: 'verified' as const,
  },
  {
    id: 'inv-2026-026',
    vendor: 'Nair Spices Wholesale',
    gstin: '32AAACN4567U1ZY',
    invoiceNo: 'NSW/26/4521',
    date: '23/07/2026',
    items: 8,
    subtotal: '₹22,400',
    tax: '₹1,120',
    total: '₹23,520',
    status: 'verified' as const,
  },
  {
    id: 'inv-2026-025',
    vendor: 'Bansal IT Solutions',
    gstin: '09AAACB8901V1ZZ',
    invoiceNo: 'BIT-2026-112',
    date: '22/07/2026',
    items: 1,
    subtotal: '₹45,000',
    tax: '₹8,100',
    total: '₹53,100',
    status: 'exported' as const,
  },
];

const statusLabel: Record<string, string> = {
  verified: 'Verified',
  review: 'Needs Review',
  scanning: 'Scanning',
  exported: 'Exported',
  error: 'Error',
};

type SortKey = 'date' | 'total' | 'vendor' | 'status';
type SortDir = 'asc' | 'desc';

export default function InvoiceTable() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const filtered = allInvoices.filter((inv) => {
    const matchSearch =
      inv.vendor.toLowerCase().includes(search.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.gstin.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'vendor') cmp = a.vendor.localeCompare(b.vendor);
    else if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
    else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
    else if (sortKey === 'total')
      cmp =
        parseFloat(a.total.replace(/[₹,]/g, '')) -
        parseFloat(b.total.replace(/[₹,]/g, ''));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map((i) => i.id)));
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k)
      return <ChevronUp size={10} className="text-muted-foreground opacity-40" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={10} className="text-primary" />
    ) : (
      <ChevronDown size={10} className="text-primary" />
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">All Invoices</h2>
        <span className="text-xs text-muted-foreground">
          {filtered.length} invoices
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-field pl-8 text-xs"
            placeholder="Search vendor, invoice no, GSTIN…"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="input-field pl-7 pr-6 text-xs appearance-none w-32"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="review">Needs Review</option>
            <option value="exported">Exported</option>
          </select>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl gradient-primary animate-fade-in-up">
          <span className="text-xs font-bold text-white">
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2">
            <button className="text-xs font-semibold text-white/80 hover:text-white transition-colors">
              Export Selected
            </button>
            <button className="text-xs font-semibold text-white/80 hover:text-white transition-colors">
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card-elevated rounded-2xl overflow-hidden">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Search size={32} className="text-muted-foreground" />
            <p className="text-sm font-semibold text-foreground">No invoices found</p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-3 py-2.5 w-8">
                    <button onClick={toggleAll} className="flex items-center">
                      {selected.size === paginated.length && paginated.length > 0 ? (
                        <CheckSquare size={14} className="text-primary" />
                      ) : (
                        <Square size={14} className="text-muted-foreground" />
                      )}
                    </button>
                  </th>
                  <th
                    className="px-3 py-2.5 text-left cursor-pointer"
                    onClick={() => toggleSort('vendor')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                        Vendor
                      </span>
                      <SortIcon k="vendor" />
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-left">
                    <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                      Invoice No
                    </span>
                  </th>
                  <th
                    className="px-3 py-2.5 text-left cursor-pointer"
                    onClick={() => toggleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                        Date
                      </span>
                      <SortIcon k="date" />
                    </div>
                  </th>
                  <th className="px-3 py-2.5 text-right">
                    <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                      Tax
                    </span>
                  </th>
                  <th
                    className="px-3 py-2.5 text-right cursor-pointer"
                    onClick={() => toggleSort('total')}
                  >
                    <div className="flex items-center gap-1 justify-end">
                      <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                        Total
                      </span>
                      <SortIcon k="total" />
                    </div>
                  </th>
                  <th
                    className="px-3 py-2.5 text-center cursor-pointer"
                    onClick={() => toggleSort('status')}
                  >
                    <div className="flex items-center gap-1 justify-center">
                      <span className="text-2xs font-bold text-muted-foreground uppercase tracking-wider">
                        Status
                      </span>
                      <SortIcon k="status" />
                    </div>
                  </th>
                  <th className="px-3 py-2.5 w-16" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginated.map((inv) => (
                  <tr
                    key={inv.id}
                    className={`invoice-row-hover transition-colors ${
                      selected.has(inv.id) ? 'bg-primary/5' : ''
                    }`}
                  >
                    <td className="px-3 py-3">
                      <button
                        onClick={() => toggleSelect(inv.id)}
                        className="flex items-center"
                      >
                        {selected.has(inv.id) ? (
                          <CheckSquare size={14} className="text-primary" />
                        ) : (
                          <Square size={14} className="text-muted-foreground" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                        {inv.vendor}
                      </p>
                      <p className="text-2xs text-muted-foreground font-mono">
                        {inv.gstin}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs font-medium text-foreground">{inv.invoiceNo}</p>
                      <p className="text-2xs text-muted-foreground">{inv.items} items</p>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs text-foreground font-tabular">{inv.date}</p>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <p className="text-xs font-tabular text-muted-foreground">
                        {inv.tax}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <p className="text-xs font-bold font-tabular text-foreground">
                        {inv.total}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <Badge variant={inv.status}>{statusLabel[inv.status]}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href="/ai-ocr-scanning-verification-screen"
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/15 transition-colors"
                          title="View invoice"
                        >
                          <Eye size={13} className="text-muted-foreground" />
                        </Link>
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-danger/15 transition-colors"
                          title="Delete invoice"
                        >
                          <Trash2 size={13} className="text-muted-foreground hover:text-danger" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-3 py-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages} · {filtered.length} total
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 text-muted-foreground text-xs font-semibold"
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={`page-${p}`}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    page === p
                      ? 'gradient-primary text-white' :'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 text-muted-foreground text-xs font-semibold"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}