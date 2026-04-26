import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface FlashSaleTimerProps {
  endTime: number;
}

export default function FlashSaleTimer({ endTime }: FlashSaleTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{h: number, m: number, s: number} | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = endTime - Date.now();
      if (difference <= 0) return null;

      return {
        h: Math.floor(difference / (1000 * 60 * 60)),
        m: Math.floor((difference / (1000 * 60)) % 60),
        s: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [endTime]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-brand-accent text-white rounded-lg font-mono text-xs font-bold animate-pulse">
      <Timer className="w-3 h-3" />
      <span>
        {String(timeLeft.h).padStart(2, '0')}:
        {String(timeLeft.m).padStart(2, '0')}:
        {String(timeLeft.s).padStart(2, '0')}
      </span>
    </div>
  );
}
