"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useWeb3 } from "@/context/Web3Context";
import { Calendar, MapPin, Users, Ticket, ArrowRight, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const { events } = useWeb3();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              Explore <span className="text-gradient">Events</span>
            </motion.h1>
            <p className="text-white/50 text-lg">
              Find and purchase NFT tickets for the hottest global events.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input 
                type="text" 
                placeholder="Search events..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group glass-card rounded-[2.5rem] overflow-hidden flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest font-bold text-white">
                    LIVE NOW
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  <div className="text-purple-400 font-bold font-mono">
                    {event.price} ETH
                  </div>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-white/40 text-sm">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-3 text-white/40 text-sm">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-3 text-white/40 text-sm">
                    <Ticket className="w-4 h-4 text-purple-500/60" />
                    {event.soldCount} / {event.totalSupply} Sold
                  </div>
                </div>

                <div className="mt-auto">
                   {/* Progress Bar */}
                   <div className="w-full h-1.5 bg-white/5 rounded-full mb-6 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(event.soldCount / event.totalSupply) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      />
                   </div>

                   <Link 
                    href={`/events/${event.id}`}
                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all hover:border-purple-500/50 group/btn"
                   >
                    View Details
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
