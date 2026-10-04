import { useState, useCallback } from 'react';
import { Part } from '../types/inventory';
import { useToast } from '../context/ToastContext';

export function useBarcodeScanner(parts: Part[]) {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [matchedPart, setMatchedPart] = useState<Part | null>(null);

  const handleScan = useCallback(
    (barcode: string) => {
      setScannedResult(barcode);
      const found = parts.find(
        (p) =>
          p.barcode === barcode ||
          p.sku.toLowerCase() === barcode.toLowerCase() ||
          p.id === barcode
      );

      if (found) {
        setMatchedPart(found);
        addToast({
          title: 'Barcode Matched ✓',
          message: `Found: ${found.name} (${found.sku})`,
          type: 'success',
        });
      } else {
        setMatchedPart(null);
        addToast({
          title: 'Unrecognized Barcode',
          message: `No hardware item found for barcode ${barcode}`,
          type: 'warning',
        });
      }
    },
    [parts, addToast]
  );

  const reset = useCallback(() => {
    setScannedResult(null);
    setMatchedPart(null);
  }, []);

  return {
    isOpen,
    setIsOpen,
    scannedResult,
    matchedPart,
    handleScan,
    reset,
  };
}
