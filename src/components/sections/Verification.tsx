"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, XCircle, Scan, Zap, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const verificationStatus = {
  IDLE: "IDLE",
  SCANNING: "SCANNING",
  SUCCESS: "SUCCESS",
};

export default function Verification() {
  const [status, setStatus] = useState(verificationStatus.IDLE);

  const handleScan = () => {
    setStatus(verificationStatus.SCANNING);
    setTimeout(() => {
      setStatus(verificationStatus.SUCCESS);
    }, 2500);
  };

  const reset = () => setStatus(verificationStatus.IDLE);

  return (
    <section id="verify" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Text Content */}
          <div className="flex flex-col">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight"
            >
              Zero-Trust <br />
              <span className="text-gradient">Verification</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-white/50 mb-10 max-w-lg leading-relaxed"
            >
              Our proprietary scanning technology validates the ticket's signature, metadata, and ownership in real-time. 
              Say goodbye to fake tickets and duplicate QR codes.
            </motion.p>
            
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <ShieldCheck className="text-purple-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Cryptographic Proof</h4>
                  <p className="text-sm text-white/40">Secured by RSA-based signatures on every ticket.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Zap className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Instant Entry</h4>
                  <p className="text-sm text-white/40">Sub-second validation even in offline environments.</p>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleScan}
              disabled={status !== verificationStatus.IDLE}
              className={cn(
                "w-fit px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all",
                status === verificationStatus.IDLE 
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20"
                  : "bg-white/5 text-white/40 cursor-not-allowed"
              )}
            >
              <Scan className="w-5 h-5" />
              Run Demo Scan
            </motion.button>
          </div>

          {/* Visual UI Mockup */}
          <div className="relative flex items-center justify-center">
            {/* Phone Mockup Frame */}
            <div className="w-full max-w-[320px] aspect-[1/2] rounded-[3rem] border-[8px] border-white/5 bg-[#0a0a0a] shadow-[0_0_100px_rgba(168,85,247,0.1)] relative overflow-hidden z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/5 rounded-b-2xl z-20" />
              
              <div className="p-8 pt-12">
                <AnimatePresence mode="wait">
                  {status === verificationStatus.IDLE && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full text-center"
                    >
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-8">
                        <Scan className="w-8 h-8 text-white/20" />
                      </div>
                      <p className="text-white/40 text-sm">Ready to scan ticket</p>
                    </motion.div>
                  )}

                  {status === verificationStatus.SCANNING && (
                    <motion.div
                      key="scanning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full text-center"
                    >
                      <div className="relative w-48 h-48 rounded-2xl border-2 border-purple-500/50 flex items-center justify-center mb-10 overflow-hidden">
                        <motion.div 
                          initial={{ y: -100 }}
                          animate={{ y: 200 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                        />
                        <QrCodeSVG className="w-32 h-32 text-white/80" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce delay-200" />
                      </div>
                      <p className="text-white font-bold mt-4">Verifying NFT...</p>
                    </motion.div>
                  )}

                  {status === verificationStatus.SUCCESS && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full text-center"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                      >
                        <CheckCircle2 className="w-12 h-12 text-white" />
                      </motion.div>
                      <h4 className="text-2xl font-bold text-white mb-2">Verified!</h4>
                      <p className="text-white/40 text-sm mb-12">Access Granted to VIP Zone</p>
                      <button 
                        onClick={reset}
                        className="px-6 py-2 rounded-full bg-white/5 text-white/40 text-xs font-semibold hover:bg-white/10"
                      >
                        Scan Another
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

function QrCodeSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      <path d="M7 7h.01M17 7h.01M17 17h.01M7 17h.01" />
    </svg>
  );
}
