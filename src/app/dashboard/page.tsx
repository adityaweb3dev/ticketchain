"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useWeb3 } from "@/context/Web3Context";
import { Ticket as TicketIcon, Calendar, MapPin, QrCode, ArrowUpRight, History, Wallet, User, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { userTickets, events, address } = useWeb3();
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  const getEventData = (eventId: string) => events.find(e => e.id === eventId);

  if (!address) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] px-6">
           <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
              <User className="w-10 h-10 text-white/20" />
           </div>
           <h1 className="text-3xl font-bold text-white mb-4">Connection Required</h1>
           <p className="text-white/40 text-center max-w-sm mb-10">Please connect your wallet to view your owned NFT tickets and account history.</p>
           <button 
             onClick={() => window.scrollTo(0,0)} 
             className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold"
           >
             Go to Connect
           </button>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Profile Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
           <div className="p-8 rounded-[2rem] glass border border-white/5 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/20">
                <TicketIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-white/30 uppercase tracking-widest">My Tickets</span>
                 <span className="text-3xl font-extrabold text-white">{userTickets.length}</span>
              </div>
           </div>
           <div className="p-8 rounded-[2rem] glass border border-white/5 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/20">
                <History className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Transactions</span>
                 <span className="text-3xl font-extrabold text-white">{userTickets.length}</span>
              </div>
           </div>
           <div className="p-8 rounded-[2rem] glass border border-white/5 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/20">
                <Wallet className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Wallet</span>
                 <span className="text-sm font-bold text-white truncate max-w-[120px]">{address}</span>
              </div>
           </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              My <span className="text-gradient">NFT Tickets</span>
            </motion.h1>
            <p className="text-white/40 text-lg">
              Manage your owned tickets and access QR codes for event check-in.
            </p>
          </div>
        </div>

        {userTickets.length === 0 ? (
          <div className="p-16 rounded-[3rem] glass-card border border-white/5 text-center flex flex-col items-center">
             <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                <TicketIcon className="w-10 h-10 text-white/10" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">No tickets found</h3>
             <p className="text-white/30 mb-8">You haven't purchased any tickets yet. Explore current events to get started.</p>
             <Link 
              href="/events"
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
             >
               Browse Events
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userTickets.map((ticket, index) => {
              const eventData = getEventData(ticket.eventId);
              if (!eventData) return null;
              
              return (
                <motion.div
                  key={ticket.tokenId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all duration-500">
                    <div className="relative h-40 overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                      <Image
                        src={eventData.image}
                        alt={eventData.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                    </div>
                    
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-purple-400">NFT Token ID</span>
                          <span className="text-sm font-mono text-white/80">{ticket.tokenId}</span>
                        </div>
                        {ticket.isUsed ? (
                          <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-white/30 tracking-widest uppercase">
                            USED
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-green-500/10 text-[10px] font-bold text-green-500 tracking-widest uppercase">
                            VALID
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-6 leading-tight truncate">
                        {eventData.title}
                      </h3>

                      <div className="space-y-3 mb-8">
                         <div className="flex items-center gap-3 text-white/40 text-xs">
                           <Calendar className="w-3 h-3" />
                           {eventData.date}
                         </div>
                         <div className="flex items-center gap-3 text-white/40 text-xs">
                           <MapPin className="w-3 h-3" />
                           {eventData.location}
                         </div>
                      </div>

                      <button 
                        onClick={() => setSelectedTicket({ ...ticket, event: eventData })}
                        disabled={ticket.isUsed}
                        className={cn(
                          "w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all",
                          ticket.isUsed 
                            ? "bg-white/5 text-white/20 cursor-not-allowed" 
                            : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-purple-500/50"
                        )}
                      >
                        <QrCode className="w-4 h-4" />
                        Access QR Ticket
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />

      {/* QR Modal Overlay */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedTicket(null)}
               className="absolute inset-0 bg-black/80 backdrop-blur-md"
             />
             
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-[400px] glass-card rounded-[3rem] p-10 border border-white/10 flex flex-col items-center"
             >
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/40 hover:text-white"
                >
                   <X className="w-6 h-6" />
                </button>
                
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-8 mt-4">
                  <ShieldCheck className="w-6 h-6 text-purple-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{selectedTicket.event.title}</h2>
                <p className="text-white/40 text-sm mb-10">Scan at the entrance for entry.</p>
                
                <div className="p-8 rounded-[2.5rem] bg-white flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                   <QRCodeSVG 
                    value={selectedTicket.tokenId} 
                    size={220} 
                    level={"H"} 
                    includeMargin={true}
                    fgColor="#000000"
                   />
                </div>
                
                <div className="flex flex-col items-center gap-1">
                   <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Ownership Hash</span>
                   <span className="text-xs font-mono text-purple-400/60 truncate max-w-[200px]">
                      {address}
                   </span>
                </div>
                
                <div className="mt-10 w-full p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Active NFT Ticket</span>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
