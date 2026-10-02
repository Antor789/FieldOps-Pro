import { useState, useCallback, useEffect } from 'react';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '../types/fsm';
import { INITIAL_WORK_ORDERS } from '../data/mockFsmData';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export function useWorkOrders(tenantId: string) {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch work orders from API endpoint with graceful fallback
  const fetchWorkOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/work-orders?tenant_id=${tenantId}`, {
        headers: {
          'X-Tenant-ID': tenantId,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setWorkOrders(data);
        }
      }
    } catch {
      // Backend offline or dev mode fallback - keep current mock state
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchWorkOrders();
  }, [fetchWorkOrders]);

  // Update Work Order Status State Machine
  const updateWorkOrderStatus = useCallback(async (
    workOrderId: string, 
    newStatus: WorkOrderStatus,
    updatedTechId?: string,
    updatedTechName?: string
  ) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === workOrderId) {
          return {
            ...wo,
            status: newStatus,
            assignedTechnicianId: updatedTechId !== undefined ? updatedTechId : wo.assignedTechnicianId,
            assignedTechnicianName: updatedTechName !== undefined ? updatedTechName : wo.assignedTechnicianName,
            updatedAt: new Date().toISOString(),
          };
        }
        return wo;
      })
    );

    // Sync with API
    try {
      await fetch(`${API_BASE_URL}/work-orders/${workOrderId}/status`, {
        method: 'PATCH',
        headers: {
          'X-Tenant-ID': tenantId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          assigned_technician_id: updatedTechId,
        }),
      });
    } catch {
      // Local optimistic update retained
    }
  }, [tenantId]);

  // Assign Technician to Work Order
  const assignTechnicianToWorkOrder = useCallback((
    workOrderId: string, 
    technicianId: string, 
    technicianName: string
  ) => {
    updateWorkOrderStatus(workOrderId, 'ASSIGNED', technicianId, technicianName);
  }, [updateWorkOrderStatus]);

  // Create New Work Order
  const createWorkOrder = useCallback(async (newWo: Omit<WorkOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created: WorkOrder = {
      ...newWo,
      id: `wo-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      trackingToken: `trk-wo-${Math.random().toString(36).substring(2, 9)}`,
    };

    setWorkOrders((prev) => [created, ...prev]);

    try {
      await fetch(`${API_BASE_URL}/work-orders`, {
        method: 'POST',
        headers: {
          'X-Tenant-ID': tenantId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(created),
      });
    } catch {
      // Local state fallback retained
    }
    return created;
  }, [tenantId]);

  return {
    workOrders,
    isLoading,
    error,
    fetchWorkOrders,
    updateWorkOrderStatus,
    assignTechnicianToWorkOrder,
    createWorkOrder,
  };
}
