'use client';
import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from 'lucide-react';

export default function DocumentPreview({ previewDataUri }: { previewDataUri?: string | null }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const rotate = () => setRotation((r) => (r + 90) % 360);

  return (
    <div className="card-elevated rounded-2xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-muted/30">
        <span className="text-xs font-semibold text-muted-foreground">
          Document Preview
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
            aria-label="Zoom out"
          >
            <ZoomOut size={14} className="text-muted-foreground" />
          </button>
          <span className="text-xs font-tabular text-muted-foreground w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            disabled={zoom >= 3}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40"
            aria-label="Zoom in"
          >
            <ZoomIn size={14} className="text-muted-foreground" />
          </button>
          <button
            onClick={rotate}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors ml-1"
            aria-label="Rotate document"
          >
            <RotateCw size={14} className="text-muted-foreground" />
          </button>
          <button
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Fullscreen preview"
          >
            <Maximize2 size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div
        className="overflow-auto scrollbar-hide bg-muted/20"
        style={{ height: '340px', touchAction: 'pinch-zoom' }}
      >
        <div
          className="flex items-center justify-center min-h-full p-4"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease',
          }}
        >
          {previewDataUri ? (
            /* Uploaded image preview */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewDataUri}
              alt="Uploaded invoice document"
              className="max-w-full max-h-full rounded-lg shadow-lg object-contain"
              style={{ maxHeight: '300px' }}
            />
          ) : (
            /* Mock invoice document fallback */
            <div className="w-[260px] bg-white rounded-lg shadow-lg p-5 text-gray-800 text-left">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-base text-gray-900">SHARMA TRADERS</p>
                  <p className="text-xs text-gray-600">Pvt. Ltd.</p>
                  <p className="text-xs text-gray-500 mt-1">GSTIN: 27AAPCS1234K1ZR</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900">TAX INVOICE</p>
                  <p className="text-xs text-gray-600">No: ST/2026/3421</p>
                  <p className="text-xs text-gray-500">Date: 31/07/2026</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mb-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">Items</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left font-medium pb-1">Item</th>
                      <th className="text-right font-medium pb-1">Qty</th>
                      <th className="text-right font-medium pb-1">Rate</th>
                      <th className="text-right font-medium pb-1">Amt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-0.5">A4 Paper Ream</td>
                      <td className="text-right">5</td>
                      <td className="text-right">450</td>
                      <td className="text-right">2,250</td>
                    </tr>
                    <tr>
                      <td className="py-0.5">Printer Ink</td>
                      <td className="text-right">3</td>
                      <td className="text-right">1,200</td>
                      <td className="text-right">3,600</td>
                    </tr>
                    <tr>
                      <td className="py-0.5">Stapler Box</td>
                      <td className="text-right">2</td>
                      <td className="text-right">180</td>
                      <td className="text-right">360</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-200 pt-2 space-y-0.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹6,210</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST @9%</span>
                  <span>₹558.90</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SGST @9%</span>
                  <span>₹558.90</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t border-gray-200 pt-1 mt-1">
                  <span>Grand Total</span>
                  <span>₹7,327.80</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI confidence */}
      <div className="px-3 py-2.5 border-t border-border bg-muted/20 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">AI Confidence</span>
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-success rounded-full" style={{ width: '94%' }} />
          </div>
          <span className="text-xs font-bold font-tabular text-success">94%</span>
        </div>
      </div>
    </div>
  );
}