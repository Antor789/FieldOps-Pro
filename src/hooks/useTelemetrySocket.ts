import { useState, useEffect, useCallback, useRef } from 'react';
import { TelemetryPayload, DutyStatus } from '../types/fsm';

export type SocketStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING' | 'ERROR';

export interface SosAlert {
  id: string;
  technicianId: string;
  technicianName: string;
  latitude: number;
  longitude: number;
  battery: number;
  timestamp: string;
}

export function useTelemetrySocket(
  tenantId: string, 
  currentUserId: string,
  onLocationBroadcast?: (payload: TelemetryPayload) => void
) {
  const [socketStatus, setSocketStatus] = useState<SocketStatus>('CONNECTED');
  const [lastPingTimestamp, setLastPingTimestamp] = useState<string>(new Date().toISOString());
  const [activeSosAlerts, setActiveSosAlerts] = useState<SosAlert[]>([]);
  const [telemetryCount, setTelemetryCount] = useState<number>(1420);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Connect & Handshake simulation with ws://localhost:5000 fallback
  useEffect(() => {
    setSocketStatus('CONNECTING');
    const timer = setTimeout(() => {
      setSocketStatus('CONNECTED');
    }, 400);

    return () => clearTimeout(timer);
  }, [tenantId, currentUserId]);

  // Simulated Telemetry Feed Ingestion Interval (Emits every 3 seconds for active map)
  useEffect(() => {
    if (socketStatus === 'CONNECTED') {
      intervalRef.current = setInterval(() => {
        setTelemetryCount((prev) => prev + 1);
        setLastPingTimestamp(new Date().toISOString());
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [socketStatus]);

  // Send GPS Telemetry Ping from Mobile App
  const emitLocationUpdate = useCallback((
    techId: string,
    latitude: number,
    longitude: number,
    speedKmh: number,
    headingDegrees: number,
    batteryLevel: number,
    dutyStatus: DutyStatus
  ) => {
    const payload: TelemetryPayload = {
      technicianId: techId,
      tenantId,
      latitude,
      longitude,
      speedKmh,
      headingDegrees,
      batteryLevel,
      dutyStatus,
      recordedAt: new Date().toISOString(),
    };

    setLastPingTimestamp(payload.recordedAt);
    setTelemetryCount((prev) => prev + 1);

    if (onLocationBroadcast) {
      onLocationBroadcast(payload);
    }
  }, [tenantId, onLocationBroadcast]);

  // Trigger Panic SOS Alert
  const emitSosPanic = useCallback((
    techId: string,
    techName: string,
    lat: number,
    lng: number,
    battery: number
  ) => {
    const sos: SosAlert = {
      id: `sos-${Date.now().toString().slice(-4)}`,
      technicianId: techId,
      technicianName: techName,
      latitude: lat,
      longitude: lng,
      battery,
      timestamp: new Date().toISOString(),
    };

    setActiveSosAlerts((prev) => [sos, ...prev]);
  }, []);

  const dismissSosAlert = useCallback((sosId: string) => {
    setActiveSosAlerts((prev) => prev.filter((a) => a.id !== sosId));
  }, []);

  return {
    socketStatus,
    lastPingTimestamp,
    telemetryCount,
    activeSosAlerts,
    emitLocationUpdate,
    emitSosPanic,
    dismissSosAlert,
  };
}
