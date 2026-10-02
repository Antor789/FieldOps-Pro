import { useState, useCallback, useEffect } from 'react';
import { Technician, DutyStatus, LocationPoint } from '../types/fsm';
import { INITIAL_TECHNICIANS } from '../data/mockFsmData';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export function useTechnicians(tenantId: string) {
  const [technicians, setTechnicians] = useState<Technician[]>(INITIAL_TECHNICIANS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTechnicians = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/technicians?tenant_id=${tenantId}`, {
        headers: {
          'X-Tenant-ID': tenantId,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setTechnicians(data);
        }
      }
    } catch {
      // Local fallback
    } finally {
      setIsLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    fetchTechnicians();
  }, [fetchTechnicians]);

  // Update Technician Duty Status
  const setDutyStatus = useCallback(async (techId: string, status: DutyStatus) => {
    setTechnicians((prev) =>
      prev.map((t) => (t.id === techId ? { ...t, dutyStatus: status } : t))
    );

    try {
      await fetch(`${API_BASE_URL}/technicians/${techId}/duty-status`, {
        method: 'PATCH',
        headers: {
          'X-Tenant-ID': tenantId,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ duty_status: status }),
      });
    } catch {
      // Optimistic state preserved
    }
  }, [tenantId]);

  // Update Technician GPS Location
  const updateTechnicianLocation = useCallback((techId: string, location: LocationPoint, batteryLevel?: number) => {
    setTechnicians((prev) =>
      prev.map((t) =>
        t.id === techId
          ? {
              ...t,
              locationPoint: location,
              batteryLevel: batteryLevel !== undefined ? batteryLevel : t.batteryLevel,
              lastPingAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  return {
    technicians,
    isLoading,
    fetchTechnicians,
    setDutyStatus,
    updateTechnicianLocation,
  };
}
