import React, { useState } from 'react';
import { Star, X, Camera, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { useProducts } from '../ProductContext';
import { useNotifications } from '../NotificationContext';
import { cn } from '../lib/utils';

interface ReviewFormProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewForm({ productId, isOpen, onClose }: ReviewFormProps) {
  const { lang, t } = useLanguage();
  const { addReview } = useProducts();
  const { addNotification } = useNotifications();
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment || !name) {
      addNotification(
        lang === 'BN' ? 'সবগুলো ঘর পূরণ করুন' : 'Please fill in all fields',
        'error'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        productId,
        userName: name,
        rating,
        comment
      });
      
      addNotification(
        lang === 'BN' ? 'আপনার রিভিউ জমা দেওয়া হয়েছে' : 'Your review has been submitted',
        'success'
      );
      onClose();
      // Reset form
      setRating(5);
      setComment('');
      setName('');
      setImages([]);
    } catch (error) {
      addNotification('Submission failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...filesArray].slice(0, 3)); // Max 3 images
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl p-10 md:p-14"
          >
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 text-neutral-300 hover:text-neutral-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-10 text-center">
              <span className="text-[10px] font-bold uppercase tracking-[.4em] text-brand-accent mb-4 block">
                {t('customerVoices')}
              </span>
              <h2 className="text-3xl font-light text-neutral-900 tracking-tighter serif italic">
                {t('writeReview')}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Star Rating */}
              <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">
                  {lang === 'BN' ? 'আপনার রেটিং দিন' : 'Select your rating'}
                </span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-110"
                    >
                      <Star 
                        className={cn(
                          "w-8 h-8 transition-colors",
                          (hoverRating || rating) >= star 
                            ? "fill-brand-accent text-brand-accent" 
                            : "text-neutral-200"
                        )} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 pl-4">
                  {lang === 'BN' ? 'আপনার নাম' : 'Your Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'BN' ? 'যেকোনো নাম...' : 'Enter your name...'}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:border-brand-accent transition-all text-sm font-light"
                />
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 pl-4">
                   {lang === 'BN' ? 'আপনার মন্তব্য' : 'Your Experience'}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={lang === 'BN' ? 'আপনার অভিজ্ঞতা শেয়ার করুন...' : 'Describe your experience with this masterpiece...'}
                  rows={4}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:border-brand-accent transition-all text-sm font-light resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pl-4">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                      {lang === 'BN' ? 'ছবি যুক্ত করুন (ঐচ্ছিক)' : 'Add Photos (Optional)'}
                   </label>
                   <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-300">
                      {images.length}/3
                   </span>
                </div>
                
                <div className="flex gap-4">
                   <label className="w-16 h-16 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-colors">
                      <Camera className="w-5 h-5 text-neutral-400" />
                      <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
                   </label>
                   
                   {images.map((img, i) => (
                      <div key={i} className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden relative border border-neutral-200">
                         <img 
                            src={URL.createObjectURL(img)} 
                            className="w-full h-full object-cover" 
                            alt={`Preview ${i}`}
                         />
                         <button 
                            type="button"
                            onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 bg-black/40 text-white rounded-full p-0.5 hover:bg-black/60"
                         >
                            <X className="w-3 h-3" />
                         </button>
                      </div>
                   ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-neutral-900 text-white rounded-full text-[10px] font-bold uppercase tracking-[.3em] flex items-center justify-center gap-3 hover:bg-brand-accent transition-all duration-500 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                )}
                {lang === 'BN' ? 'রিভিউ জমা দিন' : 'Submit Review'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
