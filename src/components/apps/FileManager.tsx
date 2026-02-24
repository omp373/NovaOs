import { useState } from 'react';
import { Folder, File, HardDrive, ChevronRight, ChevronLeft, Trash2, Share2, Edit3, Eye, Download, PauseCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSystem } from '../../SystemContext';

const MOCK_FS: any[] = [
  { name: 'bin', type: 'dir' },
  { name: 'etc', type: 'dir' },
  { name: 'home', type: 'dir', children: [
    { name: 'user', type: 'dir', children: [
      { name: 'Documents', type: 'dir', children: [
        { name: 'notes.txt', type: 'file', size: '12 KB', content: 'Meeting at 10AM.\nBring the new prototypes.' },
        { name: 'todo.md', type: 'file', size: '4 KB', content: '- Fix UI bugs\n- Implement gestures\n- Write docs' }
      ]},
      { name: 'Downloads', type: 'dir', children: [] },
      { name: 'config.sh', type: 'file', size: '1 KB', content: 'export PATH=$PATH:/opt/nova/bin' }
    ]}
  ]},
  { name: 'var', type: 'dir' },
  { name: 'tmp', type: 'dir' },
];

export function FileManager() {
  const { isDownloading, setIsDownloading, addNotification } = useSystem();
  const [path, setPath] = useState<any[]>(MOCK_FS);
  const [pathNames, setPathNames] = useState<string[]>(['/']);
  const [direction, setDirection] = useState(1);
  const [peekFile, setPeekFile] = useState<any | null>(null);

  const handleNavigate = (item: any) => {
    if (item.type === 'dir' && item.children) {
      setDirection(1);
      setPath(item.children);
      setPathNames([...pathNames, item.name]);
    }
  };

  const handleUp = () => {
    if (pathNames.length > 1) {
      setDirection(-1);
      let current = MOCK_FS;
      for (let i = 1; i < pathNames.length - 1; i++) {
        const next = current.find(c => c.name === pathNames[i]);
        if (next && next.children) current = next.children;
      }
      setPath(current);
      setPathNames(pathNames.slice(0, -1));
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black text-white overflow-hidden relative">
      <div className="bg-zinc-900 p-3 flex items-center gap-3 border-b border-zinc-800 z-10">
        <HardDrive size={18} className="text-zinc-400 shrink-0" />
        <div className="flex-1 flex items-center overflow-x-auto no-scrollbar gap-1 text-sm font-mono">
          <AnimatePresence mode="popLayout">
            {pathNames.map((name, i) => (
              <motion.div
                key={`${i}-${name}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-1 shrink-0"
              >
                {i > 0 && <span className="text-zinc-600">/</span>}
                <span className={i === pathNames.length - 1 ? 'text-white' : 'text-zinc-400'}>
                  {name === '/' ? 'root' : name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <button 
          onClick={() => {
            setIsDownloading(!isDownloading);
            addNotification('Downloads', !isDownloading ? 'Started downloading ubuntu-24.04.iso (2.4GB)' : 'Download paused.', 'info');
          }}
          className={`p-2 rounded-lg transition-colors ${isDownloading ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-zinc-800 text-zinc-400'}`}
        >
          {isDownloading ? <PauseCircle size={18} /> : <Download size={18} />}
        </button>
      </div>

      
      {pathNames.length > 1 && (
        <button 
          onClick={handleUp}
          className="p-3 border-b border-zinc-900 flex items-center gap-3 hover:bg-zinc-900 active:bg-zinc-800 transition-colors z-10"
        >
          <ChevronLeft size={20} className="text-zinc-500" />
          <span className="text-zinc-300">Back</span>
        </button>
      )}

      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={pathNames.join('/')}
            custom={direction}
            initial={{ x: direction > 0 ? 50 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -50 : 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 overflow-y-auto overflow-x-hidden"
          >
            {path.map((item, i) => (
              <div key={item.name} className="relative border-b border-zinc-900 group">
                {/* Background Actions (Flow Gestures) */}
                <div className="absolute inset-0 flex items-center justify-end px-6 gap-6 bg-red-500/20 text-red-500">
                  <Trash2 size={20} />
                </div>
                
                <motion.div 
                  drag="x"
                  dragConstraints={{ left: -80, right: 0 }}
                  dragElastic={0.2}
                  whileTap={{ scale: 0.98 }}
                  onPanEnd={(e, info) => {
                    if (info.offset.x < -50) {
                      // Trigger delete action (simulated)
                      console.log('Delete', item.name);
                    }
                  }}
                  className="relative bg-black p-4 flex items-center justify-between cursor-pointer"
                >
                  <div 
                    className="flex items-center gap-4 flex-1"
                    onClick={() => handleNavigate(item)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (item.type === 'file') setPeekFile(item);
                    }}
                  >
                    <div className={`p-2 rounded-lg ${item.type === 'dir' ? 'bg-blue-500/10' : 'bg-zinc-800'}`}>
                      {item.type === 'dir' ? (
                        <Folder size={20} className="text-blue-500" />
                      ) : (
                        <File size={20} className="text-zinc-400" />
                      )}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.type === 'dir' ? (
                    <ChevronRight size={16} className="text-zinc-600" />
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono">{item.size}</span>
                  )}
                </motion.div>
              </div>
            ))}
            {path.length === 0 && (
              <div className="p-12 text-center flex flex-col items-center justify-center text-zinc-600">
                <Folder size={48} className="mb-4 opacity-20" />
                <p className="text-sm">Empty directory</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Peek View */}
      <AnimatePresence>
        {peekFile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPeekFile(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-h-[80%] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-4 border-b border-zinc-800 flex items-center gap-3 bg-zinc-950">
                <Eye size={18} className="text-blue-500" />
                <span className="font-medium flex-1">{peekFile.name}</span>
                <span className="text-xs text-zinc-500">{peekFile.size}</span>
              </div>
              <div className="p-6 overflow-y-auto font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {peekFile.content || 'No preview available.'}
              </div>
              <div className="p-4 border-t border-zinc-800 flex justify-end gap-2 bg-zinc-950">
                <button className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-sm font-medium hover:bg-zinc-700">Open in Editor</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
