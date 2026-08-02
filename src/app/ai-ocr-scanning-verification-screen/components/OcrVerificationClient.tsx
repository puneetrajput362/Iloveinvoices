'use client';
import React, { useState, useEffect } from 'react';
import ScanningAnimation from './ScanningAnimation';
import DocumentPreview from './DocumentPreview';
import VerificationForm from './VerificationForm';
import { toast } from 'sonner';

export type OcrPhase = 'scanning' | 'verify' | 'error';

export interface ExtractedInvoiceData {
  vendorName?: string;
  gstin?: string;
  invoiceNo?: string;
  invoiceDate?: string;
  buyerGstin?: string;
  placeOfSupply?: string;
  items?: Array<{ name: string; qty: string; rate: string; taxRate: string }>;
  cgst?: string;
  sgst?: string;
  igst?: string;
  subtotal?: string;
  grandTotal?: string;
  notes?: string;
}

export default function OcrVerificationClient() {
  const [phase, setPhase] = useState<OcrPhase>('scanning');
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData | null>(null);
  const [previewDataUri, setPreviewDataUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function runExtraction() {
      // Read file from sessionStorage (set by ScannerHero on upload)
      const fileData = sessionStorage.getItem('invoiceFileData');
      const mimeType = sessionStorage.getItem('invoiceFileMime') ?? 'image/jpeg';

      if (fileData) {
        // Store preview URI for DocumentPreview
        if (!mimeType.includes('pdf')) {
          setPreviewDataUri(fileData);
        }

        try {
          const res = await fetch('/api/invoice-extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileData, mimeType }),
          });

          const json = await res.json();

          if (!cancelled) {
            if (res.ok && json.success && json.data) {
              setExtractedData(json.data as ExtractedInvoiceData);
              setPhase('verify');
            } else {
              toast.error(json.error ?? 'AI extraction failed. Using sample data.');
              setPhase('verify'); // Fall through to mock data in VerificationForm
            }
          }
        } catch (err) {
          if (!cancelled) {
            toast.error('Network error during AI extraction. Using sample data.');
            setPhase('verify');
          }
        }
      } else {
        // No file uploaded — fall back to mock data after animation
        const timer = setTimeout(() => {
          if (!cancelled) setPhase('verify');
        }, 3200);
        return () => clearTimeout(timer);
      }
    }

    runExtraction();

    return () => {
      cancelled = true;
    };
  }, []);

  if (phase === 'scanning') {
    return <ScanningAnimation />;
  }

  return (
    <div className="flex flex-col lg:flex-row lg:gap-6 px-4 pt-4 pb-6 max-w-screen-2xl mx-auto min-h-full">
      {/* Document Preview — left on desktop, top on mobile */}
      <div className="lg:w-[45%] lg:sticky lg:top-20 lg:self-start">
        <DocumentPreview previewDataUri={previewDataUri} />
      </div>

      {/* Verification Form — right on desktop, bottom on mobile */}
      <div className="lg:flex-1 mt-4 lg:mt-0">
        <VerificationForm extractedData={extractedData} />
      </div>
    </div>
  );
}