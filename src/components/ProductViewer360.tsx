import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Rotate3d, Move } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductViewer360Props {
  images: string[];
  className?: string;
}

export default function ProductViewer360({ images, className }: ProductViewer360Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  // Map mouse movement to image index
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered || !containerRef.current) return;
      
      const { left, width } = containerRef.current.getBoundingClientRect();
      const relativeX = e.clientX - left;
      const percentage = Math.max(0, Math.min(1, relativeX / width));
      
      const newIndex = Math.floor(percentage * (images.length - 1));
      setCurrentIndex(newIndex);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isHovered, images.length]);

  // For touch devices or manual drag simulation
  const handleDrag = (_: any, info: any) => {
    const sensitivity = 5;
    const offset = info.offset.x;
    const indexShift = Math.floor(offset / sensitivity);
    let nextIndex = (currentIndex + indexShift) % images.length;
    if (nextIndex < 0) nextIndex = images.length + nextIndex;
    setCurrentIndex(nextIndex);
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative rounded-[2.5rem] overflow-hidden bg-brand-surface border border-neutral-100 cursor-grab active:cursor-grabbing group",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`View angle ${idx}`}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-100",
              idx === currentIndex ? "opacity-100" : "opacity-0"
            )}
            referrerPolicy="no-referrer"
          />
        ))}
      </div>

      {/* Interface Overlays */}
      <div className="absolute top-6 left-6 px-4 py-2 bg-white/80 backdrop-blur-md border border-neutral-100 rounded-full flex items-center gap-2 shadow-sm z-10 transition-all group-hover:scale-105">
        <Rotate3d className="w-3.5 h-3.5 text-brand-accent animate-spin-slow" />
        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-neutral-900">360° Interactive View</span>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 bg-neutral-900/10 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        <Move className="w-3 h-3 text-neutral-500" />
        <span className="text-[7px] font-black uppercase tracking-widest text-neutral-500">Move mouse to rotate</span>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100">
        <motion.div 
          className="h-full bg-brand-accent"
          style={{ width: `${(currentIndex / (images.length - 1)) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
