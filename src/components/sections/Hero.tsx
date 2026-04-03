"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, Play, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const Ticket3D = dynamic(() => import("../3d/Ticket"), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-white/5 rounded-3xl animate-pulse" />
});

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section className="relative min-h-[100vh] flex items-center pt-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[150px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[100px] h-[100px] bg-cyan-400/10 blur-[60px] rounded-full animate-bounce duration-[10s] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-6 tracking-wider uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            V3.0 IS NOW LIVE
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 text-white"
          >
            The Future of <br />
            Event Ticketing is <br />
            <span className="text-gradient">On-Chain</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-lg leading-relaxed"
          >
            Buy, sell, and verify event tickets securely using NFT technology. 
            No more fraud, no more scalpers. Just pure, verifiable experiences.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/25 flex items-center gap-2">
              Explore Events
              <ChevronRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              How it works
            </button>
          </motion.div>

          {/* Stats / Proof */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 flex gap-8 items-center border-t border-white/5 pt-8"
          >
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">50k+</span>
              <span className="text-xs text-white/40 uppercase tracking-widest font-semibold font-mono">Tickets Sold</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">120+</span>
              <span className="text-xs text-white/40 uppercase tracking-widest font-semibold font-mono">Verified Events</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D Scene / Media Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="relative h-[500px] lg:h-[600px] w-full flex items-center justify-center pointer-events-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-blue-500/10 blur-[120px] rounded-full opacity-30" />
          <Ticket3D className="z-10" />
        </motion.div>
      </div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">Scroll to explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </section>
  );
}
