import React from "react";
import Navbar from "@/components/ui/Navbar";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import Features from "@/components/sections/Features";
import HowItWorks from "@/components/sections/HowItWorks";
import Events from "@/components/sections/Events";
import Verification from "@/components/sections/Verification";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />
      
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/ticketchain-hero.png"
        bgImageSrc="/ticketchain-bg.png"
        title="TicketChain Ecosystem"
        date="Web3 Live Events"
        scrollToExpand="Scroll to Enter"
      >
        <div className="space-y-0 relative z-10 w-full mt-20">
          <Features />
          <HowItWorks />
          <Events />
          <Verification />
        </div>
      </ScrollExpandMedia>

      <Footer />
    </main>
  );
}
