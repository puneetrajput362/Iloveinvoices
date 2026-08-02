import React from 'react';
import { TrendingUp, ShieldCheck, AlertCircle, FileCheck } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const stats = [
  {
    id: 'stat-count',
    label: 'This Month',
    value: '34',
    unit: 'invoices',
    icon: FileCheck,
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    id: 'stat-itc',
    label: 'Total ITC',
    value: '₹14,820',
    unit: 'earned',
    icon: TrendingUp,
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    id: 'stat-gst',
    label: 'GST Liability',
    value: '₹9,340',
    unit: 'payable',
    icon: ShieldCheck,
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    id: 'stat-unverified',
    label: 'Needs Review',
    value: '4',
    unit: 'pending',
    icon: AlertCircle,
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
];

export default function QuickStats() {
  return (
    <div>
      <h2 className="text-sm font-bold text-foreground mb-3">August 2026 Summary</h2>
      <div className="grid grid-cols-2 gap-3">
        {stats?.map((stat) => {
          const Icon = stat?.icon;
          return (
            <div key={stat?.id} className="card-elevated p-3 rounded-xl">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${stat?.bg} flex items-center justify-center`}>
                  <Icon size={16} className={stat?.color} />
                </div>
              </div>
              <p className="text-xl font-extrabold font-tabular text-foreground">
                {stat?.value}
              </p>
              <p className="text-2xs text-muted-foreground mt-0.5 font-medium">
                {stat?.unit}
              </p>
              <p className="text-2xs text-muted-foreground font-medium">{stat?.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}