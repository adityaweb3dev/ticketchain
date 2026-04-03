"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Menu, X, Ticket, Compass, LayoutDashboard, Settings2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeb3 } from "@/context/Web3Context";

export default function Navbar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { address, connectWallet } = useWeb3();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Explore", href: "/events", icon: Compass },
    { name: "My Tickets", href: "/dashboard", icon: LayoutDashboard },
    { name: "Organizer", href: "/organizer", icon: Settings2 },
    { name: "Verify", href: "/verify", icon: ShieldCheck },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-4 py-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {/* Floating Desktop Navbar */}
        <motion.div 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "pointer-events-auto flex items-center justify-between w-full lg:w-max gap-8 px-5 py-4 rounded-[3rem] transition-all duration-700",
            isScrolled 
              ? "bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-[0.98]" 
              : "bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group mr-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all shadow-lg shadow-purple-500/20">
              <Ticket className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:block">
              Ticket<span className="text-gradient">Chain</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] p-1.5 rounded-full border border-white/5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2",
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 ml-auto lg:ml-2">
            <button
              onClick={connectWallet}
              className="hidden sm:flex relative group items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-bold transition-all hover:bg-white/10 active:scale-95 overflow-hidden min-w-[140px] justify-center"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              {!isMounted ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : address ? (
                <span className="flex items-center gap-2 relative z-10">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {`${address.substring(0, 6)}...${address.substring(
                    address.length - 4
                  )}`}
                </span>
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  <Wallet className="w-4 h-4" />
                  Connect
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-3 rounded-full bg-white/5 border border-white/10 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-28 left-4 right-4 pointer-events-auto bg-black/90 backdrop-blur-3xl border border-white/10 p-6 rounded-[2rem] lg:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl text-lg font-semibold transition-all",
                      isActive 
                        ? "bg-white/10 text-white" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-6 h-6" />
                    {link.name}
                  </Link>
                );
              })}
              <div className="h-px w-full bg-white/10 my-4" />
              <button
                onClick={() => {
                  connectWallet();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg shadow-purple-500/20"
              >
                {!isMounted ? (
                   <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    {address ? "Wallet Connected" : "Connect Wallet"}
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

}
