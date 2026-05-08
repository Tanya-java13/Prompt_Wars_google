import { useState, useEffect, useRef } from 'react';
import type { Alert } from '../types/travel';

export function useAlertStream(active = true) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [connected, setConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!active) return;

    const es = new EventSource('/api/alerts/stream');
    esRef.current = es;

    es.onopen = () => setConnected(true);
    es.onmessage = (e) => {
      try {
        const alert = JSON.parse(e.data) as Alert;
        setAlerts((prev) => [alert, ...prev].slice(0, 10));
      } catch { /* ignore */ }
    };
    es.onerror = () => setConnected(false);

    return () => { es.close(); setConnected(false); };
  }, [active]);

  return { alerts, connected };
}
