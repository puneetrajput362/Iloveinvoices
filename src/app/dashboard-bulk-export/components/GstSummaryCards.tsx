import React from 'react';
import { TrendingUp, Receipt, ShieldAlert, PackageCheck } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const cards = [
  {
    id: 'card-invoices',
    label: 'Total Invoices',
    value: '34',
    sub: 'Aug 2026',
    icon: Receipt,
    color: 'text-primary',
    bg: 'bg-primary/10',
    trend: '+8 vs Jul',
    trendUp: true,
  },
  {
    id: 'card-itc',
    label: 'ITC Earned',
    value: '₹14,820',
    sub: 'Input Tax Credit',
    icon: TrendingUp,
    color: 'text-accent',
    bg: 'bg-accent/10',
    trend: '+₹2,140',
    trendUp: true,
  },
  {
    id: 'card-gst',
    label: 'GST Payable',
    value: '₹9,340',
    sub: 'This month',
    icon: ShieldAlert,
    color: 'text-warning',
    bg: 'bg-warning/10',
    trend: 'Due 20 Aug',
    trendUp: false,
  },
  {
    id: 'card-exported',
    label: 'Exported',
    value: '28',
    sub: 'Ready for Tally',
    icon: PackageCheck,
    color: 'text-success',
    bg: 'bg-success/10',
    trend: '6 pending',
    trendUp: false,
  },
];

export default function GstSummaryCards() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {cards?.map((card) => {
        const Icon = card?.icon;
        return (
          <div key={card?.id} className="card-elevated rounded-xl p-3">
            <div className="flex items-start justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg ${card?.bg} flex items-center justify-center`}>
                <Icon size={16} className={card?.color} />
              </div>
              <span
                className={`text-2xs font-semibold px-1.5 py-0.5 rounded-full ${
                  card?.trendUp
                    ? 'bg-success/15 text-success' :'bg-warning/15 text-warning'
                }`}
              >
                {card?.trend}
              </span>
            </div>
            <p className="text-xl font-extrabold font-tabular text-foreground">
              {card?.value}
            </p>
            <p className="text-2xs text-muted-foreground font-medium mt-0.5">
              {card?.sub}
            </p>
            <p className="text-2xs text-muted-foreground">{card?.label}</p>
          </div>
        );
      })}
    </div>
  );
}