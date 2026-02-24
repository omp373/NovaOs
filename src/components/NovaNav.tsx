import { motion, useAnimation, PanInfo } from 'motion/react';
import { useRef } from 'react';

interface NovaNavProps {
  onBack: () => void;
  onHome: () => void;
  onSwitcher: () => void;
}

export function NovaNav({ onBack, onHome, onSwitcher }: NovaNavProps) {
  const controls = useAnimation();
  const isDragging = useRef(false);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    setTimeout(() => { isDragging.current = false; }, 50);
    
    const { offset, velocity } = info;
    
    if (offset.y < -30 || velocity.y < -300) {
      onSwitcher();
    } else if (offset.x < -30 || velocity.x < -300) {
      onBack();
    }
    
    controls.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } });
  };

  return (
    <div className="absolute bottom-2 left-0 right-0 flex justify-center z-50 pointer-events-none">
      <motion.div 
        className="pointer-events-auto p-4 cursor-pointer"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.4}
        onDragStart={() => { isDragging.current = true; }}
        onDragEnd={handleDragEnd}
        animate={controls}
        onClick={() => {
          if (!isDragging.current) onHome();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,1)" }}
          whileTap={{ scale: 0.9 }}
          className="w-24 h-1.5 bg-white/60 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        />
      </motion.div>
    </div>
  );
}
