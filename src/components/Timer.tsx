import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

/* ==============================
   COMPOSANT TIMER
   Affiche le temps restant (2 heures)
   ============================== */

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
}

export function Timer({ initialMinutes, onTimeUp }: TimerProps) {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  
  const isLowTime = timeLeft <= 300; // 5 minutes restantes
  const isCriticalTime = timeLeft <= 60; // 1 minute restante

  const formatTime = () => {
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-3 md:px-4 py-2 font-mono text-sm md:text-lg font-bold shadow-lg transition-all duration-300 ${
        isCriticalTime
          ? 'animate-pulse bg-red-600 text-white'
          : isLowTime
          ? 'bg-orange-500 text-white'
          : `bg-gradient-to-r ${theme.colors.gradient} text-white`
      }`}
    >
      <svg
        className={`h-4 w-4 md:h-5 md:w-5 ${isCriticalTime ? 'animate-bounce' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{formatTime()}</span>
    </div>
  );
}
