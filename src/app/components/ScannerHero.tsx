'use client';
import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Upload, FileText, Image, X, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

type UploadState = 'idle' | 'dragging' | 'compressing' | 'uploading' | 'done' | 'error';

export default function ScannerHero() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return;
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast.error('Only JPG, PNG, and PDF files are supported.');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast.error('File size must be under 20MB.');
        return;
      }

      setSelectedFile(file);
      setUploadState('compressing');
      setProgress(0);

      // Read file as base64 data URI
      const fileDataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      if (file.type !== 'application/pdf') {
        setPreviewUrl(fileDataUri);
      } else {
        setPreviewUrl(null);
      }

      // Simulate client-side compression feedback
      await new Promise<void>((resolve) => {
        let p = 0;
        const interval = setInterval(() => {
          p += 20;
          setProgress(p);
          if (p >= 60) {
            clearInterval(interval);
            resolve();
          }
        }, 120);
      });

      setUploadState('uploading');

      // Store file data in sessionStorage for OCR screen
      try {
        sessionStorage.setItem('invoiceFileData', fileDataUri);
        sessionStorage.setItem('invoiceFileMime', file.type);
        sessionStorage.setItem('invoiceFileName', file.name);
      } catch {
        // sessionStorage quota exceeded — proceed without caching
      }

      // Simulate upload progress
      await new Promise<void>((resolve) => {
        let p = 60;
        const interval = setInterval(() => {
          p += 10;
          setProgress(p);
          if (p >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });

      setUploadState('done');
      toast.success('Invoice uploaded! Starting AI scan…');

      setTimeout(() => {
        router.push('/ai-ocr-scanning-verification-screen');
      }, 800);
    },
    [router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setUploadState('idle');
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setUploadState('dragging');
  };

  const handleDragLeave = () => {
    setUploadState('idle');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  };

  const resetUpload = () => {
    setUploadState('idle');
    setSelectedFile(null);
    setPreviewUrl(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isProcessing = uploadState === 'compressing' || uploadState === 'uploading';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-foreground">Scan Invoice</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            JPG, PNG or PDF — AI extracts GST data instantly
          </p>
        </div>
        <button
          onClick={handleCameraCapture}
          disabled={isProcessing}
          className="btn-accent px-4 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Camera size={16} />
          <span>Camera</span>
        </button>
      </div>

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && !selectedFile && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer
          ${uploadState === 'dragging' ? 'upload-zone-active border-primary' : 'border-border hover:border-primary/50'}
          ${selectedFile ? 'cursor-default' : ''}
          ${isProcessing ? 'cursor-wait' : ''}
        `}
        style={{ minHeight: '220px' }}
      >
        {/* Drag glow overlay */}
        {uploadState === 'dragging' && (
          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        )}

        {!selectedFile && (
          <div className="flex flex-col items-center justify-center h-full p-8 gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center glow-primary animate-bounce-subtle">
              <Upload size={28} className="text-white" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-foreground">
                Drop invoice here
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or tap to browse files
              </p>
            </div>
            <div className="flex items-center gap-2">
              {['JPG', 'PNG', 'PDF'].map((ext) => (
                <span
                  key={`ext-${ext}`}
                  className="text-2xs font-semibold px-2 py-1 rounded-md bg-muted text-muted-foreground"
                >
                  {ext}
                </span>
              ))}
            </div>
            <p className="text-2xs text-muted-foreground">
              Single or bulk upload — max 20MB
            </p>
          </div>
        )}

        {selectedFile && (
          <div className="p-4">
            <div className="flex items-start gap-3">
              {previewUrl ? (
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Invoice preview thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                    }}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <FileText size={28} className="text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {(selectedFile.size / 1024).toFixed(0)} KB
                </p>

                {isProcessing && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary font-medium">
                        {uploadState === 'compressing' ?'⚡ Compressing...' :'☁️ Uploading...'}
                      </span>
                      <span className="text-xs font-tabular text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full gradient-primary rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadState === 'done' && (
                  <div className="mt-2 flex items-center gap-1.5 text-success">
                    <CheckCircle size={14} />
                    <span className="text-xs font-semibold">Ready — redirecting…</span>
                  </div>
                )}
              </div>

              {!isProcessing && uploadState !== 'done' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetUpload();
                  }}
                  className="w-7 h-7 rounded-full bg-muted flex items-center justify-center hover:bg-danger/20 transition-colors flex-shrink-0"
                >
                  <X size={14} className="text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={32} className="text-primary animate-spin" />
              <p className="text-xs font-semibold text-primary">
                {uploadState === 'compressing' ? 'Compressing image...' : 'Uploading...'}
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Bulk Upload hint */}
      <div className="flex items-center gap-2 px-1">
        <Image size={14} className="text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Bulk upload: select multiple files at once for batch processing
        </p>
      </div>
    </div>
  );
}