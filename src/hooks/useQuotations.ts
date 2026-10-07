import { useState, useEffect, useMemo, useCallback } from 'react';
import { Quotation, QuotationStats } from '../types/quotations';
import {
  INITIAL_QUOTATIONS,
  calculateQuotationStats,
} from '../data/mockQuotationData';

const STORAGE_KEY = 'fieldops_quotations_v1';

export function useQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_QUOTATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
    } catch {
      // ignore
    }
  }, [quotations]);

  const quotationStats = useMemo<QuotationStats>(() => {
    return calculateQuotationStats(quotations);
  }, [quotations]);

  const createQuotation = useCallback(async (data: Partial<Quotation>): Promise<Quotation> => {
    const newQuote: Quotation = {
      id: `qt-${Date.now()}`,
      quotationNumber: data.quotationNumber || `QT-2025-${String(quotations.length + 1).padStart(3, '0')}`,
      status: data.status || 'draft',
      customerId: data.customerId || 'cust-generic',
      customerName: data.customerName || 'Standard Client',
      customerNameBn: data.customerNameBn,
      customerEmail: data.customerEmail || 'client@example.com',
      customerPhone: data.customerPhone || '+880 1700-000000',
      customerAddress: data.customerAddress || 'Dhaka, Bangladesh',
      customerBin: data.customerBin || '002938102-0101',
      date: data.date || new Date().toISOString().slice(0, 10),
      validUntil: data.validUntil || new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      sections: data.sections || [],
      subtotal: data.subtotal || 0,
      discountType: data.discountType || 'percentage',
      discountValue: data.discountValue || 0,
      discountAmount: data.discountAmount || 0,
      includeVat: data.includeVat ?? true,
      vatRate: data.vatRate || 0.15,
      vatAmount: data.vatAmount || 0,
      total: data.total || 0,
      notes: data.notes,
      terms: data.terms,
      createdBy: data.createdBy || 'Operations Engineer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: data.comments || [],
    };

    setQuotations((prev) => [newQuote, ...prev]);
    return newQuote;
  }, [quotations.length]);

  const updateQuotation = useCallback(async (id: string, data: Partial<Quotation>): Promise<Quotation> => {
    let updatedItem: Quotation | null = null;
    setQuotations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          updatedItem = {
            ...item,
            ...data,
            updatedAt: new Date().toISOString(),
          };
          return updatedItem;
        }
        return item;
      })
    );
    if (!updatedItem) throw new Error('Quotation not found');
    return updatedItem;
  }, []);

  const sendQuotation = useCallback(async (id: string): Promise<void> => {
    setQuotations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === 'draft' ? 'sent' : item.status,
            sentAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  }, []);

  const markApproved = useCallback(async (id: string): Promise<void> => {
    setQuotations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'approved',
            approvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  }, []);

  const markRejected = useCallback(async (id: string, reason?: string): Promise<void> => {
    setQuotations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'rejected',
            rejectedAt: new Date().toISOString(),
            rejectionReason: reason || 'Customer requested renegotiation or cancelled.',
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  }, []);

  const convertToWorkOrder = useCallback(
    async (id: string, assignedTechnicianId?: string, scheduledDate?: string): Promise<string> => {
      const generatedWoId = `WO-2025-${Math.floor(1000 + Math.random() * 9000)}`;

      setQuotations((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              status: 'converted',
              convertedToWorkOrderId: generatedWoId,
              convertedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }
          return item;
        })
      );

      return generatedWoId;
    },
    []
  );

  const duplicateQuotation = useCallback(async (id: string): Promise<Quotation> => {
    const existing = quotations.find((q) => q.id === id);
    if (!existing) throw new Error('Quotation not found');

    const copy: Quotation = {
      ...existing,
      id: `qt-${Date.now()}`,
      quotationNumber: `${existing.quotationNumber}-COPY`,
      status: 'draft',
      date: new Date().toISOString().slice(0, 10),
      validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      sentAt: undefined,
      viewedAt: undefined,
      approvedAt: undefined,
      rejectedAt: undefined,
      rejectionReason: undefined,
      convertedToWorkOrderId: undefined,
      convertedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setQuotations((prev) => [copy, ...prev]);
    return copy;
  }, [quotations]);

  const deleteQuotation = useCallback(async (id: string): Promise<void> => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
  }, []);

  return {
    quotations,
    quotationStats,
    createQuotation,
    updateQuotation,
    sendQuotation,
    markApproved,
    markRejected,
    convertToWorkOrder,
    duplicateQuotation,
    deleteQuotation,
  };
}
