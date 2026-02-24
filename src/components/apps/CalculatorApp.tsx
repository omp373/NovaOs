import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete } from 'lucide-react';

export function CalculatorApp() {
  const [input, setInput] = useState('0');
  const [history, setHistory] = useState<{ equation: string; result: string }[]>([]);

  const handlePress = (val: string) => {
    if (input === '0' && val !== '.') {
      setInput(val);
    } else {
      setInput(prev => prev + val);
    }
  };

  const handleCalculate = () => {
    try {
      // Safe eval alternative for simple math
      const result = new Function('return ' + input)().toString();
      setHistory(prev => [...prev, { equation: input, result }]);
      setInput(result);
    } catch (e) {
      setInput('Error');
      setTimeout(() => setInput('0'), 1000);
    }
  };

  const handleClear = () => {
    setInput('0');
  };

  const handleDelete = () => {
    setInput(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const buttons = [
    ['C', '(', ')', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', 'del', '=']
  ];

  return (
    <div className="flex-1 flex flex-col bg-black text-white">
      <div className="flex-1 p-6 flex flex-col justify-end items-end overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black to-transparent z-10" />
        <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col justify-end pb-4 space-y-4">
          <AnimatePresence>
            {history.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-right"
              >
                <div className="text-zinc-500 text-sm">{item.equation}</div>
                <div className="text-zinc-300 text-xl">{item.result}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <motion.div 
          key={input}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-light tracking-tighter truncate w-full text-right"
        >
          {input}
        </motion.div>
      </div>

      <div className="bg-zinc-900/80 backdrop-blur-xl p-4 pb-8 rounded-t-3xl grid grid-cols-4 gap-3">
        {buttons.flat().map((btn, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (btn === '=') handleCalculate();
              else if (btn === 'C') handleClear();
              else if (btn === 'del') handleDelete();
              else handlePress(btn);
            }}
            className={`h-16 rounded-2xl text-xl font-medium flex items-center justify-center transition-colors
              ${btn === '=' ? 'bg-teal-500 text-white' : 
                ['/', '*', '-', '+'].includes(btn) ? 'bg-zinc-800 text-teal-400' : 
                btn === 'C' ? 'bg-red-500/20 text-red-400' :
                btn === 'del' ? 'bg-zinc-800 text-zinc-400' :
                'bg-zinc-800/50 text-white hover:bg-zinc-700'}`}
          >
            {btn === 'del' ? <Delete size={24} /> : btn}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
