import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (wifiEnabled) {
        setNetworkSpeed(prev => ({
          up: Math.max(0.1, prev.up + (Math.random() * 2 - 1)),
          down: isDownloading ? Math.max(5, prev.down + (Math.random() * 10 - 2)) : Math.max(0.1, prev.down + (Math.random() * 2 - 1))
        }));
      } else {
        setNetworkSpeed({ up: 0, down: 0 });
      }
      setTemperature(prev => Math.max(30, Math.min(90, prev + (Math.random() * 2 - 1))));
      
      if (wifiEnabled && firewallEnabled) {
        setBlockedTrackers(prev => prev + Math.floor(Math.random() * 3));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [wifiEnabled, isDownloading, firewallEnabled]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      addNotification('System Tip', 'Swipe down on the home screen to access Nova Command.', 'info');
    }, 8000);
    const timer2 = setTimeout(() => {
      addNotification('Privacy Active', 'NovaOS is blocking background tracking attempts.', 'success');
    }, 25000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, []);

  const addNotification = (title: string, message: string, type: NotificationType = 'info') => {
    setNotifications(prev => {
      // Prevent duplicate notifications spam
      if (prev.some(n => n.title === title && n.message === message)) {
        return prev;
      }
      const id = Math.random().toString(36).substr(2, 9);
      setTimeout(() => removeNotification(id), 6000);
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
      battery, isCharging,
      temperature, networkSpeed,
      notifications, addNotification, removeNotification,
      firewallEnabled, setFirewallEnabled,
      vpnEnabled, setVpnEnabled,
      locationEnabled, setLocationEnabled,
      cameraEnabled, setCameraEnabled,
      micEnabled, setMicEnabled,
      blockedTrackers
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
