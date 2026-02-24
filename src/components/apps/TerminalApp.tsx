import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';

export function TerminalApp() {
  const [history, setHistory] = useState<{type: 'in' | 'out' | 'sys', text: string}[]>([
    { type: 'sys', text: 'NovaShell v1.0.0 (armv7l)' },
    { type: 'sys', text: 'Type "help" for a list of commands.' },
    { type: 'sys', text: '' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      const newHistory = [...history, { type: 'in', text: `root@nova:~# ${cmd}` } as const];
      
      if (cmd === 'help') {
        newHistory.push({ type: 'out', text: 'Available commands: help, clear, uname, date, whoami, ls, echo, matrix' });
      } else if (cmd === 'clear') {
        setHistory([]);
        setInput('');
        return;
      } else if (cmd === 'uname') {
        newHistory.push({ type: 'out', text: 'Linux nova 5.15.0-custom-arm #1 SMP PREEMPT armv7l GNU/Linux' });
      } else if (cmd === 'date') {
        newHistory.push({ type: 'out', text: new Date().toString() });
      } else if (cmd === 'whoami') {
        newHistory.push({ type: 'out', text: 'root' });
      } else if (cmd === 'ls') {
        newHistory.push({ type: 'out', text: 'bin  etc  home  var  tmp' });
      } else if (cmd.startsWith('echo ')) {
        newHistory.push({ type: 'out', text: cmd.slice(5) });
      } else if (cmd === 'matrix') {
        newHistory.push({ type: 'sys', text: 'Wake up, Neo...' });
      } else if (cmd !== '') {
        newHistory.push({ type: 'out', text: `bash: ${cmd}: command not found` });
      }

      setHistory(newHistory);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 text-green-500 font-mono text-xs overflow-hidden relative">
      <div className="bg-zinc-900 p-2 flex items-center gap-2 border-b border-zinc-800 z-10 shadow-md">
        <Terminal size={16} className="text-zinc-400" />
        <span className="text-zinc-300 font-sans text-sm font-medium">root@nova:~</span>
      </div>
      
      <div className="flex-1 overflow-y-auto break-all whitespace-pre-wrap p-4 no-scrollbar">
        {history.map((line, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-1 ${line.type === 'in' ? 'text-white' : line.type === 'sys' ? 'text-blue-400' : 'text-green-500'}`}
          >
            {line.text}
          </motion.div>
        ))}
        <div className="flex items-center mt-2">
          <span className="mr-2 text-blue-400">root@nova:~#</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="flex-1 bg-transparent outline-none text-white caret-green-500"
            autoFocus
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
