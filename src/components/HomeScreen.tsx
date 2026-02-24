import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { APPS } from '../App';
import { ArrowRight, Search, Command } from 'lucide-react';

export function HomeScreen({ onLaunchApp }: { key?: string, onLaunchApp: (id: string) => void }) {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = APPS.filter(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black overflow-hidden flex flex-col"
    >
      {/* Pull down for Nova Command */}
      <motion.div 
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          if (offset.y > 50 || velocity.y > 200) {
            setIsCommandOpen(true);
          }
        }}
        className="flex-1 overflow-y-auto p-4 no-scrollbar pb-20"
      >
        <div className="mb-8 mt-4 flex items-center justify-between">
          <h1 className="text-white text-4xl font-light tracking-tight">Start</h1>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCommandOpen(true)}
            className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400"
          >
            <Search size={18} />
          </motion.button>
        </div>

        <div className="grid grid-cols-4 gap-3 auto-rows-[80px]">
          {APPS.map((app, i) => {
            const colSpan = app.size === 'wide' ? 'col-span-4' : app.size === 'medium' ? 'col-span-2' : 'col-span-1';
            const rowSpan = app.size === 'large' ? 'row-span-2' : 'row-span-1';
            
            return (
              <motion.button
                key={app.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: i * 0.05, 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
                whileHover={{ 
                  scale: 1.03, 
                  filter: "brightness(1.15)",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                }}
                whileTap={{ scale: 0.92, filter: "brightness(0.9)" }}
                onClick={() => onLaunchApp(app.id)}
                className={`${app.color} ${colSpan} ${rowSpan} p-4 flex flex-col justify-between items-start relative rounded-2xl overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Live Tile Content */}
                {app.id === 'sys-monitor' && (
                  <div className="absolute top-4 right-4 flex items-end gap-1 h-8 opacity-50">
                    <motion.div animate={{ height: ['20%', '80%', '40%'] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 bg-white rounded-t-sm" />
                    <motion.div animate={{ height: ['60%', '30%', '90%'] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 bg-white rounded-t-sm" />
                    <motion.div animate={{ height: ['40%', '100%', '60%'] }} transition={{ repeat: Infinity, duration: 1.8 }} className="w-1.5 bg-white rounded-t-sm" />
                  </div>
                )}

                {app.id === 'calendar' && (
                  <div className="absolute top-4 right-4 text-white/50 font-medium text-lg">
                    {new Date().getDate()}
                  </div>
                )}

                <app.icon className="text-white relative z-10 drop-shadow-md" size={28} />
                <span className="text-white text-sm font-medium relative z-10 drop-shadow-md">{app.name}</span>

                {app.notifications && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 + 0.3, type: "spring", stiffness: 500, damping: 15 }}
                    className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-black/20 z-10"
                  >
                    {app.notifications}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: APPS.length * 0.05, type: "spring" }}
            whileHover={{ scale: 1.02, backgroundColor: "#27272a" }}
            whileTap={{ scale: 0.96 }}
            className="col-span-4 row-span-1 bg-zinc-900 p-4 flex items-center justify-between rounded-2xl mt-2 mb-8"
          >
            <span className="text-white text-sm font-medium">All Applications</span>
            <ArrowRight className="text-white" size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Nova Command Palette Overlay */}
      <AnimatePresence>
        {isCommandOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col p-4"
          >
            <div className="flex items-center gap-3 bg-zinc-900 p-4 rounded-2xl mt-8 shadow-2xl border border-zinc-800">
              <Command className="text-zinc-400" size={20} />
              <input 
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search apps, files, commands..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
              />
              <button onClick={() => setIsCommandOpen(false)} className="text-xs text-zinc-500 font-medium px-2 py-1 bg-zinc-800 rounded-md">ESC</button>
            </div>

            <div className="mt-6 flex-1 overflow-y-auto space-y-2">
              {filteredApps.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    onLaunchApp(app.id);
                    setIsCommandOpen(false);
                  }}
                  className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl hover:bg-zinc-800 cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-lg ${app.color} flex items-center justify-center`}>
                    <app.icon size={20} className="text-white" />
                  </div>
                  <span className="text-white font-medium">{app.name}</span>
                </motion.div>
              ))}
              {filteredApps.length === 0 && (
                <div className="text-center text-zinc-500 mt-12">No results found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
