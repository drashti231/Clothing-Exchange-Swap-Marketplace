import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Repeat2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SwapMatch = () => {
  const navigate = useNavigate();
  // Animation states: 'searching' -> 'found' -> 'swapping' -> 'done' -> repeat
  const [phase, setPhase] = useState('searching');

  useEffect(() => {
    let timeoutId;
    if (phase === 'searching') {
      timeoutId = setTimeout(() => setPhase('found'), 3000);
    } else if (phase === 'found') {
      timeoutId = setTimeout(() => setPhase('swapping'), 1500);
    } else if (phase === 'swapping') {
      timeoutId = setTimeout(() => setPhase('done'), 1500);
    } else if (phase === 'done') {
      timeoutId = setTimeout(() => setPhase('searching'), 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [phase]);

  const leftItem = {
    title: "Vintage Denim Jacket",
    category: "Outerwear",
    condition: "Good",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  };

  const rightItem = {
    title: "Floral Maxi Dress",
    category: "Dresses",
    condition: "Like New",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  };

  // Helper for floating labels
  const floatingLabels = [
    { text: "Size Match", top: "10%", left: "15%", delay: 0 },
    { text: "Style Match", top: "60%", left: "5%", delay: 1 },
    { text: "Great Condition", top: "20%", right: "10%", delay: 0.5 },
    { text: "Nearby", top: "70%", right: "15%", delay: 1.5 },
    { text: "Perfect Fit", top: "40%", left: "45%", delay: 2 },
  ];

  const getStatusText = () => {
    switch (phase) {
      case 'searching': return "Finding a compatible style...";
      case 'found': return "Perfect Match!";
      case 'swapping': return "Swapping...";
      case 'done': return "Ready to Swap ♻️";
      default: return "";
    }
  };

  const getHeadingText = () => {
    if (phase === 'searching') return "Searching for a match...";
    if (phase === 'found') return "Match Found! ✨";
    return "Ready to Swap ♻️";
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-24 sm:py-32 font-manrope">
      {/* Background Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center">
        <div className="absolute w-[800px] h-[800px] bg-[#9b87f5]/5 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-[500px] h-[500px] bg-[#FFC5C5]/10 rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-black text-[#1A1F2C] mb-6 tracking-tight"
          >
            Find Your Perfect Swap
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 font-medium"
          >
            One piece from your closet could be the perfect match for someone else.
          </motion.p>
        </div>

        {/* Interactive Animation Area */}
        <div className="relative w-full max-w-5xl h-[600px] sm:h-[500px] flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-24 mb-16">
          
          {/* Floating Labels */}
          <AnimatePresence>
            {phase === 'found' && floatingLabels.map((label, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: label.delay * 0.2, duration: 0.5 }}
                className="absolute z-0 hidden sm:flex px-4 py-2 bg-white/80 backdrop-blur-md border border-[#F1F1F1] rounded-full shadow-sm text-sm font-bold text-[#9b87f5]"
                style={{ top: label.top, left: label.left, right: label.right }}
              >
                {label.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Left Card */}
          <motion.div 
            animate={{
              x: phase === 'swapping' ? [0, 150, 0] : phase === 'done' ? 0 : 0,
              y: [0, -10, 0],
              scale: phase === 'found' ? 1.05 : 1
            }}
            transition={{ 
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 0.5 }
            }}
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
            className={`relative z-10 w-64 bg-white/80 backdrop-blur-xl rounded-[2rem] border overflow-hidden transition-all duration-500 group ${phase === 'found' ? 'border-[#9b87f5]/40 shadow-[0_0_30px_rgba(155,135,245,0.15)]' : 'border-[#E5E7EB] shadow-sm'}`}
          >
            <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm border border-gray-100">
              Your Item
            </div>
            <div className="h-72 overflow-hidden relative">
              <motion.img 
                src={phase === 'done' ? rightItem.image : leftItem.image} 
                alt="Item" 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{phase === 'done' ? rightItem.title : leftItem.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{phase === 'done' ? rightItem.category : leftItem.category}</p>
              <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
                {phase === 'done' ? rightItem.condition : leftItem.condition}
              </span>
            </div>
          </motion.div>

          {/* Center Indicator */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            <h4 className="absolute -top-16 text-xl font-bold text-gray-800 whitespace-nowrap hidden sm:block">
              {getHeadingText()}
            </h4>
            
            <motion.div 
              animate={{ 
                rotate: phase === 'swapping' ? 180 : 0,
                scale: phase === 'found' ? 1.2 : 1
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-500 shadow-md border-4 ${phase === 'found' || phase === 'done' ? 'bg-[#FFC5C5] text-[#1A1F2C] border-white' : 'bg-white text-gray-400 border-gray-50'}`}
            >
              <Repeat2 className="w-8 h-8" />
            </motion.div>
            
            <div className="absolute -bottom-10 flex flex-col items-center whitespace-nowrap">
              <span className="font-black tracking-widest text-[#1A1F2C] opacity-80">SWAP</span>
              <span className="text-sm font-medium text-gray-500 mt-1 sm:hidden">{getStatusText()}</span>
              <span className="text-sm font-medium text-gray-500 mt-1 hidden sm:block">{getStatusText()}</span>
            </div>

            {/* Particles */}
            <AnimatePresence>
              {phase === 'searching' && (
                <>
                  <motion.div animate={{ x: [-20, 20], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute w-2 h-2 bg-[#9b87f5] rounded-full left-0 top-1/4"></motion.div>
                  <motion.div animate={{ x: [20, -20], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} className="absolute w-2 h-2 bg-[#FFC5C5] rounded-full right-0 bottom-1/4"></motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Right Card */}
          <motion.div 
            animate={{
              x: phase === 'swapping' ? [0, -150, 0] : phase === 'done' ? 0 : 0,
              y: [0, -10, 0],
              scale: phase === 'found' ? 1.05 : 1
            }}
            transition={{ 
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              x: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 0.5 }
            }}
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
            className={`relative z-10 w-64 bg-white/80 backdrop-blur-xl rounded-[2rem] border overflow-hidden transition-all duration-500 group ${phase === 'found' ? 'border-[#FFC5C5]/60 shadow-[0_0_30px_rgba(255,197,197,0.2)]' : 'border-[#E5E7EB] shadow-sm'}`}
          >
            <div className="absolute top-4 right-4 z-20 bg-[#1A1F2C] backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm border border-[#1A1F2C]/50">
              Perfect Match
            </div>
            <div className="h-72 overflow-hidden relative">
              <motion.img 
                src={phase === 'done' ? leftItem.image : rightItem.image} 
                alt="Item" 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-1">{phase === 'done' ? leftItem.title : rightItem.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{phase === 'done' ? leftItem.category : rightItem.category}</p>
              <span className="inline-block px-3 py-1 bg-[#1A1F2C]/5 rounded-full text-xs font-bold text-[#1A1F2C]">
                {phase === 'done' ? leftItem.condition : rightItem.condition}
              </span>
            </div>
          </motion.div>

        </div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <button 
            onClick={() => navigate('/marketplace')}
            className="group relative flex items-center justify-center px-8 py-4 bg-[#1A1F2C] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Start Swapping <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default SwapMatch;
