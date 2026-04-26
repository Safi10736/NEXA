import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, RefreshCw, X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function PWAPrompt() {
  const { lang } = useLanguage();
  const registerSW = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  // Use defensive extraction to prevent "undefined" destructuring errors
  const offlineReadyState = (registerSW && registerSW.offlineReady) ? registerSW.offlineReady : [false, () => {}] as [boolean, (v: boolean) => void];
  const needUpdateState = (registerSW && registerSW.needUpdate) ? registerSW.needUpdate : [false, () => {}] as [boolean, (v: boolean) => void];
  
  const [offlineReady, setOfflineReady] = offlineReadyState;
  const [needUpdate, setNeedUpdate] = needUpdateState;
  const updateServiceWorker = registerSW?.updateServiceWorker;

  const close = () => {
    if (setOfflineReady) setOfflineReady(false);
    if (setNeedUpdate) setNeedUpdate(false);
  };

  return (
    <AnimatePresence>
      {(offlineReady || needUpdate) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] w-[90%] max-w-md p-6 bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-white/10 shadow-2xl flex flex-col gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center flex-shrink-0">
              {needUpdate ? (
                <RefreshCw className="w-6 h-6 text-brand-accent animate-spin-slow" />
              ) : (
                <Download className="w-6 h-6 text-brand-accent" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">
                {needUpdate ? (lang === 'BN' ? 'নতুন সংস্করণ' : 'Update Available') : (lang === 'BN' ? 'অফলাইন তৈরি' : 'App Ready')}
              </h4>
              <p className="text-sm font-light text-neutral-600 dark:text-neutral-400">
                {needUpdate 
                  ? (lang === 'BN' ? 'আমাদের অ্যাপের একটি নতুন সংস্করণ পাওয়া গেছে। এখনই রিফ্রেশ করুন।' : 'A new version of the app is available. Refresh to update now.')
                  : (lang === 'BN' ? 'অ্যাপটি এখন অফলাইনে ব্যবহারের জন্য সম্পূর্ণ প্রস্তুত।' : 'The app is now fully ready for offline use.')
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {needUpdate ? (
              <button
                onClick={() => updateServiceWorker(true)}
                className="flex-1 py-4 bg-brand-accent text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-900 transition-all shadow-xl"
              >
                {lang === 'BN' ? 'আপডেট করুন' : 'Update Now'}
              </button>
            ) : (
              <button
                onClick={close}
                className="flex-1 py-4 bg-neutral-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl"
              >
                {lang === 'BN' ? 'ঠিক আছে' : 'Got it'}
              </button>
            )}
            <button
              onClick={close}
              className="w-14 h-14 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all text-neutral-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
