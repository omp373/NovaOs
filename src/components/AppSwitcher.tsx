import { motion, AnimatePresence } from 'motion/react';
import { APPS } from '../App';
import { X } from 'lucide-react';

interface AppSwitcherProps {
  key?: string;
  runningApps: string[];
  activeApp: string | null;
  onSelectApp: (id: string) => void;
  onCloseApp: (id: string) => void;
}

export function AppSwitcher({ runningApps, activeApp, onSelectApp, onCloseApp }: AppSwitcherProps) {
  if (runningApps.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center"
      >
        <p className="text-zinc-500">No running apps</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/90 backdrop-blur-md overflow-y-auto p-6 flex flex-col gap-4"
    >
      <h2 className="text-white text-xl font-light mb-4">Running Apps</h2>
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {runningApps.map(appId => {
            const app = APPS.find(a => a.id === appId);
            if (!app) return null;
            
            return (
              <motion.div 
                key={appId}
                layout
                initial={{ x: -20, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 100, opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={(e, { offset, velocity }) => {
                  if (offset.x > 100 || velocity.x > 500) {
                    onCloseApp(appId);
                  }
                }}
                className={`relative bg-zinc-900 border ${activeApp === appId ? 'border-white' : 'border-zinc-800'} p-4 flex items-center gap-4 cursor-pointer hover:bg-zinc-800/80 transition-colors`}
                onClick={() => onSelectApp(appId)}
              >
                <div className={`w-12 h-12 ${app.color} flex items-center justify-center shadow-lg`}>
                  <app.icon className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{app.name}</h3>
                  <p className="text-zinc-500 text-xs">{activeApp === appId ? 'Active' : 'Background'}</p>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onCloseApp(appId); }}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-red-500/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
