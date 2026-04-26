import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, X, Sparkles, Loader2, Download, Play, Share2, AlertCircle, Key } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { videoService } from '../services/videoShowcaseService';
import { useLanguage } from '../LanguageContext';

interface VideoShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  context: string;
  type: 'product' | 'gallery';
}

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function VideoShowcaseModal({ isOpen, onClose, title, context, type }: VideoShowcaseModalProps) {
  const { lang } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'checking_key' | 'generating' | 'fetching' | 'ready' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  const messages = [
    lang === 'BN' ? "AI আপনার সীন কম্পোজ করছে..." : "AI is composing your scene...",
    lang === 'BN' ? "সিনেমেটিক লাইটিং সেট করা হচ্ছে..." : "Setting up cinematic lighting...",
    lang === 'BN' ? "ক্যামেরা প্যাথ তৈরি হচ্ছে..." : "Generating camera paths...",
    lang === 'BN' ? "ডিটেইলস রেন্ডার করা হচ্ছে..." : "Rendering fine details...",
    lang === 'BN' ? "ফাইনাল টাচ দেওয়া হচ্ছে..." : "Adding final touches...",
  ];

  useEffect(() => {
    let interval: any;
    if (status === 'generating') {
      let i = 0;
      setLoadingMessage(messages[0]);
      interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingMessage(messages[i]);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [status, lang]);

  const handleStartGeneration = async () => {
    try {
      setStatus('checking_key');
      const hasKey = await window.aistudio.hasSelectedApiKey();
      
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // After opening dialog, we assume they selected or we retry
      }

      setStatus('generating');
      setProgress(10);

      const operation = type === 'product' 
        ? await videoService.generateProductShowcase(title, context)
        : await videoService.generateGalleryWalkthrough(title);

      // Polling
      let currentOp = operation;
      const apiKey = process.env.GEMINI_API_KEY || (process.env as any).API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      while (!currentOp.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        currentOp = await ai.operations.getVideosOperation({ operation: currentOp });
        setProgress(prev => Math.min(prev + 5, 95));
      }

      const downloadLink = currentOp.response?.generatedVideos?.[0]?.video?.uri;
      if (!downloadLink) throw new Error("Video generation failed to return a URI.");

      setStatus('fetching');
      const blob = await videoService.fetchVideoBlob(downloadLink);
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setStatus('ready');
      setProgress(100);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setErrorMessage(lang === 'BN' ? "API কী রি-সিলেক্ট করুন" : "Please re-select your API key");
        await window.aistudio.openSelectKey();
      } else {
        setErrorMessage(err.message || "Failed to generate video");
      }
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `NEXA_Showcase_${title.replace(/\s+/g, '_')}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-[80vh] md:h-auto md:aspect-video"
          >
            {/* Main Display Area */}
            <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {status === 'ready' && videoUrl ? (
                  <motion.video
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-contain"
                  />
                ) : status === 'generating' || status === 'fetching' || status === 'checking_key' ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-8 text-center p-12"
                  >
                    <div className="relative">
                        <div className="w-24 h-24 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-brand-accent animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xl font-light text-white serif italic">
                             {loadingMessage}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500">
                            {lang === 'BN' ? 'গেনারেশন সম্পন্ন হতে কয়েক মিনিট সময় নিতে পারে' : 'Generation may take a few minutes'}
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="w-64 h-1 bg-neutral-800 rounded-full overflow-hidden mt-8">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-brand-accent"
                             />
                        </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6 text-center p-12"
                  >
                    <div className="w-20 h-20 bg-brand-accent/10 rounded-3xl flex items-center justify-center">
                        <Video className="w-10 h-10 text-brand-accent" />
                    </div>
                    <div className="max-w-md">
                        <h3 className="text-2xl font-light text-white serif italic mb-4">
                            {lang === 'BN' ? 'AI সিনেমাটিক শোকেস জেনারেটর' : 'AI Cinematic Showcase Generator'}
                        </h3>
                        <p className="text-sm font-light text-neutral-400 leading-relaxed mb-8">
                            {lang === 'BN' 
                                ? `পেশাদার ক্যামেরার মুভমেন্ট এবং স্টুডিও লাইটিং সহ "${title}" এর একটি ৪কে সিনেমাটিক ভিডিও তৈরি করুন।`
                                : `Generate a 4K resolution cinematic video of "${title}" featuring professional camera movements and studio-grade lighting.`}
                        </p>
                        
                        <button 
                            onClick={handleStartGeneration}
                            className="w-full py-4 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-neutral-900 transition-all shadow-xl shadow-brand-accent/20 flex items-center justify-center gap-3 group"
                        >
                            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            {lang === 'BN' ? 'শোকেস জেনারেট করুন' : 'Generate Showcase'}
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {status === 'error' && (
                <div className="absolute inset-0 bg-red-900/40 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center z-20">
                     <AlertCircle className="w-16 h-16 text-white mb-6" />
                     <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">{lang === 'BN' ? 'গেনারেশন ব্যর্থ হয়েছে' : 'Generation Failed'}</h3>
                     <p className="text-sm text-white/80 mb-8 max-w-xs">{errorMessage}</p>
                     <button 
                        onClick={handleStartGeneration}
                        className="px-8 py-3 bg-white text-red-600 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all shadow-2xl"
                     >
                        {lang === 'BN' ? 'আবার চেষ্টা করুন' : 'Try Again'}
                     </button>
                </div>
              )}
            </div>

            {/* Sidebar / Info Panel */}
            <div className="w-full md:w-80 bg-neutral-50 dark:bg-neutral-800 p-8 flex flex-col items-center md:items-start justify-between border-t md:border-t-0 md:border-l border-white/5">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-accent mb-4">
                        {lang === 'BN' ? 'প্রজেক্ট ডিটেইলস' : 'Project Details'}
                    </h4>
                    <h2 className="text-xl font-light text-neutral-900 dark:text-white serif italic mb-2 leading-tight">
                        {title}
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-8">
                        {type === 'product' ? (lang === 'BN' ? 'প্রোডাক্ট ডেমো' : 'Product Demo') : (lang === 'BN' ? 'ভার্চুয়াল গ্যালারি' : 'Virtual Gallery')}
                    </p>
                    
                    <div className="space-y-4">
                         <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
                             <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                 <Play className="w-4 h-4" />
                             </div>
                             <span className="text-[9px] font-bold uppercase tracking-widest">720p / 1080p AI Video</span>
                         </div>
                         <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
                             <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                                 <Loader2 className="w-4 h-4" />
                             </div>
                             <span className="text-[9px] font-bold uppercase tracking-widest">Veo 1.5 Lite Engine</span>
                         </div>
                    </div>
                </div>

                <div className="w-full space-y-3 mt-8">
                    {status === 'ready' && (
                        <>
                            <button 
                                onClick={handleDownload}
                                className="w-full py-4 bg-neutral-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                {lang === 'BN' ? 'ডাউনলোড শোকেস' : 'Download Video'}
                            </button>
                            <button 
                                onClick={() => {
                                    if (navigator.share && videoUrl) {
                                        navigator.share({
                                            title: `AI Showcase of ${title}`,
                                            url: window.location.href
                                        });
                                    }
                                }}
                                className="w-full py-4 bg-white border border-neutral-200 text-neutral-900 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-neutral-900 transition-all flex items-center justify-center gap-2"
                            >
                                <Share2 className="w-4 h-4" />
                                {lang === 'BN' ? 'শেয়ার করুন' : 'Share'}
                            </button>
                        </>
                    )}
                    
                    <button 
                        onClick={async () => await window.aistudio.openSelectKey()}
                        className="w-full py-4 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                    >
                        <Key className="w-3.5 h-3.5" />
                        {lang === 'BN' ? 'চেঞ্জ এপিআই কী' : 'Change AI Key'}
                    </button>
                </div>
            </div>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 w-12 h-12 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-[30]"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
