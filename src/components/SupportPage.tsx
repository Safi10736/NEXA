import React from 'react';
import { motion } from 'motion/react';
import { Shield, Truck, RotateCcw, Lock, CreditCard, HelpCircle } from 'lucide-react';

export default function SupportPage() {
  const sections = [
    {
      id: 'shipping',
      icon: <Truck className="w-6 h-6" />,
      title: 'Shipping Info',
      content: `
        We offer premium shipping services across the globe. Every order is meticulously packaged to ensure your luxury items arrive in pristine condition.
        
        - Standard Delivery: 3-5 Business Days
        - Express Delivery: 1-2 Business Days
        - International Shipping: 7-14 Business Days
        
        All orders over $500 qualify for complimentary white-glove delivery service. Tracking information will be emailed as soon as your order leaves our atelier.
      `
    },
    {
      id: 'returns',
      icon: <RotateCcw className="w-6 h-6" />,
      title: 'Returns & Exchanges',
      content: `
        Your satisfaction is our ultimate priority. If you are not completely satisfied with your purchase, we offer a seamless return process.
        
        - 30-Day Return Window
        - Items must be in original, unused condition
        - Complimentary return shipping for regular-priced items
        - Exchanges are processed within 24 hours of receiving the return
        
        To initiate a return, please visit our online portal or contact our concierge team.
      `
    },
    {
      id: 'privacy',
      icon: <Lock className="w-6 h-6" />,
      title: 'Privacy Policy',
      content: `
        We believe in total transparency when it comes to your data. Your information is encrypted using industry-standard protocols and is never shared with third parties for marketing purposes.
        
        - We only collect data necessary for transaction processing and fulfillment
        - Our website uses high-level SSL encryption
        - You have full control over your data through your account settings
        
        Our privacy commitment is built on the same integrity as our handcrafted products.
      `
    },
    {
      id: 'terms',
      icon: <Shield className="w-6 h-6" />,
      title: 'Terms of Service',
      content: `
        By using Nexa, you agree to our terms of service designed to protect both the artisan and the collector.
        
        - All designs are proprietary to Nexa Luxury
        - Prices are subject to change based on raw material availability
        - Custom orders require written confirmation
        
        We strive for fairness and excellence in every interaction.
      `
    }
  ];

  return (
    <div className="pt-32 pb-24 px-6 bg-brand-bg min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent mb-4 block">Help Center</span>
          <h1 className="text-5xl md:text-7xl font-light text-neutral-900 mb-8 serif italic">Support & Policy</h1>
          <p className="text-neutral-500 font-light leading-relaxed">
            Everything you need to know about our services, shipping benchmarks, and safety protocols.
          </p>
        </motion.div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              id={section.id}
              className="bg-white p-12 rounded-[3.5rem] border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-14 h-14 bg-brand-surface rounded-2xl flex items-center justify-center text-brand-gold">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-medium serif italic text-neutral-900">{section.title}</h2>
              </div>
              <div className="prose prose-neutral max-w-none">
                <div className="text-neutral-500 font-light leading-loose whitespace-pre-wrap text-sm">
                  {section.content.trim()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-20 bg-neutral-900 rounded-[3rem] p-12 text-center text-white"
        >
            <HelpCircle className="w-12 h-12 text-brand-accent mx-auto mb-6" />
            <h2 className="text-3xl font-light mb-4 serif italic">Still have questions?</h2>
            <p className="text-white/60 text-sm mb-10 max-w-md mx-auto leading-relaxed">
                Our team is always ready to help you with any specific queries you might have.
            </p>
            <a 
                href="/contact"
                className="inline-block py-4 px-10 bg-white text-neutral-900 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-brand-accent hover:text-white transition-all duration-500"
            >
                Contact Concierge
            </a>
        </motion.div>
      </div>
    </div>
  );
}
