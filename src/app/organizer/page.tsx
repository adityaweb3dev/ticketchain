"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useWeb3 } from "@/context/Web3Context";
import { PlusCircle, TrendingUp, Users, Ticket, BarChart3, Settings, Calendar, MapPin, Search, ArrowRight, Loader2, DollarSign, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrganizerDashboard() {
  const { events, address, createEvent } = useWeb3();
  const [isCreating, setIsCreating] = useState(false);
  
  // Filter events created by the current address
  const myEvents = events.filter(e => e.organizer.toLowerCase() === address?.toLowerCase());
  
  const totalRevenue = myEvents.reduce((acc, e) => acc + (parseFloat(e.price) * e.soldCount), 0);
  const totalTicketsSold = myEvents.reduce((acc, e) => acc + e.soldCount, 0);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "0.01",
    date: "",
    location: "",
    totalSupply: 100,
    image: "/event1.png", // Default for demo
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      await createEvent(formData);
      (document.getElementById('create-modal') as HTMLDialogElement).close();
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to deploy event to blockchain. Check your wallet.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!address) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex flex-col items-center justify-center min-h-[60vh] px-6">
           <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
              <PlusCircle className="w-10 h-10 text-white/20" />
           </div>
           <h1 className="text-3xl font-bold text-white mb-4">Organizer Login</h1>
           <p className="text-white/40 text-center max-w-sm mb-10">Connect your wallet to manage your events, track sales, and mint new NFT tickets.</p>
           <button onClick={() => window.scrollTo(0,0)} className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold">
             Connect Wallet
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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Organizer <span className="text-gradient">Hub</span>
            </motion.h1>
            <p className="text-white/40 text-lg">
              Monitor your event sales and manage your on-chain ticket collections.
            </p>
          </div>
          <button 
            onClick={() => (document.getElementById('create-modal') as HTMLDialogElement).showModal()}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
          >
            <PlusCircle className="w-5 h-5" />
            Create New Event
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
           <div className="p-8 rounded-[2rem] glass border border-white/5 flex flex-col gap-2">
              <DollarSign className="w-6 h-6 text-green-400 mb-2" />
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Total Revenue</span>
              <span className="text-3xl font-extrabold text-white">{totalRevenue.toFixed(2)} ETH</span>
              <span className="text-[10px] text-green-400 font-bold flex items-center gap-1 mt-2">
                 <TrendingUp className="w-3 h-3" /> +12% from last week
              </span>
           </div>
           <div className="p-8 rounded-[2rem] glass border border-white/5 flex flex-col gap-2">
              <Users className="w-6 h-6 text-blue-400 mb-2" />
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Tickets Sold</span>
              <span className="text-3xl font-extrabold text-white">{totalTicketsSold}</span>
              <span className="text-xs text-white/20 mt-2 font-medium">Across {myEvents.length} active events</span>
           </div>
           <div className="p-8 rounded-[2rem] glass border border-white/5 flex flex-col gap-2">
              <Ticket className="w-6 h-6 text-purple-400 mb-2" />
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Remaining Supply</span>
              <span className="text-3xl font-extrabold text-white">
                {myEvents.reduce((acc, e) => acc + (e.totalSupply - e.soldCount), 0)}
              </span>
              <span className="text-xs text-white/20 mt-2 font-medium">Out of {myEvents.reduce((acc, e) => acc + e.totalSupply, 0)} total</span>
           </div>
           <div className="p-8 rounded-[2rem] glass border border-white/5 flex flex-col gap-2">
              <TrendingUp className="w-6 h-6 text-cyan-400 mb-2" />
              <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Growth</span>
              <span className="text-3xl font-extrabold text-white">2.4x</span>
              <span className="text-xs text-white/20 mt-2 font-medium">Month over month</span>
           </div>
        </div>

        {/* Events Table / List */}
        <div className="glass-card rounded-[3rem] border border-white/10 overflow-hidden">
           <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <h3 className="text-2xl font-bold text-white">My Active Collections</h3>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Filter collections..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:outline-none"
                />
              </div>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="border-b border-white/5">
                      <th className="px-10 py-6 text-xs font-bold text-white/20 uppercase tracking-widest">Event Name</th>
                      <th className="px-6 py-6 text-xs font-bold text-white/20 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-6 text-xs font-bold text-white/20 uppercase tracking-widest">Sales</th>
                      <th className="px-6 py-6 text-xs font-bold text-white/20 uppercase tracking-widest">Revenue</th>
                      <th className="px-6 py-6 text-xs font-bold text-white/20 uppercase tracking-widest">Status</th>
                      <th className="px-10 py-6 text-xs font-bold text-white/20 uppercase tracking-widest text-right">Action</th>
                   </tr>
                </thead>
                <tbody>
                   {myEvents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-10 py-20 text-center text-white/20 italic">
                          No events found. Start by creating your first NFT collection.
                        </td>
                      </tr>
                   ) : (
                      myEvents.map((event) => (
                        <tr key={event.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="relative w-12 h-12 rounded-xl border border-white/10 overflow-hidden">
                                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                                 </div>
                                 <span className="font-bold text-white">{event.title}</span>
                              </div>
                           </td>
                           <td className="px-6 py-6 text-sm text-white/50">{event.date}</td>
                           <td className="px-6 py-6">
                              <div className="flex flex-col gap-2">
                                 <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest">
                                    <span>{event.soldCount} Sold</span>
                                    <span>{((event.soldCount / event.totalSupply) * 100).toFixed(0)}%</span>
                                 </div>
                                 <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-purple-500" 
                                      style={{ width: `${(event.soldCount / event.totalSupply) * 100}%` }} 
                                    />
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-6 font-mono text-purple-400 font-bold">
                             {(parseFloat(event.price) * event.soldCount).toFixed(3)} ETH
                           </td>
                           <td className="px-6 py-6">
                              <span className="px-3 py-1 rounded-full bg-green-500/10 text-[10px] font-bold text-green-500 tracking-widest uppercase">
                                Active
                              </span>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors">
                                 <Settings className="w-5 h-5" />
                              </button>
                           </td>
                        </tr>
                      ))
                   )}
                </tbody>
             </table>
           </div>
        </div>
      </div>

      {/* Create Event Modal */}
      <dialog id="create-modal" className="modal bg-transparent p-0">
         <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="bg-[#0a0a0a] w-full max-w-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative"
            >
               <button 
                onClick={() => (document.getElementById('create-modal') as HTMLDialogElement).close()}
                className="absolute top-8 right-8 p-3 rounded-full bg-white/5 text-white/40 hover:text-white z-10"
               >
                  <X className="w-6 h-6" />
               </button>

               <div className="p-10 pt-16">
                  <h2 className="text-4xl font-bold text-white mb-2">Create <span className="text-gradient">NFT Collection</span></h2>
                  <p className="text-white/40 text-lg mb-10">Configure your event and mint initial ticket tokens.</p>

                  <form onSubmit={handleCreate} className="space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">Event Title</label>
                           <input 
                            required
                            type="text" 
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50"
                            placeholder="Interstellar Music Festival"
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                           />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">Location</label>
                           <input 
                            required
                            type="text" 
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50"
                            placeholder="Metaverse Plaza, Layer 1"
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">Date & Time</label>
                           <input 
                            required
                            type="date" 
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50"
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                           />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">Ticket Price (ETH)</label>
                           <input 
                            required
                            type="number" 
                            step="0.001"
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50"
                            placeholder="0.05"
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                           />
                        </div>
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-white/30 tracking-[0.2em] uppercase">Event Description</label>
                        <textarea 
                         required
                         rows={4}
                         className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50 resize-none"
                         placeholder="Describe the event experiences and NFT utility..."
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                     </div>

                     <button 
                        disabled={isCreating}
                        type="submit"
                        className="w-full py-6 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                     >
                        {isCreating ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Deploying to Blockchain...
                          </>
                        ) : (
                          <>
                            <Zap className="w-6 h-6" />
                            Deploy Official Event
                          </>
                        )}
                     </button>
                  </form>
               </div>
            </motion.div>
         </div>
      </dialog>

      <Footer />
    </main>
  );
}
