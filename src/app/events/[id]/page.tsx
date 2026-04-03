"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useWeb3 } from "@/context/Web3Context";
import { isError } from "ethers";
import { Calendar, MapPin, Users, Ticket, ArrowLeft, ShieldCheck, Zap, Lock, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { events, buyTicket, address } = useWeb3();
  const [isBuying, setIsBuying] = useState(false);
  const [buyStatus, setBuyStatus] = useState<"IDLE" | "SUCCESS" | "ERROR" | "CANCELLED">("IDLE");

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Event Not Found</h1>
          <button onClick={() => router.back()} className="text-purple-400 flex items-center gap-2 mx-auto justify-center group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handlePurchase = async () => {
    setIsBuying(true);
    try {
      await buyTicket(event.id);
      setBuyStatus("SUCCESS");
      // Redirect after a while
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } catch (error) {
      if (isError(error, "ACTION_REJECTED")) {
        setBuyStatus("CANCELLED");
      } else {
        setBuyStatus("ERROR");
      }
      setTimeout(() => setBuyStatus("IDLE"), 3000);
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8"
          >
            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10 right-10">
                 <div className="flex gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-purple-500 text-white text-[10px] font-bold tracking-widest uppercase">
                      NFT TICKET
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-bold tracking-widest uppercase">
                      COLLECTIBLE
                    </span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
                 <p className="text-white/60 text-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                 </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 rounded-3xl glass border border-white/5 flex flex-col gap-3">
                  <ShieldCheck className="w-6 h-6 text-purple-400" />
                  <h4 className="font-bold text-white text-sm">Anti-Fraud Guarantee</h4>
                  <p className="text-xs text-white/30">Verified on-chain signatures prevent all types of counterfeiting.</p>
               </div>
               <div className="p-6 rounded-3xl glass border border-white/5 flex flex-col gap-3">
                  <Zap className="w-6 h-6 text-blue-400" />
                  <h4 className="font-bold text-white text-sm">Instant Delivery</h4>
                  <p className="text-xs text-white/30">Your ticket is minted directly to your wallet after purchase.</p>
               </div>
            </div>
          </motion.div>

          {/* Right: Info & Purchase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="glass-card p-10 rounded-[3rem] border border-white/10">
              <div className="mb-10">
                 <h2 className="text-3xl font-bold text-white mb-4">Event Overview</h2>
                 <p className="text-white/50 leading-relaxed text-lg">
                    {event.description} Join thousands of others for this landmark event. 
                    This exclusive NFT ticket guarantees your entry and includes potential future airdrops.
                 </p>
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-white/40 uppercase tracking-widest mb-1">Ticket Price</span>
                      <span className="text-4xl font-extrabold text-white">{event.price} ETH</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-white/40 uppercase tracking-widest mb-1">Availability</span>
                      <span className="text-xl font-bold text-purple-400">{event.totalSupply - event.soldCount} Left</span>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-white/60">
                    <Calendar className="w-5 h-5 text-purple-500/60" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60">
                    <Users className="w-5 h-5 text-blue-500/60" />
                    <span className="font-medium">{event.soldCount} people attending</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="space-y-6 relative">
                <AnimatePresence mode="wait">
                  {buyStatus === "IDLE" ? (
                    <motion.button
                      key="buy"
                      onClick={handlePurchase}
                      disabled={isBuying}
                      className={cn(
                        "w-full py-6 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-500/20 flex items-center justify-center gap-3",
                        isBuying && "opacity-80 cursor-wait"
                      )}
                    >
                      {isBuying ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Confirming Transaction...
                        </>
                      ) : (
                        <>
                          <Ticket className="w-6 h-6" />
                          Buy NFT Ticket
                        </>
                      )}
                    </motion.button>
                  ) : buyStatus === "SUCCESS" ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full py-6 rounded-3xl bg-green-500/10 border border-green-500/50 text-green-500 text-xl font-bold flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      Ticket Secured!
                    </motion.div>
                  ) : buyStatus === "ERROR" ? (
                    <motion.div
                      key="error"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full py-6 rounded-3xl bg-red-500/10 border border-red-500/50 text-red-500 text-xl font-bold flex items-center justify-center gap-3"
                    >
                      Transaction Failed
                    </motion.div>
                  ) : (
                    <motion.div
                      key="cancelled"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full py-6 rounded-3xl bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-xl font-bold flex items-center justify-center gap-3"
                    >
                      <XCircle className="w-6 h-6" />
                      Transaction Cancelled
                    </motion.div>
                  )}
                </AnimatePresence>

                {!address && (
                  <p className="text-center text-white/30 text-sm">
                    Connecting wallet might be required before purchase.
                  </p>
                )}
                
                <div className="flex items-center justify-center gap-2 mt-8 py-4 px-6 rounded-2xl bg-white/5 border border-white/10">
                   <Lock className="w-4 h-4 text-white/30" />
                   <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">Secure On-Chain Transaction</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
