import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type NotificationType = 'info' | 'warning' | 'success' | 'error';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
}

interface SystemContextType {
  wifiEnabled: boolean;
  setWifiEnabled: (val: boolean) => void;
  isDownloading: boolean;
  setIsDownloading: (val: boolean) => void;
  battery: number;
  isCharging: boolean;
  setIsCharging: (val: boolean) => void;
  temperature: number;
  networkSpeed: { up: number; down: number };
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type?: NotificationType) => void;
  removeNotification: (id: string) => void;
  
  // Security & Privacy States
  firewallEnabled: boolean;
  setFirewallEnabled: (val: boolean) => void;
  vpnEnabled: boolean;
  setVpnEnabled: (val: boolean) => void;
  locationEnabled: boolean;
  setLocationEnabled: (val: boolean) => void;
  cameraEnabled: boolean;
  setCameraEnabled: (val: boolean) => void;
  micEnabled: boolean;
  setMicEnabled: (val: boolean) => void;
  blockedTrackers: number;

  // App Context
  activeApp: string | null;
  setActiveApp: (appId: string | null) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [battery, setBattery] = useState(84);
  const [isCharging, setIsCharging] = useState(false);
  const [temperature, setTemperature] = useState(38);
  const [networkSpeed, setNetworkSpeed] = useState({ up: 1.2, down: 4.5 });
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Security States
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [vpnEnabled, setVpnEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [blockedTrackers, setBlockedTrackers] = useState(128);

  // App Context
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const shownTips = useRef<Set<string>>(new Set());

  // Hardware Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Network Simulation
      if (wifiEnabled) {
        setNetworkSpeed(prev => ({
          up: Math.max(0.1, prev.up + (Math.random() * 2 - 1)),
          down: isDownloading ? Math.max(5, prev.down + (Math.random() * 10 - 2)) : Math.max(0.1, prev.down + (Math.random() * 2 - 1))
        }));
      } else {
        setNetworkSpeed({ up: 0, down: 0 });
        if (isDownloading) {
          setIsDownloading(false);
          addNotification('Network', 'Wi-Fi disconnected. Download paused.', 'warning');
        }
      }

      // Temperature Simulation
      const baseTemp = isDownloading ? 45 : 35;
      setTemperature(prev => {
        const target = baseTemp + (activeApp ? 5 : 0);
        return prev + (target - prev) * 0.1 + (Math.random() * 2 - 1);
      });
      
      // Security Simulation
      if (wifiEnabled && firewallEnabled) {
        setBlockedTrackers(prev => prev + Math.floor(Math.random() * 3));
      }

      // Battery Simulation
      setBattery(prev => {
        if (isCharging) return Math.min(100, prev + 0.5);
        const drain = (isDownloading ? 0.2 : 0.05) + (activeApp ? 0.1 : 0);
        const newBattery = Math.max(0, prev - drain);
        if (prev > 20 && newBattery <= 20) {
          addNotification('Battery Low', 'Battery is at 20%. Consider plugging in.', 'warning');
        }
        return newBattery;
      });

    }, 2000);
    return () => clearInterval(interval);
  }, [wifiEnabled, isDownloading, firewallEnabled, activeApp, isCharging]);

  // Contextual Tips
  useEffect(() => {
    if (!activeApp) return;

    const tipKey = `tip_${activeApp}`;
    if (shownTips.current.has(tipKey)) return;

    const timer = setTimeout(() => {
      let tip = '';
      switch (activeApp) {
        case 'file-manager': tip = 'Swipe left on any file to reveal quick actions like delete.'; break;
        case 'text-editor': tip = 'Start typing to enter distraction-free Zen Mode.'; break;
        case 'terminal': tip = 'Try typing "matrix" or "help" for a list of commands.'; break;
        case 'sys-monitor': tip = 'Hover over a process to reveal the kill switch.'; break;
        case 'settings': tip = 'Check the Privacy dashboard to see blocked trackers.'; break;
        case 'media-player': tip = 'The visualizer reacts to the current playback state.'; break;
      }
      
      if (tip) {
        addNotification('Pro Tip', tip, 'info');
        shownTips.current.add(tipKey);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeApp]);

  const addNotification = (title: string, message: string, type: NotificationType = 'info') => {
    setNotifications(prev => {
      if (prev.some(n => n.title === title && n.message === message)) {
        return prev;
      }
      const id = Math.random().toString(36).substr(2, 9);
      setTimeout(() => removeNotification(id), type === 'warning' || type === 'error' ? 8000 : 5000);
      return [...prev, { id, title, message, type }];
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <SystemContext.Provider value={{
      wifiEnabled, setWifiEnabled,
      isDownloading, setIsDownloading,
      battery, isCharging, setIsCharging,
      temperature, networkSpeed,
      notifications, addNotification, removeNotification,
      firewallEnabled, setFirewallEnabled,
      vpnEnabled, setVpnEnabled,
      locationEnabled, setLocationEnabled,
      cameraEnabled, setCameraEnabled,
      micEnabled, setMicEnabled,
      blockedTrackers,
      activeApp, setActiveApp
    }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within SystemProvider');
  return context;
}
