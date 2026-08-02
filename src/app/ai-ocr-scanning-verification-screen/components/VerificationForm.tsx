'use client';
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CheckCircle,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import type { ExtractedInvoiceData } from './OcrVerificationClient';

interface LineItem {
  name: string;
  qty: string;
  rate: string;
  taxRate: string;
}

interface InvoiceFormData {
  vendorName: string;
  gstin: string;
  invoiceNo: string;
  invoiceDate: string;
  buyerGstin: string;
  placeOfSupply: string;
  items: LineItem[];
  cgst: string;
  sgst: string;
  igst: string;
  subtotal: string;
  grandTotal: string;
  notes: string;
}

const MOCK_DEFAULTS: InvoiceFormData = {
  vendorName: 'Sharma Traders Pvt Ltd',
  gstin: '27AAPCS1234K1ZR',
  invoiceNo: 'ST/2026/3421',
  invoiceDate: '31/07/2026',
  buyerGstin: '29AABCK1234Q1ZV',
  placeOfSupply: 'Maharashtra',
  items: [
    { name: 'A4 Paper Ream', qty: '5', rate: '450', taxRate: '18' },
    { name: 'Printer Ink Cartridge', qty: '3', rate: '1200', taxRate: '18' },
    { name: 'Stapler Box (100pc)', qty: '2', rate: '180', taxRate: '12' },
  ],
  cgst: '558.90',
  sgst: '558.90',
  igst: '0',
  subtotal: '6210',
  grandTotal: '7327.80',
  notes: '',
};

function validateGstin(gstin: string): boolean {
  const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return re.test(gstin.toUpperCase());
}

function buildDefaults(extractedData: ExtractedInvoiceData | null): InvoiceFormData {
  if (!extractedData) return MOCK_DEFAULTS;

  const items: LineItem[] =
    extractedData.items && extractedData.items.length > 0
      ? extractedData.items.map((item) => ({
          name: item.name ?? '',
          qty: item.qty ?? '1',
          rate: item.rate ?? '0',
          taxRate: item.taxRate ?? '18',
        }))
      : MOCK_DEFAULTS.items;

  return {
    vendorName: extractedData.vendorName || MOCK_DEFAULTS.vendorName,
    gstin: extractedData.gstin || MOCK_DEFAULTS.gstin,
    invoiceNo: extractedData.invoiceNo || MOCK_DEFAULTS.invoiceNo,
    invoiceDate: extractedData.invoiceDate || MOCK_DEFAULTS.invoiceDate,
    buyerGstin: extractedData.buyerGstin || '',
    placeOfSupply: extractedData.placeOfSupply || '',
    items,
    cgst: extractedData.cgst || '0',
    sgst: extractedData.sgst || '0',
    igst: extractedData.igst || '0',
    subtotal: extractedData.subtotal || '0',
    grandTotal: extractedData.grandTotal || '0',
    notes: extractedData.notes || '',
  };
}

interface VerificationFormProps {
  extractedData?: ExtractedInvoiceData | null;
}

