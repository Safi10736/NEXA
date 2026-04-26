import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, RefreshCw, Smartphone, CameraOff, Box } from 'lucide-react';
import { cn } from '../lib/utils';
import { Product } from '../types';

interface ARTryOnModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ARTryOnModal({ product, isOpen, onClose }: ARTryOnModalProps) {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  const capturePhoto = () => {
    setIsCapturing(true);
    setTimeout(() => setIsCapturing(false), 150);
    // In a real app, this would use canvas.toDataURL() on the video + overlay
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    setHasCamera(null);
    
    // Check for browser support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Camera API not supported");
      setHasCamera(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for the video to actually start playing
        videoRef.current.onloadedmetadata = () => {
          setHasCamera(true);
        };
      } else {
        // Fallback if ref is missing
        setHasCamera(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
      // Explicitly set to false to show the error UI with "Try Again" button
      setHasCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    // Basic interaction to move product could be added here
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/95 backdrop-blur-3xl"
        >
          <div className="relative w-full h-full md:max-w-[95vw] md:h-[90vh] md:rounded-[4rem] overflow-hidden bg-neutral-900 border-none md:border md:border-white/10 shadow-2xl flex flex-col transition-all">
            
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 md:p-10 flex items-center justify-between z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-accent rounded-2xl shadow-xl shadow-brand-accent/20">
                  <Box className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-light text-white tracking-tight">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Virtual Placement Active</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-95"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Viewport */}
            <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
              <AnimatePresence>
                {isCapturing && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white z-[100]"
                  />
                )}
              </AnimatePresence>

              {hasCamera ? (
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-60"
                />
              ) : hasCamera === false ? (
                <div className="flex flex-col items-center justify-center text-center p-12 text-white/40">
                  <CameraOff className="w-16 h-16 mb-6 opacity-20" />
                  <p className="text-xl font-light mb-2">Camera access denied</p>
                  <p className="text-sm mb-8">Please enable camera to use AR features</p>
                  <button 
                    onClick={startCamera}
                    className="flex items-center gap-2 px-8 py-3 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-neutral-900 transition-all active:scale-95 pointer-events-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="animate-pulse flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-brand-accent animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Initializing AR Core...</span>
                </div>
              )}

              {/* Product Overlay */}
              <motion.div
                drag
                dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
                className="relative z-20 cursor-move"
                style={{ scale, rotate: rotation }}
              >
                <img 
                  src={product.images[0]} 
                  alt="AR Product" 
                  className="w-64 h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating indicators around product */}
                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <Box className="w-4 h-4 text-white" />
                </div>
              </motion.div>

              {/* AR Guide */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border-2 border-dashed border-white/10 rounded-[2rem] pointer-events-none" />
              
              <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between z-30 pointer-events-none">
                 <div className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] max-w-xs pointer-events-auto">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">Controls</p>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest">Scaling</span>
                            <input 
                                type="range" 
                                min="0.5" 
                                max="2" 
                                step="0.1" 
                                value={scale} 
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                className="w-32 accent-brand-accent"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-8">
                            <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest">Rotation</span>
                            <input 
                                type="range" 
                                min="-180" 
                                max="180" 
                                value={rotation} 
                                onChange={(e) => setRotation(parseInt(e.target.value))}
                                className="w-32 accent-brand-accent"
                            />
                        </div>
                    </div>
                 </div>

                 <button 
                   onClick={capturePhoto}
                   className="p-10 bg-white rounded-full shadow-2xl active:scale-90 transition-all pointer-events-auto hover:bg-neutral-100"
                 >
                    <Camera className="w-8 h-8 text-neutral-900" />
                 </button>

                 <div className="hidden md:flex gap-4 pointer-events-auto">
                    <div className="p-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-white" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-widest">Mobile Optimized</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
