import { useState, useEffect } from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

export function StatusBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-7 bg-black text-white px-3 flex items-center justify-between text-xs font-medium z-50">
      <span>NovaShell</span>
      <div className="flex items-center gap-2">
        <Signal size={12} />
        <Wifi size={12} />
        <div className="flex items-center gap-1">
          <span>100%</span>
          <Battery size={14} />
        </div>
        <span>
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