export default function VerificationForm({ extractedData }: VerificationFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const defaults = buildDefaults(extractedData ?? null);

  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<InvoiceFormData>({
    defaultValues: defaults,
  });

  // When extractedData arrives (async), reset the form with real data
  useEffect(() => {
    if (extractedData) {
      reset(buildDefaults(extractedData));
      toast.success('AI extracted invoice data — please verify before saving.');
    }
  }, [extractedData, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const watchedItems = watch('items');
  const watchedGrandTotal = watch('grandTotal');
  const watchedSubtotal = watch('subtotal');
  const watchedCgst = watch('cgst');
  const watchedSgst = watch('sgst');
  const watchedIgst = watch('igst');
  const watchedGstin = watch('gstin');

  // Real-time total validation
  const computedSubtotal = watchedItems.reduce((acc, item) => {
    return acc + parseFloat(item.qty || '0') * parseFloat(item.rate || '0');
  }, 0);

  const computedTax = watchedItems.reduce((acc, item) => {
    const lineTotal = parseFloat(item.qty || '0') * parseFloat(item.rate || '0');
    return acc + (lineTotal * parseFloat(item.taxRate || '0')) / 100;
  }, 0);

  const computedGrandTotal = computedSubtotal + computedTax;

  const subtotalMismatch =
    Math.abs(computedSubtotal - parseFloat(watchedSubtotal || '0')) > 1;
  const totalMismatch =
    Math.abs(computedGrandTotal - parseFloat(watchedGrandTotal || '0')) > 1;
  const gstinValid = watchedGstin ? validateGstin(watchedGstin) : true;

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSaving(true);
    // BACKEND: POST to /api/invoices with verified data
    await new Promise((r) => setTimeout(r, 1400));
    setIsSaving(false);
    setSavedSuccess(true);
    toast.success('Invoice verified and saved!');
    setTimeout(() => router.push('/dashboard-bulk-export'), 1200);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <h2 className="text-base font-bold text-foreground">Verify Extraction</h2>
        <div className="w-16" />
      </div>

      {/* AI extraction badge */}
      {extractedData && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-success/10 border border-success/30">
          <CheckCircle size={14} className="text-success flex-shrink-0" />
          <span className="text-xs text-success font-medium">
            AI extracted data from your invoice — review and edit before saving
          </span>
        </div>
      )}

      {/* Mismatch alerts */}
      {(subtotalMismatch || totalMismatch || !gstinValid) && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 p-3 space-y-1.5">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-danger flex-shrink-0" />
            <span className="text-xs font-bold text-danger">Verification Issues</span>
          </div>
          {!gstinValid && (
            <p className="text-xs text-danger/90 pl-5">
              • GSTIN format is invalid — must be 15 characters (e.g. 27AAPCS1234K1ZR)
            </p>
          )}
          {subtotalMismatch && (
            <p className="text-xs text-danger/90 pl-5">
              • Subtotal mismatch: extracted ₹{watchedSubtotal} vs computed ₹{computedSubtotal.toFixed(2)}
            </p>
          )}
          {totalMismatch && (
            <p className="text-xs text-danger/90 pl-5">
              • Grand total mismatch: extracted ₹{watchedGrandTotal} vs computed ₹{computedGrandTotal.toFixed(2)}
            </p>
          )}
        </div>
      )}

      {/* Vendor Details */}
      <div className="card-elevated rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Vendor Details
        </h3>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            Vendor / Shop Name <span className="text-danger">*</span>
          </label>
          <input
            {...register('vendorName', { required: 'Vendor name is required' })}
            className={`input-field ${errors.vendorName ? 'error' : ''}`}
            placeholder="e.g. Sharma Traders Pvt Ltd"
          />
          {errors.vendorName && (
            <p className="text-xs text-danger mt-1">{errors.vendorName.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            Vendor GSTIN (15-digit) <span className="text-danger">*</span>
          </label>
          <p className="text-2xs text-muted-foreground mb-1">
            Format: 2-digit state + 10-digit PAN + 3-digit entity code
          </p>
          <div className="relative">
            <input
              {...register('gstin', {
                required: 'GSTIN is required',
                validate: (v) => validateGstin(v) || 'Invalid GSTIN format',
              })}
              className={`input-field pr-8 font-mono uppercase ${
                errors.gstin || !gstinValid ? 'error' : ''
              }`}
              placeholder="e.g. 27AAPCS1234K1ZR"
              maxLength={15}
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
              {gstinValid && watchedGstin ? (
                <CheckCircle size={14} className="text-success" />
              ) : (
                <AlertTriangle size={14} className="text-warning" />
              )}
            </div>
          </div>
          {errors.gstin && (
            <p className="text-xs text-danger mt-1">{errors.gstin.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Invoice Number <span className="text-danger">*</span>
            </label>
            <input
              {...register('invoiceNo', { required: 'Required' })}
              className={`input-field ${errors.invoiceNo ? 'error' : ''}`}
              placeholder="INV-001"
            />
            {errors.invoiceNo && (
              <p className="text-xs text-danger mt-1">{errors.invoiceNo.message}</p>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">
              Invoice Date <span className="text-danger">*</span>
            </label>
            <input
              {...register('invoiceDate', { required: 'Required' })}
              className={`input-field ${errors.invoiceDate ? 'error' : ''}`}
              placeholder="DD/MM/YYYY"
            />
            {errors.invoiceDate && (
              <p className="text-xs text-danger mt-1">{errors.invoiceDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            Buyer GSTIN
          </label>
          <input
            {...register('buyerGstin')}
            className="input-field font-mono uppercase"
            placeholder="Your GSTIN"
            maxLength={15}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            Place of Supply
          </label>
          <input
            {...register('placeOfSupply')}
            className="input-field"
            placeholder="e.g. Maharashtra"
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="card-elevated rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Line Items
          </h3>
          <button
            type="button"
            onClick={() => append({ name: '', qty: '1', rate: '', taxRate: '18' })}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <Plus size={14} />
            Add Item
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="p-3 rounded-xl bg-muted/30 border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xs font-semibold text-muted-foreground">
                  Item #{index + 1}
                </span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-danger/20 transition-colors"
                  >
                    <Trash2 size={12} className="text-danger" />
                  </button>
                )}
              </div>

              <div>
                <label className="text-2xs font-semibold text-muted-foreground block mb-1">
                  Item Name
                </label>
                <input
                  {...register(`items.${index}.name`, { required: 'Required' })}
                  className="input-field text-sm"
                  placeholder="Item description"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-2xs font-semibold text-muted-foreground block mb-1">
                    Qty
                  </label>
                  <input
                    {...register(`items.${index}.qty`, { required: 'Required' })}
                    type="number"
                    min="0"
                    className="input-field text-sm font-tabular"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-2xs font-semibold text-muted-foreground block mb-1">
                    Rate (₹)
                  </label>
                  <input
                    {...register(`items.${index}.rate`, { required: 'Required' })}
                    type="number"
                    min="0"
                    className="input-field text-sm font-tabular"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-2xs font-semibold text-muted-foreground block mb-1">
                    GST %
                  </label>
                  <select
                    {...register(`items.${index}.taxRate`)}
                    className="input-field text-sm"
                  >
                    {['0', '5', '12', '18', '28'].map((r) => (
                      <option key={`rate-${r}`} value={r}>
                        {r}%
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <span className="text-xs font-bold font-tabular text-foreground">
                  ₹
                  {(
                    parseFloat(watchedItems[index]?.qty || '0') *
                    parseFloat(watchedItems[index]?.rate || '0')
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Computed summary */}
        <div className="mt-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Computed Subtotal</span>
            <span className="font-tabular font-semibold text-foreground">
              ₹{computedSubtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Computed Tax</span>
            <span className="font-tabular font-semibold text-foreground">
              ₹{computedTax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-primary/20 pt-1">
            <span className="font-bold text-foreground">Computed Grand Total</span>
            <span className="font-tabular font-bold text-primary">
              ₹{computedGrandTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className="card-elevated rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Tax Breakdown
          </h3>
          <div className="group relative">
            <Info size={12} className="text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-lg bg-secondary border border-border text-2xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              CGST+SGST for intra-state. IGST for inter-state supplies.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-2xs font-semibold text-foreground block mb-1">
              CGST (₹)
            </label>
            <input
              {...register('cgst')}
              type="number"
              min="0"
              step="0.01"
              className="input-field text-sm font-tabular"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-2xs font-semibold text-foreground block mb-1">
              SGST (₹)
            </label>
            <input
              {...register('sgst')}
              type="number"
              min="0"
              step="0.01"
              className="input-field text-sm font-tabular"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-2xs font-semibold text-foreground block mb-1">
              IGST (₹)
            </label>
            <input
              {...register('igst')}
              type="number"
              min="0"
              step="0.01"
              className="input-field text-sm font-tabular"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-muted/30 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Subtotal (from invoice)</span>
            <span
              className={`font-tabular font-semibold ${
                subtotalMismatch ? 'text-danger' : 'text-foreground'
              }`}
            >
              ₹{parseFloat(watchedSubtotal || '0').toFixed(2)}
              {subtotalMismatch && ' ⚠'}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              Total Tax (CGST+SGST+IGST)
            </span>
            <span className="font-tabular font-semibold text-foreground">
              ₹
              {(
                parseFloat(watchedCgst || '0') +
                parseFloat(watchedSgst || '0') +
                parseFloat(watchedIgst || '0')
              ).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm border-t border-border pt-1.5">
            <span className="font-bold text-foreground">Grand Total</span>
            <span
              className={`font-tabular font-extrabold ${
                totalMismatch ? 'text-danger' : 'text-accent'
              }`}
            >
              ₹{parseFloat(watchedGrandTotal || '0').toFixed(2)}
              {totalMismatch && ' ⚠'}
            </span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            Grand Total (₹) — from invoice
          </label>
          <input
            {...register('grandTotal', { required: 'Grand total is required' })}
            type="number"
            min="0"
            step="0.01"
            className={`input-field font-tabular ${
              totalMismatch ? 'error' : ''
            }`}
            placeholder="0.00"
          />
          {errors.grandTotal && (
            <p className="text-xs text-danger mt-1">{errors.grandTotal.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="card-elevated rounded-xl p-4">
        <label className="text-xs font-semibold text-foreground block mb-1">
          Notes (optional)
        </label>
        <p className="text-2xs text-muted-foreground mb-2">
          Add any remarks, PO references, or corrections for this invoice
        </p>
        <textarea
          {...register('notes')}
          rows={3}
          className="input-field resize-none"
          placeholder="e.g. PO#4521, partial payment received…"
        />
      </div>

      {/* Unsaved changes indicator */}
      {isDirty && !savedSuccess && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/30">
          <AlertTriangle size={12} className="text-warning" />
          <span className="text-xs text-warning font-medium">
            You have unsaved changes
          </span>
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-3 pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-ghost flex-1 py-3 text-sm"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={isSaving || savedSuccess}
          className="btn-primary flex-[2] py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ minWidth: '140px' }}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Saving…
            </>
          ) : savedSuccess ? (
            <>
              <CheckCircle size={16} />
              Saved!
            </>
          ) : (
            <>
              <Save size={16} />
              Approve &amp; Save
            </>
          )}
        </button>
      </div>
    </form>
  );
}