'use client';
import React, { useState, useEffect } from 'react';
import { Cpu, FileText, Sparkles } from 'lucide-react';

const steps = [
  { id: 'step-detect', label: 'Detecting document boundaries…', pct: 20 },
  { id: 'step-ocr', label: 'Running OCR engine…', pct: 45 },
  { id: 'step-gstin', label: 'Validating GSTIN format…', pct: 65 },
  { id: 'step-tax', label: 'Calculating tax breakdown…', pct: 85 },
  { id: 'step-verify', label: 'Cross-checking totals…', pct: 100 },
];

export default function ScanningAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next < steps?.length) {
          setProgress(steps?.[next]?.pct);
          return next;
        }
        clearInterval(interval);
        return prev;
      });
    }, 600);
    setProgress(steps?.[0]?.pct);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-6 gap-8">
      {/* Document with scanning laser */}
      <div className="relative w-48 h-64 rounded-2xl border-2 border-primary/40 bg-card overflow-hidden shadow-glow-primary">
        {/* Document lines */}
        <div className="absolute inset-0 p-4 space-y-2.5">
          {[80, 60, 90, 50, 70, 40, 85, 55]?.map((w, i) => (
            <div
              key={`doc-line-${i + 1}`}
              className="h-2 rounded-full bg-border"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>

        {/* Scanning laser */}
        <div className="absolute inset-0 scanning-laser" />

        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br-sm" />

        {/* AI badge */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1 rounded-full bg-primary/20 border border-primary/40">
          <Sparkles size={10} className="text-primary" />
          <span className="text-2xs font-bold text-primary">AI Scanning</span>
        </div>
      </div>
      {/* Status */}
      <div className="w-full max-w-xs space-y-4">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Cpu size={18} className="text-primary animate-pulse" />
            <h2 className="text-base font-bold text-foreground">Processing Invoice</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            AI is extracting GST data — please wait
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full gradient-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">
              {steps?.[currentStep]?.label}
            </span>
            <span className="text-xs font-tabular font-bold text-primary">
              {progress}%
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {steps?.map((step, i) => (
            <div key={step?.id} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  i < currentStep
                    ? 'bg-success'
                    : i === currentStep
                    ? 'bg-primary animate-pulse-glow' :'bg-muted'
                }`}
              >
                {i < currentStep && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span
                className={`text-xs ${
                  i <= currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}
              >
                {step?.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 w-full max-w-xs">
        <FileText size={16} className="text-accent flex-shrink-0" />
        <p className="text-xs text-accent font-medium">
          Invoice data will be pre-filled for your review
        </p>
      </div>
    </div>
  );
}