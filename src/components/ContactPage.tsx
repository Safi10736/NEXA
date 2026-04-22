import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 px-6 bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent mb-4 block">Get in touch</span>
          <h1 className="text-5xl md:text-7xl font-light text-neutral-900 mb-8 serif italic">Contact Us</h1>
          <p className="text-neutral-500 max-w-2xl mx-auto font-light leading-relaxed">
            Have a question about our collections or an existing order? Our concierge team is here to assist you with everything you need.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center text-brand-accent mb-6">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium mb-2 serif italic">Email Us</h3>
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest leading-loose">
                support@nexastore.com<br />
                concierge@nexastore.com
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center text-brand-accent mb-6">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium mb-2 serif italic">Call Us</h3>
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest leading-loose">
                +1 (800) 123-4567<br />
                Mon-Fri: 9am - 6pm EST
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center text-brand-accent mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium mb-2 serif italic">Visit Us</h3>
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest leading-loose">
                123 Luxury Lane<br />
                Manhattan, NY 10001
              </p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center text-brand-accent mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-medium mb-2 serif italic">Business Hours</h3>
              <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest leading-loose">
                Monday - Friday: 9-18<br />
                Saturday: 10-15
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-12 rounded-[4rem] border border-neutral-100 shadow-2xl">
            <form className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-6 py-4 bg-brand-surface border border-transparent rounded-full focus:bg-white focus:border-brand-accent focus:outline-none transition-all duration-300 text-sm"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-6 py-4 bg-brand-surface border border-transparent rounded-full focus:bg-white focus:border-brand-accent focus:outline-none transition-all duration-300 text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-2">How can we help?</label>
                <select className="w-full px-6 py-4 bg-brand-surface border border-transparent rounded-full focus:bg-white focus:border-brand-accent focus:outline-none transition-all duration-300 text-sm appearance-none">
                  <option>Order Inquiry</option>
                  <option>Product Information</option>
                  <option>Shipping & Returns</option>
                  <option>Wholesale</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 ml-2">Message</label>
                <textarea 
                  rows={5}
                  className="w-full px-6 py-6 bg-brand-surface border border-transparent rounded-[2rem] focus:bg-white focus:border-brand-accent focus:outline-none transition-all duration-300 text-sm resize-none"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <button className="w-full py-5 bg-neutral-900 text-white rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-accent hover:shadow-2xl hover:shadow-brand-accent/20 transition-all duration-500 flex items-center justify-center gap-3">
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="mt-32 text-center">
            <h2 className="text-3xl font-light mb-12 serif italic">Common Questions</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days within the country." },
                    { q: "What is your return policy?", a: "We offer a 30-day hassle-free return policy for all unused items." },
                    { q: "Can I cancel my order?", a: "Orders can be cancelled within 1 hour of placement via our dashboard." }
                ].map((item, i) => (
                    <div key={i} className="text-left p-8 border-l border-neutral-100">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-900 mb-4">{item.q}</h4>
                        <p className="text-neutral-500 text-xs font-light leading-relaxed">{item.a}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
