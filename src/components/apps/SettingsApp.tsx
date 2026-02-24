import { useState } from 'react';
import { User, Shield, Wifi, Battery, Monitor, Info, ChevronRight, AlertTriangle, CheckCircle2, Lock, EyeOff, MapPin, Camera, Mic, Network, Fingerprint, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSystem } from '../../SystemContext';

export function SettingsApp() {
  const { 
    wifiEnabled, setWifiEnabled, isDownloading, addNotification,
    firewallEnabled, setFirewallEnabled,
    vpnEnabled, setVpnEnabled,
    locationEnabled, setLocationEnabled,
    cameraEnabled, setCameraEnabled,
    micEnabled, setMicEnabled,
    blockedTrackers
  } = useSystem();
  
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [showWifiWarning, setShowWifiWarning] = useState(false);
  const [activeView, setActiveView] = useState<'main' | 'privacy'>('main');

  const handleWifiToggle = () => {
    if (wifiEnabled && isDownloading) {
      setShowWifiWarning(true);
    } else {
      setWifiEnabled(!wifiEnabled);
      addNotification('Network', `Wi-Fi has been ${!wifiEnabled ? 'enabled' : 'disabled'}.`, 'info');
    }
  };

  const confirmWifiDisable = () => {
    setWifiEnabled(false);
    setShowWifiWarning(false);
    addNotification('Network', 'Wi-Fi disabled. Download interrupted.', 'warning');
  };

  const renderMainView = () => (
    <motion.div 
      key="main"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-1 px-2 pb-6"
    >
      {/* Transparency & Trust Section */}
      <div 
        onClick={() => setActiveView('privacy')}
        className="mx-4 mb-6 mt-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl cursor-pointer hover:bg-emerald-500/20 transition-colors group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Shield size={18} />
            <span className="font-medium text-sm">Security Dashboard</span>
          </div>
          <ChevronRight size={16} className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
        </div>
        <p className="text-xs text-emerald-500/80 leading-relaxed">
          System is secure. {blockedTrackers} trackers blocked today. Tap to manage permissions and encryption.
        </p>
      </div>

      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-2">Connectivity</div>
      <ToggleItem 
        icon={Wifi} 
        title="Wi-Fi" 
        description={wifiEnabled ? "Connected to 'NovaNet' (Secured)" : "Disconnected"} 
        enabled={wifiEnabled}
        onToggle={handleWifiToggle}
      />
      <ToggleItem 
        icon={Network} 
        title="NovaVPN" 
        description={vpnEnabled ? "Routing through Zurich, CH" : "Not connected"} 
        enabled={vpnEnabled}
        onToggle={() => {
          setVpnEnabled(!vpnEnabled);
          addNotification('Security', `VPN ${!vpnEnabled ? 'Connected' : 'Disconnected'}`, !vpnEnabled ? 'success' : 'warning');
        }}
      />
      
      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-2 mt-6">Device</div>
      <SettingItem icon={Battery} title="Power & Battery" value="84% - Optimized Charging" />
      <SettingItem icon={Monitor} title="Display & Brightness" value="Dark Mode, True Tone" />
      
      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-2 mt-6">System</div>
      <SettingItem icon={User} title="Accounts & Sync" value="Encrypted Sync Active" />
      <SettingItem icon={Info} title="About NovaShell" value="v1.0.0 (ARM) - Up to date" />
    </motion.div>
  );

  const renderPrivacyView = () => (
    <motion.div 
      key="privacy"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col gap-1 px-2 pb-6"
    >
      <div className="mx-4 mb-6 mt-2 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-500">
          <Fingerprint size={32} />
        </div>
        <h3 className="text-lg font-medium mb-1">Hardware Encryption Active</h3>
        <p className="text-xs text-zinc-400">Your data is secured with AES-256 hardware-level encryption. Keys never leave the secure enclave.</p>
      </div>

      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-2">Active Protection</div>
      <ToggleItem 
        icon={Shield} 
        title="Nova Firewall" 
        description={`Blocking incoming connections. ${blockedTrackers} threats stopped.`} 
        enabled={firewallEnabled}
        onToggle={() => {
          setFirewallEnabled(!firewallEnabled);
          addNotification('Security Alert', `Firewall ${!firewallEnabled ? 'Enabled' : 'Disabled. Device is vulnerable.'}`, !firewallEnabled ? 'success' : 'error');
        }}
      />

      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 py-2 mt-6">Hardware Permissions</div>
      <ToggleItem 
        icon={MapPin} 
        title="Location Services" 
        description={locationEnabled ? "Allowed for 2 apps" : "Globally disabled"} 
        enabled={locationEnabled}
        onToggle={() => setLocationEnabled(!locationEnabled)}
      />
      <ToggleItem 
        icon={Camera} 
        title="Camera Access" 
        description={cameraEnabled ? "Allowed" : "Hardware switch off"} 
        enabled={cameraEnabled}
        onToggle={() => setCameraEnabled(!cameraEnabled)}
      />
      <ToggleItem 
        icon={Mic} 
        title="Microphone Access" 
        description={micEnabled ? "Allowed" : "Hardware switch off"} 
        enabled={micEnabled}
        onToggle={() => setMicEnabled(!micEnabled)}
      />
    </motion.div>
  );

  return (
    <div className="flex-1 flex flex-col bg-black text-white overflow-y-auto relative overflow-x-hidden">
      {/* Warning Dialog */}
      <AnimatePresence>
        {showWifiWarning && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-orange-500/30 p-6 rounded-3xl shadow-2xl max-w-sm w-full"
            >
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mb-4 text-orange-500">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">Active Download</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                You are currently downloading a file. Turning off Wi-Fi will interrupt the download and you may lose progress. Are you sure?
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowWifiWarning(false)}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 font-medium hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmWifiDisable}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors"
                >
                  Turn Off
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 bg-zinc-900 mb-2 sticky top-0 z-10 border-b border-zinc-800 flex items-center gap-4">
        {activeView !== 'main' && (
          <button 
            onClick={() => setActiveView('main')}
            className="p-2 -ml-2 hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-2xl font-light tracking-tight">
          {activeView === 'main' ? 'Settings' : 'Privacy & Security'}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'main' ? renderMainView() : renderPrivacyView()}
      </AnimatePresence>
    </div>
  );
}

function SettingItem({ icon: Icon, title, value }: { icon: any, title: string, value: string }) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="bg-zinc-900 p-4 flex items-center gap-4 cursor-pointer hover:bg-zinc-800/80 transition-colors rounded-xl"
    >
      <div className="p-2 bg-zinc-800 rounded-lg">
        <Icon className="text-zinc-300" size={20} />
      </div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-zinc-500">{value}</div>
      </div>
      <ChevronRight size={18} className="text-zinc-600" />
    </motion.div>
  );
}

function ToggleItem({ icon: Icon, title, description, enabled, onToggle }: any) {
  return (
    <div className="bg-zinc-900 p-4 flex items-center gap-4 rounded-xl">
      <div className={`p-2 rounded-lg transition-colors ${enabled ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-300'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-zinc-500">{description}</div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors ${enabled ? 'bg-blue-500' : 'bg-zinc-700'}`}
      >
        <motion.div 
          className="w-4 h-4 bg-white rounded-full shadow-sm"
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}
