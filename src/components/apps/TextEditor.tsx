import { useState, useEffect } from 'react';
import { Save, FileText, Check, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function TextEditor() {
  const [content, setContent] = useState('Welcome to NovaShell Text Editor.\n\nThis is a lightweight editor for basic configuration and notes.\n\nTry typing to enter Zen Mode.');
  const [isSaving, setIsSaving] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping) {
      setIsZenMode(true);
      timeout = setTimeout(() => {
        setIsTyping(false);
        setIsZenMode(false);
      }, 2000);
    }
    return () => clearTimeout(timeout);
  }, [isTyping, content]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-white relative">
      <AnimatePresence>
        {!isZenMode && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-4 left-4 right-4 bg-zinc-900/80 backdrop-blur-md p-2 rounded-2xl flex items-center justify-between border border-zinc-800 z-10 shadow-xl"
          >
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <FileText size={16} className="text-yellow-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">untitled.txt</span>
                <span className="text-[10px] text-zinc-500 font-mono">{content.length} chars</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setIsZenMode(true)}
                className="p-2 hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
              >
                <Maximize2 size={18} />
              </button>
              <button 
                onClick={handleSave}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white transition-colors relative w-10 h-10 flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  {isSaving ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-emerald-500"
                    >
                      <Check size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="save"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      <Save size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <textarea 
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsTyping(true);
        }}
        className={`flex-1 w-full bg-transparent text-zinc-300 font-mono text-sm resize-none focus:outline-none leading-relaxed transition-all duration-500
          ${isZenMode ? 'p-8 pt-12' : 'p-6 pt-24'}`}
        spellCheck={false}
        placeholder="Start typing..."
      />

      <AnimatePresence>
        {isZenMode && !isTyping && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsZenMode(false)}
            className="absolute bottom-6 right-6 p-3 bg-zinc-800 rounded-full text-zinc-400 hover:text-white shadow-lg border border-zinc-700"
          >
            <Minimize2 size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
