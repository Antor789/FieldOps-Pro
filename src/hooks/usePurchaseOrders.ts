import { useState, useCallback } from 'react';
import { PurchaseOrder, Supplier } from '../types/inventory';
import { INITIAL_PURCHASE_ORDERS, INITIAL_SUPPLIERS } from '../data/sampleInventoryData';

export function usePurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_PURCHASE_ORDERS);
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const createPurchaseOrder = useCallback(
    (newPO: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt' | 'updatedAt'>) => {
      const id = `po-${Date.now()}`;
      const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const fullPO: PurchaseOrder = {
        ...newPO,
        id,
        poNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setPurchaseOrders((prev) => [fullPO, ...prev]);
      return fullPO;
    },
    []
  );

  const updatePOStatus = useCallback((id: string, status: PurchaseOrder['status']) => {
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === id
          ? {
              ...po,
              status,
              updatedAt: new Date(),
              actualDelivery: status === 'received' ? new Date() : po.actualDelivery,
            }
          : po
      )
    );
  }, []);

  return {
    purchaseOrders,
    suppliers,
    selectedPO,
    setSelectedPO,
    createPurchaseOrder,
    updatePOStatus,
  };
}
