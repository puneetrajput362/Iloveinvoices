'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { month: 'Mar', count: 18, itc: 8200 },
  { month: 'Apr', count: 22, itc: 10400 },
  { month: 'May', count: 19, itc: 9100 },
  { month: 'Jun', count: 31, itc: 14600 },
  { month: 'Jul', count: 26, itc: 12680 },
  { month: 'Aug', count: 34, itc: 14820 },
];

interface TooltipPayload {
  value: number;
  name: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="card-elevated rounded-xl p-3 shadow-card min-w-[120px]">
      <p className="text-xs font-bold text-foreground mb-1">{label} 2026</p>
      <p className="text-xs text-muted-foreground">
        Invoices:{' '}
        <span className="font-tabular font-bold text-primary">
          {payload[0]?.value}
        </span>
      </p>
      {payload[1] && (
        <p className="text-xs text-muted-foreground">
          ITC:{' '}
          <span className="font-tabular font-bold text-accent">
            ₹{payload[1].value.toLocaleString('en-IN')}
          </span>
        </p>
      )}
    </div>
  );
}

export default function MonthlyChartInner() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barCategoryGap="30%">
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.5} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontFamily: 'var(--font-sans)' }}
          axisLine={false}
          tickLine={false}
          width={24}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,71,255,0.06)' }} />
        <Bar dataKey="count" fill="url(#barGrad)" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${entry.month}`}
              fill={index === data.length - 1 ? 'var(--primary)' : 'url(#barGrad)'}
              opacity={index === data.length - 1 ? 1 : 0.7}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}