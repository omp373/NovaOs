import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function MediaPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(33);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(12).fill(10));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => (p >= 100 ? 0 : p + 0.5));
        setVisualizerBars(prev => prev.map(() => Math.random() * 80 + 20));
      }, 100);
    } else {
      setVisualizerBars(Array(12).fill(10));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex-1 flex flex-col bg-black text-white overflow-hidden relative">
      <div className="flex-1 flex items-center justify-center bg-zinc-900/50 relative overflow-hidden">
        {/* Animated background rings */}
        <motion.div 
          animate={{ scale: isPlaying ? [1, 1.2, 1] : 1, opacity: isPlaying ? [0.1, 0.3, 0.1] : 0.1 }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute w-64 h-64 border border-purple-500 rounded-full"
        />
        <motion.div 
          animate={{ scale: isPlaying ? [1, 1.5, 1] : 1, opacity: isPlaying ? [0.05, 0.2, 0.05] : 0.05 }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
          className="absolute w-96 h-96 border border-purple-500 rounded-full"
        />
        
        <motion.div 
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="w-48 h-48 bg-zinc-800 flex items-center justify-center shadow-2xl rounded-full border-4 border-zinc-900 z-10 overflow-hidden relative"
        >
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-zinc-700 z-20">
            <Music size={24} className="text-zinc-600" />
          </div>
          
          {/* Visualizer overlay */}
          <div className="absolute inset-0 flex items-end justify-center gap-1 pb-4 opacity-30 z-10">
            {visualizerBars.map((height, i) => (
              <motion.div 
                key={i}
                animate={{ height: `${height}%` }}
                transition={{ type: "tween", duration: 0.1 }}
                className="w-2 bg-purple-500 rounded-t-sm"
              />
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="p-6 bg-zinc-900 border-t border-zinc-800 z-20">
        <h3 className="text-xl font-medium mb-1">Track 01</h3>
        <p className="text-zinc-400 text-sm mb-6">Unknown Artist</p>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs text-zinc-500 font-mono">1:14</span>
          <div 
            className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setProgress((x / rect.width) * 100);
            }}
          >
            <motion.div 
              className="h-full bg-purple-500" 
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>
          <span className="text-xs text-zinc-500 font-mono">3:45</span>
        </div>

        <div className="flex items-center justify-center gap-8">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <SkipBack size={28} />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors shadow-lg shadow-purple-900/50 relative"
          >
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.div key="pause" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Pause size={28} className="text-white" />
                </motion.div>
              ) : (
                <motion.div key="play" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Play size={28} className="ml-1 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <SkipForward size={28} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
