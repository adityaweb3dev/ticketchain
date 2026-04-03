"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useWeb3 } from "@/context/Web3Context";
import { Scan, ShieldCheck, XCircle, CheckCircle2, ArrowRight, Loader2, QrCode, Smartphone, Info, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function VerifyPage() {
  const { verifyTicket } = useWeb3();
  const [tokenId, setTokenId] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SCANNING" | "SUCCESS" | "ERROR">("IDLE");
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenId) return;

    setStatus("SCANNING");
    
    try {
      const verificationResponse = await verifyTicket(tokenId);
      setResult(verificationResponse);
      
      if (verificationResponse.isValid) {
        setStatus("SUCCESS");
      } else {
        setStatus("ERROR");
      }
    } catch (error: any) {
      console.error("Verification failed:", error);
      setResult({ isValid: false, message: error.message || "Blockchain verification error." });
      setStatus("ERROR");
    }
  };

  const handleReset = () => {
    setTokenId("");
    setStatus("IDLE");
    setResult(null);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Side: Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-8">
                <ShieldCheck className="w-8 h-8 text-purple-400" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Entry <br />
                <span className="text-gradient">Verification</span>
              </h1>
              <p className="text-white/40 text-lg mb-10 leading-relaxed">
                Connect your scanner or manually input the NFT Token ID to validate event entrance in real-time.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Smartphone className="w-4 h-4 text-blue-400" />
                   </div>
                   <span className="text-sm font-medium text-white/60">Supports handheld QR scanners</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                   <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                      <Lock className="w-4 h-4 text-cyan-400" />
                   </div>
                   <span className="text-sm font-medium text-white/60">Cryptographic ownership check</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Scanner / Input */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8"
          >
            <div className="glass-card p-10 rounded-[3rem] border border-white/10 relative overflow-hidden">
               <AnimatePresence mode="wait">
                  {status === "IDLE" ? (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                       <h2 className="text-2xl font-bold text-white mb-8">Scanner Interface</h2>
                       <form onSubmit={handleVerify} className="space-y-8">
                          <div className="flex flex-col gap-4">
                             <label className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">Manual Token ID Input</label>
                             <div className="relative">
                                <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50" />
                                <input 
                                  required
                                  type="text" 
                                  value={tokenId}
                                  onChange={(e) => setTokenId(e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-4 text-white text-lg font-mono focus:outline-none focus:border-purple-500/50 transition-all placeholder:text-white/10"
                                  placeholder="TCT-XXXXXX"
                                />
                             </div>
                          </div>
                          
                          <button 
                            type="submit"
                            className="w-full py-6 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                          >
                            Validate Ticket
                            <ArrowRight className="w-5 h-5" />
                          </button>
                       </form>
                       
                       <div className="mt-10 p-6 rounded-2xl border border-dashed border-white/10 flex items-center gap-4 group cursor-pointer hover:border-purple-500/50 transition-colors">
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                             <Scan className="w-6 h-6 text-purple-400" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-bold text-white leading-tight">Activate Camera</span>
                             <span className="text-xs text-white/30">Mobile QR scanner mode</span>
                          </div>
                       </div>
                    </motion.div>
                  ) : status === "SCANNING" ? (
                    <motion.div
                      key="scanning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                       <div className="relative w-48 h-48 rounded-[2.5rem] border-2 border-purple-500/30 flex items-center justify-center mb-10 overflow-hidden">
                          <motion.div 
                             animate={{ y: [0, 200, 0] }}
                             transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                             className="absolute top-0 left-0 right-0 h-1 bg-purple-400 shadow-[0_0_20px_#a855f7]"
                          />
                          <QrCode className="w-24 h-24 text-white/10" />
                       </div>
                       <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-6" />
                       <h3 className="text-2xl font-bold text-white mb-2">Verifying NFT...</h3>
                       <p className="text-white/30 font-mono text-sm tracking-widest">{tokenId}</p>
                    </motion.div>
                  ) : status === "SUCCESS" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-10"
                    >
                       <div className="w-24 h-24 rounded-full bg-green-500 shadow-[0_0_50px_rgba(34,197,94,0.4)] flex items-center justify-center mb-10">
                          <CheckCircle2 className="w-12 h-12 text-white" />
                       </div>
                       <h2 className="text-4xl font-extrabold text-white mb-2">ACCESS GRANTED</h2>
                       <p className="text-green-500/80 font-bold uppercase tracking-[0.2em] mb-12">Verified NFT Ticket</p>
                       
                       {result?.ticket?.event && (
                          <div className="w-full p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6 mb-12">
                             <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                                <Image src={result.ticket.event.image} alt="Event" fill className="object-cover" />
                             </div>
                             <div className="text-left">
                                <h4 className="text-xl font-bold text-white leading-tight mb-1">{result.ticket.event.title}</h4>
                                <p className="text-sm text-white/40">{result.ticket.event.location}</p>
                             </div>
                          </div>
                       )}

                       <button 
                         onClick={handleReset}
                         className="w-full py-5 rounded-3xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10"
                       >
                         Next Scan
                       </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-10"
                    >
                       <div className="w-24 h-24 rounded-full bg-red-500/10 border border-red-500/50 flex items-center justify-center mb-10">
                          <XCircle className="w-12 h-12 text-red-500" />
                       </div>
                       <h2 className="text-4xl font-extrabold text-white mb-2 uppercase">DENIED</h2>
                       <p className="text-red-500 font-bold uppercase tracking-[0.2em] mb-4">Verification Failed</p>
                       <p className="text-white/30 text-center max-w-xs mb-12 italic">
                         {result?.message || "Invalid or already used ticket on this address."}
                       </p>
                       
                       <button 
                         onClick={handleReset}
                         className="w-full py-5 rounded-3xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10"
                       >
                         Try Again
                       </button>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
            
            {/* Help Card */}
            <div className="p-8 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex gap-6">
               <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                  <Info className="w-6 h-6 text-indigo-400" />
               </div>
               <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-white text-lg leading-tight">Verification Tip</h4>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Always check the "Ownership Hash" to ensure the ticket is being presented by the rightful NFT owner.
                  </p>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
