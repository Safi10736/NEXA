import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Loader2, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  timestamp: number;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const whatsappNumber = '8801940698304';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat_history');
    if (saved) return JSON.parse(saved);
    return [
      { 
        id: 1, 
        type: 'bot', 
        text: lang === 'BN' ? 'হ্যালো! আমি নেক্সা অ্যাসিস্ট্যান্ট। আমি আপনাকে কীভাবে সাহায্য করতে পারি?' : 'Hello! I am Nexa Assistant. How can I help you today?',
        timestamp: Date.now()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getBotResponse = (userText: string) => {
    const text = userText.toLowerCase();
    
    if (lang === 'BN') {
      if (text.includes('মুল্য') || text.includes('দাম') || text.includes('প্রাইস')) {
        return 'আমাদের প্রতিটি পণ্যের দাম শপ পেজে দেওয়া আছে। আপনি আপনার পছন্দমতো পণ্যটি দেখে নিতে পারেন।';
      }
      if (text.includes('ডেলিভারি') || text.includes('শিপিং')) {
        return 'আমরা সারা বাংলাদেশে ডেলিভারি দেই। সাধারণত ঢাকার ভেতরে ১-২ দিন এবং বাইরে ৩-৫ দিন সময় লাগে।';
      }
      if (text.includes('হ্যালো') || text.includes('হাই')) {
        return 'হ্যালো! আপনাকে কীভাবে সাহায্য করতে পারি?';
      }
      return 'ধন্যবাদ আপনার বার্তার জন্য! আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।';
    } else {
      if (text.includes('price') || text.includes('how much') || text.includes('cost')) {
        return 'All our product prices are listed on the Shop page. Feel free to browse through our collection!';
      }
      if (text.includes('delivery') || text.includes('shipping')) {
        return 'We deliver nationwide. Typically it takes 1-2 days inside Dhaka and 3-5 days outside.';
      }
      if (text.includes('hello') || text.includes('hi')) {
        return 'Hello! How can I assist you today?';
      }
      return 'Thank you for your message! One of our team members will get back to you shortly.';
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg: Message = { id: Date.now(), type: 'user', text: message, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    
    setIsTyping(true);

    // Simulate bot thinking/typing
    setTimeout(() => {
      const responseText = getBotResponse(message);
      const botMsg: Message = {
        id: Date.now() + 1,
        type: 'bot',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const clearChat = () => {
    if (window.confirm(lang === 'BN' ? 'আপনি কি পুরো চ্যাট ডিলিট করতে চান?' : 'Clear all chat history?')) {
      const initialMsg = [
        { 
          id: 1, 
          type: 'bot', 
          text: lang === 'BN' ? 'হ্যালো! আমি নেক্সা অ্যাসিস্ট্যান্ট। আমি আপনাকে কীভাবে সাহায্য করতে পারি?' : 'Hello! I am Nexa Assistant. How can I help you today?',
          timestamp: Date.now()
        }
      ];
      setMessages(initialMsg);
      localStorage.removeItem('chat_history');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-[2.5rem] shadow-2xl border border-neutral-100 overflow-hidden flex flex-col ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="bg-brand-accent p-8 text-white relative overflow-hidden">
               {/* Decorative background circle */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <h3 className="font-bold uppercase tracking-[0.2em] text-[9px] opacity-80">Live Assistance</h3>
                </div>
                <div className="flex items-center gap-2">
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#25D366] hover:bg-[#128C7E] rounded-full transition-colors flex items-center gap-2 group/wa"
                    title="Chat on WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.552 4.197 1.604 6.02L0 24l6.132-1.61c1.777 1.054 3.797 1.61 5.867 1.61h.005c6.634 0 12.048-5.414 12.048-12.05a11.8 11.0 0 00-3.417-8.441z" />
                    </svg>
                    <span className="text-[8px] font-bold uppercase tracking-widest hidden group-hover/wa:block whitespace-nowrap">WhatsApp</span>
                  </a>
                  <button 
                    onClick={clearChat}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    title="Clear Chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-inner">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-lg font-bold tracking-tight">Nexa Support Team</p>
                  <p className="text-[10px] opacity-70 uppercase tracking-widest font-medium">Expected wait: 5 mins</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 h-[400px] overflow-y-auto p-8 space-y-6 bg-[#fcfcfc] scroll-smooth"
            >
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    msg.type === 'user' 
                    ? 'bg-brand-accent text-white rounded-tr-none' 
                    : 'bg-white text-neutral-800 border border-neutral-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-neutral-400 mt-2 font-medium uppercase tracking-tighter">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="bg-white border border-neutral-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-brand-accent animate-spin" />
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nexa is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-neutral-100 flex gap-3 items-center">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === 'BN' ? 'আপনার বার্তা লিখুন...' : 'Type your message...'}
                className="flex-1 bg-neutral-50 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-1 focus:ring-brand-accent transition-all placeholder:text-neutral-300"
              />
              <button 
                type="submit" 
                disabled={!message.trim()}
                className="w-14 h-14 bg-brand-accent text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-accent/20 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative group overflow-hidden",
          isOpen ? "bg-white text-brand-accent rotate-90" : "bg-brand-accent text-white"
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'close' : 'open'}
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7 shadow-sm" />}
          </motion.div>
        </AnimatePresence>
        
        {!isOpen && (
          <span className="absolute right-full mr-6 bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none translate-x-4 group-hover:translate-x-0">
            {lang === 'BN' ? 'সাহায্য প্রয়োজন?' : 'Need Help?'}
          </span>
        )}
      </button>
    </div>
  );
}

const Trash2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
  </svg>
);

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
