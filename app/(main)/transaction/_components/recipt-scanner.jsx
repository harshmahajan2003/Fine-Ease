"use client";

import { useRef, useEffect, useState } from "react";
import { Camera, Loader2, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setScanSuccess(false);

    await scanReceiptFn(file);
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setScanSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      setScanSuccess(true);
      toast.success("Receipt scanned successfully!");
    }
  }, [scanReceiptLoading, scannedData]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />

      {/* Image Preview */}
      {previewUrl && (
        <div className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50">
          <div className="relative w-full h-48">
            <img
              src={previewUrl}
              alt="Receipt preview"
              className="w-full h-full object-contain"
            />
            {/* Scanning overlay */}
            {scanReceiptLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm font-medium">Analyzing receipt...</p>
                </div>
              </div>
            )}
            {/* Success overlay */}
            {scanSuccess && !scanReceiptLoading && (
              <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                <div className="bg-green-500 rounded-full p-2">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            )}
          </div>
          {/* Clear button */}
          <button
            type="button"
            onClick={clearPreview}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          {/* Status bar */}
          {scanSuccess && (
            <div className="bg-green-100 px-3 py-2 text-center">
              <p className="text-sm text-green-700 font-medium">
                ✓ Receipt data extracted successfully
              </p>
            </div>
          )}
        </div>
      )}

      {/* Scan Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>{previewUrl ? "Scan Another Receipt" : "Scan Receipt with AI"}</span>
          </>
        )}
      </Button>
    </div>
  );
}