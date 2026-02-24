import { useState, useEffect } from 'react';
import { Activity, Cpu, MemoryStick, HardDrive, XCircle, Thermometer, Wifi, Battery } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSystem } from '../../SystemContext';

export function SystemMonitor() {
  const { temperature, battery, networkSpeed, wifiEnabled } = useSystem();
  const [cpuUsage, setCpuUsage] = useState(12);
  const [memUsage, setMemUsage] = useState(28);
  const [processes, setProcesses] = useState([
    { id: 1, name: 'systemd', cpu: 0.1, mem: 12 },
    { id: 2, name: 'novashell', cpu: 4.2, mem: 45 },
    { id: 3, name: 'Xwayland', cpu: 1.5, mem: 80 },
    { id: 4, name: 'pulseaudio', cpu: 0.5, mem: 15 },
    { id: 5, name: 'networkd', cpu: 0.1, mem: 8 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(prev => Math.max(5, Math.min(100, prev + (Math.random() * 20 - 10))));
      setMemUsage(prev => Math.max(20, Math.min(90, prev + (Math.random() * 5 - 2))));
      
      setProcesses(prev => prev.map(p => ({
        ...p,
        cpu: Math.max(0, p.cpu + (Math.random() * 2 - 1))
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const killProcess = (id: number) => {
    setProcesses(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col bg-black text-white overflow-hidden">
      <div className="p-6 bg-zinc-900 border-b border-zinc-800 shadow-xl z-10">
        <h2 className="text-xl font-light mb-6 flex items-center gap-2">
          <Activity size={24} className="text-emerald-500" />
          System Monitor
        </h2>

        {/* At a glance grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <MiniCard icon={Thermometer} title="Temp" value={`${temperature.toFixed(1)}°C`} color="text-orange-500" />
          <MiniCard icon={Battery} title="Battery" value={`${battery}%`} color="text-emerald-500" />
          <MiniCard icon={Wifi} title="Network" value={wifiEnabled ? `${networkSpeed.down.toFixed(1)} MB/s` : 'Offline'} color="text-blue-500" />
          <MiniCard icon={HardDrive} title="Storage" value="30% Used" color="text-purple-500" />
        </div>

        <div className="space-y-4">
          <MonitorCard 
            icon={Cpu} 
            title="CPU Usage" 
            value={`${Math.round(cpuUsage)}%`} 
            color="bg-blue-500" 
            percent={cpuUsage} 
          />
          <MonitorCard 
            icon={MemoryStick} 
            title="Memory" 
            value={`${Math.round((memUsage / 100) * 512)} MB`} 
            color="bg-emerald-500" 
            percent={memUsage} 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">Running Processes</h3>
        <div className="space-y-2">
          <AnimatePresence>
            {processes.map(proc => (
              <motion.div 
                key={proc.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                className="bg-zinc-900 p-3 rounded-xl flex items-center justify-between group"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{proc.name}</div>
                  <div className="text-xs text-zinc-500 font-mono">PID: {proc.id + 1000}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-mono text-blue-400">{proc.cpu.toFixed(1)}%</div>
                    <div className="text-xs font-mono text-emerald-400">{proc.mem}MB</div>
                  </div>
                  <button 
                    onClick={() => killProcess(proc.id)}
                    className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ icon: Icon, title, value, color }: any) {
  return (
    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon size={14} className={color} />
        <span className="text-xs font-medium text-zinc-400">{title}</span>
      </div>
      <span className="text-sm font-mono">{value}</span>
    </div>
  );
}

function MonitorCard({ icon: Icon, title, value, color, percent }: any) {
  return (
    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-zinc-400" />
          <span className="text-sm font-medium text-zinc-300">{title}</span>
        </div>
        <span className="text-sm font-mono">{value}</span>
      </div>
      <div className="h-1.5 bg-zinc-800 w-full rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`} 
          animate={{ width: `${percent}%` }} 
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </div>
  );
}
