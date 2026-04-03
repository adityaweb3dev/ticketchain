"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, MapPin, Users, ArrowUpRight, Loader2, Sparkles, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeb3 } from "@/context/Web3Context";
import { isError } from "ethers";

export default function Events() {
  const { events, buyTicket, isBlockchainMode } = useWeb3();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const handleBuy = async (eventId: string) => {
    setPurchasingId(eventId);
    try {
      await buyTicket(eventId);
    } catch (error) {
      if (isError(error, "ACTION_REJECTED")) {
        console.warn("Purchase cancelled by user.");
      } else {
        console.error("Purchase failed", error);
      }
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <section id="events" className="py-24 bg-white/[0.02] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[130px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider mb-4"
            >
              <Sparkles className="w-3 h-3" />
              Live on {isBlockchainMode ? "Sepolia" : "Mockchain"}
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 text-white"
            >
              Live <span className="text-gradient">Events</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-white/50 max-w-xl"
            >
              Explore the most anticipated events currently live on TicketChain. Secure your NFT ticket today.
            </motion.p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-full border border-white/10 text-white font-medium hover:bg-white/5 transition-all flex items-center gap-2"
          >
            View All Events
            <ArrowUpRight className="w-4 h-4" />
          </motion.button>
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
             <Loader2 className="w-10 h-10 text-white/20 animate-spin mb-4" />
             <p className="text-white/40 font-medium">No events found on the blockchain...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
                
                <div className="relative glass-card rounded-[2.5rem] overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={event.image || "/ticketchain-hero.png"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white">
                          WEB3
                        </span>
                    </div>
                    <div className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 font-bold text-white shadow-lg">
                      {event.price} ETH
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-white/50 text-sm">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-3 text-white/50 text-sm">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-3 text-white/50 text-sm">
                        <Ticket className="w-4 h-4 text-cyan-500" />
                        {event.soldCount} / {event.totalSupply} Sold
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleBuy(event.id)}
                      disabled={purchasingId === event.id}
                      className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-white group-hover:text-black"
                    >
                      {purchasingId === event.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Ticket className="w-5 h-5" />
                          Secure Ticket
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
