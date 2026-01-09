import { useState, useEffect, useRef } from 'react';
import { SiGoogle, SiMeta } from 'react-icons/si';

interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  statusCode: number;
  platform: 'google' | 'meta';
  type: 'success' | 'warning' | 'error';
}

const initialLogs: LogEntry[] = [
  { id: 1, timestamp: '14:32:01', message: 'SKU-9921 updated on Meta', statusCode: 200, platform: 'meta', type: 'success' },
  { id: 2, timestamp: '14:31:58', message: 'Batch #992 completed', statusCode: 200, platform: 'google', type: 'success' },
  { id: 3, timestamp: '14:31:45', message: 'Price sync for IST-001', statusCode: 200, platform: 'google', type: 'success' },
  { id: 4, timestamp: '14:31:32', message: 'SKU-4421 inventory update', statusCode: 200, platform: 'meta', type: 'success' },
  { id: 5, timestamp: '14:31:20', message: 'Rate limit warning', statusCode: 429, platform: 'google', type: 'warning' },
  { id: 6, timestamp: '14:31:12', message: 'SKU-1122 availability sync', statusCode: 200, platform: 'meta', type: 'success' },
  { id: 7, timestamp: '14:30:58', message: 'Store ANK-002 data refresh', statusCode: 200, platform: 'google', type: 'success' },
  { id: 8, timestamp: '14:30:45', message: 'Batch #991 started', statusCode: 200, platform: 'meta', type: 'success' },
];

const simulatedMessages = [
  { message: 'SKU-{sku} updated', platform: 'meta' as const, statusCode: 200, type: 'success' as const },
  { message: 'Inventory sync for {store}', platform: 'google' as const, statusCode: 200, type: 'success' as const },
  { message: 'Price update confirmed', platform: 'meta' as const, statusCode: 200, type: 'success' as const },
  { message: 'Batch #{batch} processed', platform: 'google' as const, statusCode: 200, type: 'success' as const },
  { message: 'Rate limit approaching', platform: 'google' as const, statusCode: 429, type: 'warning' as const },
  { message: 'Availability sync complete', platform: 'meta' as const, statusCode: 200, type: 'success' as const },
];

const stores = ['IST-001', 'IST-002', 'ANK-001', 'IZM-001', 'BUR-001'];

export default function LiveActivitySidebar() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const nextIdRef = useRef(initialLogs.length + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const template = simulatedMessages[Math.floor(Math.random() * simulatedMessages.length)];
      let message = template.message
        .replace('{sku}', String(1000 + Math.floor(Math.random() * 9000)))
        .replace('{store}', stores[Math.floor(Math.random() * stores.length)])
        .replace('{batch}', String(990 + Math.floor(Math.random() * 20)));

      const newLog: LogEntry = {
        id: nextIdRef.current,
        timestamp,
        message,
        statusCode: template.statusCode,
        platform: template.platform,
        type: template.type,
      };

      nextIdRef.current += 1;
      setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (type: 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
    }
  };

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-50"></div>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">Live Stream</h3>
      </div>

      {/* Log Entries */}
      <div className="flex-1 overflow-y-auto">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className="px-3 py-2 border-b border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-gray-400">{log.timestamp}</span>
              {log.platform === 'google' ? (
                <SiGoogle className="w-3 h-3 text-gray-400" />
              ) : (
                <SiMeta className="w-3 h-3 text-gray-400" />
              )}
              <span className={`text-xs font-mono ${getStatusColor(log.type)}`}>
                [{log.statusCode}]
              </span>
            </div>
            <p className={`text-xs font-mono ${getStatusColor(log.type)}`}>
              {log.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
