import { useState, useEffect } from 'react';
import { LockScreen } from './components/LockScreen';
import { HomeScreen } from './components/HomeScreen';
import { StatusBar } from './components/StatusBar';
import { NovaNav } from './components/NovaNav';
import { AppSwitcher } from './components/AppSwitcher';
import { FileManager } from './components/apps/FileManager';
import { TextEditor } from './components/apps/TextEditor';
import { TerminalApp } from './components/apps/TerminalApp';
import { SettingsApp } from './components/apps/SettingsApp';
import { SystemMonitor } from './components/apps/SystemMonitor';
import { MediaPlayer } from './components/apps/MediaPlayer';
import { CalculatorApp } from './components/apps/CalculatorApp';
import { CalendarApp } from './components/apps/CalendarApp';
import { AnimatePresence, motion } from 'motion/react';
import { Folder, FileText, Terminal, Settings, Activity, PlayCircle, Calculator, Calendar } from 'lucide-react';
import { AppDefinition } from './types';

export const APPS: AppDefinition[] = [
  { id: 'file-manager', name: 'Files', icon: Folder, color: 'bg-blue-600', size: 'medium' },
  { id: 'text-editor', name: 'Notes', icon: FileText, color: 'bg-yellow-600', size: 'medium', notifications: 2 },
  { id: 'terminal', name: 'Terminal', icon: Terminal, color: 'bg-zinc-800', size: 'wide' },
  { id: 'sys-monitor', name: 'Monitor', icon: Activity, color: 'bg-emerald-600', size: 'medium' },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'bg-slate-600', size: 'medium', notifications: 1 },
  { id: 'media-player', name: 'Media', icon: PlayCircle, color: 'bg-purple-600', size: 'wide' },
  { id: 'calculator', name: 'Calc', icon: Calculator, color: 'bg-teal-600', size: 'small' },
  { id: 'calendar', name: 'Calendar', icon: Calendar, color: 'bg-red-600', size: 'small' },
];

import { SystemProvider, useSystem } from './SystemContext';

function GlobalNotifications() {
  const { notifications, removeNotification } = useSystem();
  return (
    <div className="absolute top-2 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`pointer-events-auto w-full max-w-sm p-3 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              n.type === 'warning' ? 'bg-orange-500/20 border-orange-500/50 text-orange-100' :
              n.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100' :
              n.type === 'error' ? 'bg-red-500/20 border-red-500/50 text-red-100' :
              'bg-zinc-800/90 border-zinc-700 text-white'
            }`}
            onClick={() => removeNotification(n.id)}
          >
            <h4 className="font-semibold text-sm">{n.title}</h4>
            <p className="text-xs opacity-80 mt-0.5">{n.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function NovaOS() {
  const { activeApp, setActiveApp } = useSystem();
  const [isLocked, setIsLocked] = useState(true);
  const [runningApps, setRunningApps] = useState<string[]>([]);
  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleLaunchApp = (id: string) => {
    if (!runningApps.includes(id)) {
      setRunningApps([...runningApps, id]);
    }
    setActiveApp(id);
    setShowSwitcher(false);
  };

  const handleCloseApp = (id: string) => {
    setRunningApps(runningApps.filter(appId => appId !== id));
    if (activeApp === id) {
      setActiveApp(null);
    }
  };

  const handleHome = () => {
    setActiveApp(null);
    setShowSwitcher(false);
  };

  const handleBack = () => {
    if (showSwitcher) {
      setShowSwitcher(false);
    } else if (activeApp) {
      setActiveApp(null);
    }
  };

  const handleSwitcher = () => {
    setShowSwitcher(!showSwitcher);
  };

  const renderActiveApp = () => {
    switch (activeApp) {
      case 'file-manager': return <FileManager />;
      case 'text-editor': return <TextEditor />;
      case 'terminal': return <TerminalApp />;
      case 'settings': return <SettingsApp />;
      case 'sys-monitor': return <SystemMonitor />;
      case 'media-player': return <MediaPlayer />;
      case 'calculator': return <CalculatorApp />;
      case 'calendar': return <CalendarApp />;
      default: return <div className="flex-1 flex items-center justify-center text-white bg-black">App not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-0 sm:p-4 md:p-8 font-sans">
      {/* Adaptive Device Container */}
      <div className="relative w-full h-full sm:h-[800px] sm:max-w-[400px] sm:max-h-[90vh] bg-black sm:rounded-[2.5rem] overflow-hidden sm:shadow-2xl sm:border-[12px] border-zinc-900 flex flex-col sm:ring-1 sm:ring-white/10">
        
        <StatusBar />

        <div className="flex-1 relative overflow-hidden">
          <GlobalNotifications />
          <AnimatePresence mode="wait">
            {isLocked ? (
              <LockScreen key="lock" onUnlock={() => setIsLocked(false)} />
            ) : showSwitcher ? (
              <AppSwitcher 
                key="switcher" 
                runningApps={runningApps} 
                activeApp={activeApp}
                onSelectApp={handleLaunchApp} 
                onCloseApp={handleCloseApp} 
              />
            ) : activeApp ? (
              <motion.div 
                key={activeApp}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 bg-black flex flex-col pb-8"
              >
                {renderActiveApp()}
              </motion.div>
            ) : (
              <HomeScreen key="home" onLaunchApp={handleLaunchApp} />
            )}
          </AnimatePresence>
        </div>

        {!isLocked && (
          <NovaNav 
            onBack={handleBack} 
            onHome={handleHome} 
            onSwitcher={handleSwitcher} 
          />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SystemProvider>
      <NovaOS />
    </SystemProvider>
  );
}
