import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

export function CalendarApp() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  
  // Mock events
  const events: Record<number, { title: string, time: string, color: string }[]> = {
    14: [{ title: 'Design Review', time: '10:00 AM', color: 'bg-blue-500' }],
    15: [
      { title: 'Lunch with Sarah', time: '12:30 PM', color: 'bg-orange-500' },
      { title: 'Team Sync', time: '3:00 PM', color: 'bg-purple-500' }
    ],
    18: [{ title: 'Project Deadline', time: '11:59 PM', color: 'bg-red-500' }]
  };

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="flex-1 flex flex-col bg-black text-white overflow-hidden">
      <div className="p-6 pb-2 bg-zinc-900 rounded-b-3xl z-10 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-light">October</h1>
            <p className="text-zinc-400 text-sm">2026</p>
          </div>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 snap-x">
          {days.map(day => {
            const hasEvents = events[day]?.length > 0;
            const isSelected = selectedDate === day;
            
            return (
              <motion.div
                key={day}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`snap-center shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors relative
                  ${isSelected ? 'bg-white text-black' : 'bg-zinc-800 text-white'}`}
              >
                <span className="text-xs font-medium opacity-50 mb-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][(day + 3) % 7]}
                </span>
                <span className="text-xl font-light">{day}</span>
                {hasEvents && (
                  <div className="absolute bottom-2 flex gap-1">
                    {events[day].map((e, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${e.color}`} />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <CalendarIcon size={18} className="text-red-500" />
          Schedule
        </h2>
        
        <div className="space-y-4">
          {events[selectedDate] ? (
            events[selectedDate].map((event, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900 p-4 rounded-2xl flex items-center gap-4"
              >
                <div className={`w-2 h-12 rounded-full ${event.color}`} />
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{event.title}</h3>
                  <p className="text-zinc-400 text-sm">{event.time}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-zinc-600"
            >
              <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
                <CalendarIcon size={24} className="opacity-50" />
              </div>
              <p>No events for this day</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
