"use client";

import React from "react";
import { motion } from "framer-motion";
import { PlusCircle, ShoppingBag, QrCode, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Create Event",
    description: "Organizers setup event details and mint tickets as limited edition NFTs.",
    icon: PlusCircle,
    color: "bg-purple-500",
  },
  {
    title: "Buy NFT Ticket",
    description: "Attendees purchase tickets using crypto, securing their spot on the blockchain.",
    icon: ShoppingBag,
    color: "bg-blue-500",
  },
  {
    title: "Scan & Enter",
    description: "Scan the dynamic QR code at the venue for instant, fraud-proof verification.",
    icon: QrCode,
    color: "bg-cyan-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            How it <span className="text-gradient">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-lg text-white/50 max-w-2xl mx-auto"
          >
            Three simple steps to transition from plastic tickets to digital assets.
          </motion.p>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-12 items-center justify-between">
          {/* Connection Line (Desktop) */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/0 via-white/10 to-blue-500/0 hidden lg:block -translate-y-12" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center max-w-xs group"
            >
              <div className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-2xl transition-all duration-500 group-hover:scale-110",
                step.color,
                "shadow-[0_0_50px_-5px_rgba(0,0,0,0.3)]"
              )}>
                <step.icon className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                {step.title}
              </h3>
              <p className="text-white/40 leading-relaxed">
                {step.description}
              </p>
              
              {/* Arrow Indicator (Mobile/Tablet) */}
              {index < steps.length - 1 && (
                <div className="lg:hidden mt-8 text-white/10">
                  <ArrowRight className="w-8 h-8 rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />
      </div>
    </section>
  );
}
