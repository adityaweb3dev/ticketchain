"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Ticket, Globe, RefreshCcw, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "NFT-Based Tickets",
    description: "Every ticket is a unique NFT on the blockchain, ensuring ownership and authenticity.",
    icon: Ticket,
    color: "from-purple-500 to-indigo-500",
  },
  {
    title: "Fraud Prevention",
    description: "Eliminate counterfeit tickets with cryptographic verification and smart contracts.",
    icon: ShieldCheck,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Instant Verification",
    description: "Scan QR codes for instant entry. No more manual check-ins or paper tickets.",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
  },
  {
    title: "Global Marketplace",
    description: "Resell your tickets safely in our secondary market withroyalty protection for organizers.",
    icon: Globe,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "Smart Resale",
    description: "Organizers can set price caps and earn royalties on every resale transaction.",
    icon: RefreshCcw,
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Secure Storage",
    description: "Tickets are stored in your wallet, accessible only by you, protected by blockchain.",
    icon: Lock,
    color: "from-violet-500 to-purple-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Built for the <span className="text-gradient">Next Generation</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-white/50 max-w-2xl mx-auto"
          >
            TicketChain leverages blockchain technology to solve the oldest problems in the ticketing industry.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="glass-card p-8 rounded-3xl group relative overflow-hidden"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
                feature.color
              )}>
                <feature.icon className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">
                {feature.description}
              </p>
              
              {/* Background Glow */}
              <div className={cn(
                "absolute -bottom-10 -right-10 w-32 h-32 blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity rounded-full bg-gradient-to-br",
                feature.color
              )} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
