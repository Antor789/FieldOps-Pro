import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { socketService, EventListener } from '../services/socketService';
import { RealtimeEventType } from '../types/realtime';

export function useSocket() {
  const context = useSocketContext();

  return context;
}

export function useSocketEvent<T = any>(
  event: RealtimeEventType | string,
  handler: EventListener<T>,
  deps: any[] = []
) {
  useEffect(() => {
    const unsub = socketService.on<T>(event, handler);
    return () => {
      unsub();
    };
  }, [event, ...deps]);
}
