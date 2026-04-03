"use client";

import React from "react";
import Link from "next/link";
import { Globe, ExternalLink, Mail, Wallet } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-20 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6 col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Wallet className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Ticket<span className="text-gradient">Chain</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-[240px]">
              The next generation of event ticketing, secured by the blockchain.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <ExternalLink className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em]">Platform</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#events" className="text-sm text-white/40 hover:text-white transition-colors">Explore Events</Link></li>
              <li><Link href="#features" className="text-sm text-white/40 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#how-it-works" className="text-sm text-white/40 hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="#verify" className="text-sm text-white/40 hover:text-white transition-colors">Verification</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em]">Resources</h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="#" className="text-sm text-white/40 hover:text-white transition-colors">System Status</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-[0.2em]">Join the Waitlist</h4>
            <p className="text-sm text-white/40 mb-6 leading-relaxed">
              Be the first to know about new drops and features.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@example.com"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors w-full"
              />
              <button className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.1em] font-medium">
            © 2026 TicketChain Labs. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] text-white/20 uppercase tracking-[0.1em] font-medium hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[10px] text-white/20 uppercase tracking-[0.1em] font-medium hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-[10px] text-white/20 uppercase tracking-[0.1em] font-medium hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
