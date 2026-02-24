import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

export function LockScreen({ onUnlock }: { key?: string, onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePadClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === '1234') {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 500);
        }
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center p-6"
    >
      <Lock className="text-zinc-500 mb-8" size={32} />
      <h2 className="text-white text-xl mb-2 font-light">Enter PIN</h2>
      <p className="text-zinc-500 text-sm mb-8">Default is 1234</p>
      
      <div className="flex gap-3 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border-2 ${
              error ? 'border-red-500 bg-red-500' :
              i < pin.length ? 'border-white bg-white' : 'border-zinc-600'
            } transition-colors`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-[240px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '<'].map((btn, i) => (
          <button
            key={i}
            onClick={() => {
              if (btn === '<') setPin(pin.slice(0, -1));
              else if (btn !== '') handlePadClick(btn);
            }}
            disabled={btn === ''}
            className={`h-16 rounded-none text-2xl text-white font-light flex items-center justify-center
              ${btn !== '' ? 'bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700' : ''}
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
