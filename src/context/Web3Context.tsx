"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { ethers, isError } from "ethers";

import TicketChainABI from "@/constants/TicketChain.json";

// Update this address after deployment
const CONTRACT_ADDRESS = "0xeB7448587AAb5C69249F5553647d620459b567C5"; 

interface Event {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  date: string;
  location: string;
  totalSupply: number;
  soldCount: number;
  organizer: string;
}

interface Ticket {
  tokenId: string;
  eventId: string;
  owner: string;
  isUsed: boolean;
  purchaseDate: string;
}

interface Web3ContextType {
  address: string | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  events: Event[];
  userTickets: Ticket[];
  createEvent: (eventData: Omit<Event, "id" | "soldCount" | "organizer">) => Promise<void>;
  buyTicket: (eventId: string) => Promise<void>;
  verifyTicket: (tokenId: string) => Promise<{ isValid: boolean; message: string; ticket?: Ticket & { event?: Event } }>;
  isBlockchainMode: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const MOCK_INITIAL_EVENTS: Event[] = [
  {
    id: "1",
    title: "Cyberpunk Fest 2026",
    description: "The ultimate music and tech experience in Neo-Tokyo.",
    price: "0.05",
    image: "/event1.png",
    date: "Dec 12, 2026",
    location: "Neo Tokyo, Digital District",
    totalSupply: 500,
    soldCount: 120,
    organizer: "0x123...456"
  }
];

export function Web3Provider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [userTickets, setUserTickets] = useState<Ticket[]>([]);
  const [isBlockchainMode, setIsBlockchainMode] = useState(false);

  // Helpers to get providers
  const getReadProvider = useCallback(async () => {
    const isSepolia = CONTRACT_ADDRESS?.toLowerCase() === "0xeb7448587aab5c69249f5553647d620459b567c5";
    
    if (isSepolia) {
      const SEPOLIA_RPCS = [
        "https://ethereum-sepolia-rpc.publicnode.com",
        "https://sepolia.drpc.org",
        "https://rpc.ankr.com/eth_sepolia",
        "https://rpc2.sepolia.org"
      ];

      for (const url of SEPOLIA_RPCS) {
        try {
          console.log(`Web3Context: Trying Sepolia RPC: ${url}`);
          const provider = new ethers.JsonRpcProvider(url, undefined, { staticNetwork: true });
          // Test the provider
          await provider.getNetwork();
          console.log(`Web3Context: Successfully connected to: ${url}`);
          return provider;
        } catch (e) {
          console.warn(`Web3Context: RPC ${url} failed. Trying next...`);
        }
      }
      throw new Error("All Sepolia RPCs failed. Please check your internet connection.");
    }
    
    // Default to local
    return new ethers.JsonRpcProvider("http://127.0.0.1:8545", undefined, { staticNetwork: true });
  }, []);

  const getBrowserProvider = useCallback(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) return null;
    return new ethers.BrowserProvider((window as any).ethereum);
  }, []);

  // Helper to get contract instance
  const getContract = useCallback(async (withSigner = false) => {
    if (!CONTRACT_ADDRESS) return null;
    
    const browserProvider = getBrowserProvider();
    
    // Always prioritize Browser Provider for all operations if wallet is connected 
    // and correctly set up on the right network.
    if (browserProvider && address) {
      try {
        const network = await browserProvider.getNetwork();
        const expectedChainId = CONTRACT_ADDRESS.toLowerCase() === "0xeb7448587aab5c69249f5553647d620459b567c5" ? 11155111 : 31337;
        
        if (Number(network.chainId) === expectedChainId) {
          if (withSigner) {
            const signer = await browserProvider.getSigner();
            return new ethers.Contract(CONTRACT_ADDRESS, TicketChainABI.abi, signer);
          }
          return new ethers.Contract(CONTRACT_ADDRESS, TicketChainABI.abi, browserProvider);
        }
      } catch (err) {
        console.warn("Browser provider failed, falling back to JSON-RPC", err);
      }
    }

    // Signer requested but browser provider is not available or on wrong network
    if (withSigner) {
      if (!browserProvider) {
         alert("Please install MetaMask!");
         return null;
      }
      alert("Please switch your MetaMask to the correct network (Sepolia or Hardhat Local).");
      return null;
    }

    // Fallback to resilient read-only provider
    try {
      const readProvider = await getReadProvider();
      return new ethers.Contract(CONTRACT_ADDRESS, TicketChainABI.abi, readProvider);
    } catch (e) {
      console.error("Web3Context: Failed to get a working read provider.", e);
      return null;
    }
  }, [getReadProvider, getBrowserProvider, address]);

  const fetchBlockchainData = useCallback(async () => {
    // Try to get a contract instance (this will now try BrowserProvider first if connected)
    const contract = await getContract();
    
    if (!contract) {
      console.warn("Web3Context: Could not initialize blockchain contract. Falling back to Mock Mode.");
      setIsBlockchainMode(false);
      return;
    }

    try {
      console.log("Web3Context: Syncing with contract at", CONTRACT_ADDRESS);
      const allEvents = await contract.getEvents();
      console.log(`Web3Context: Successfully fetched ${allEvents?.length || 0} events from blockchain.`);
      setIsBlockchainMode(true);
      
      const formattedEvents: Event[] = (allEvents || []).map((e: any) => {
        const dateObj = new Date(Number(e.date) * 1000);
        return {
          id: e.id.toString(),
          title: e.title,
          description: e.description,
          price: ethers.formatEther(e.price),
          image: e.imageUri,
          date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          location: e.location,
          totalSupply: Number(e.totalSupply),
          soldCount: Number(e.soldCount),
          organizer: e.organizer
        };
      });
      setEvents(formattedEvents);

      // Fetch User Tickets if connected
      if (address) {
        try {
          const ticketIds = await contract.getUserTickets(address);
          const tickets: Ticket[] = await Promise.all(
            ticketIds.map(async (id: any) => {
              const detail = await contract.getTicketDetails(id);
              const owner = await contract.ownerOf(id);
              return {
                tokenId: id.toString(),
                eventId: detail.eventId.toString(),
                owner: owner,
                isUsed: detail.isUsed,
                purchaseDate: new Date(Number(detail.purchaseTime) * 1000).toISOString()
              };
            })
          );
          setUserTickets(tickets);
        } catch (ticketError) {
          console.warn("Could not fetch user tickets:", ticketError);
        }
      }
    } catch (error) {
      console.warn("Blockchain sync unavailable (Node may be offline). Falling back to Mock Mode.", error);
      setIsBlockchainMode(false);
      // Let it fall back to Mock logic in useEffect
    }
  }, [getContract, address]);

  // Initial Load & Fallback
  useEffect(() => {
    if (isBlockchainMode) return;

    // Load Mock Data if not in blockchain mode
    const savedEvents = localStorage.getItem("ticketchain_events");
    setEvents(savedEvents ? JSON.parse(savedEvents) : MOCK_INITIAL_EVENTS);
    
    if (address) {
      const savedTickets = localStorage.getItem("ticketchain_tickets");
      if (savedTickets) {
        const filtered = JSON.parse(savedTickets).filter((t: Ticket) => t.owner.toLowerCase() === address.toLowerCase());
        setUserTickets(filtered);
      }
    }
  }, [isBlockchainMode, address]);

  useEffect(() => {
    if (CONTRACT_ADDRESS) {
      fetchBlockchainData();
    }
  }, [fetchBlockchainData]);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const balanceVal = await provider.getBalance(accounts[0]);
        
        setAddress(accounts[0]);
        setBalance(ethers.formatEther(balanceVal).substring(0, 6));
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setBalance(null);
  };

  const createEvent = async (eventData: Omit<Event, "id" | "soldCount" | "organizer">) => {
    if (!address) return;

    if (isBlockchainMode) {
      const contract = await getContract(true);
      if (contract) {
        try {
          const dateTimestamp = Math.floor(new Date(eventData.date).getTime() / 1000);
          const tx = await contract.createEvent(
            eventData.title,
            eventData.description,
            ethers.parseEther(eventData.price),
            eventData.totalSupply,
            eventData.image,
            dateTimestamp,
            eventData.location
          );
          await tx.wait();
          fetchBlockchainData();
          return;
        } catch (error) {
          if (isError(error, "ACTION_REJECTED")) {
            console.warn("User rejected the transaction.");
          } else {
            console.error("Create event failed:", error);
          }
          throw error;
        }
      }
    }

    // Mock Fallback
    console.warn("Using Mock Fallback for createEvent");
    alert("Blockchain sync is currently unavailable. This action is being performed in Mock Mode (localStorage only).");
    
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      soldCount: 0,
      organizer: address
    };
    const updated = [...events, newEvent];
    setEvents(updated);
    localStorage.setItem("ticketchain_events", JSON.stringify(updated));
  };

  const buyTicket = async (eventId: string) => {
    if (!address) {
       await connectWallet();
       return;
    }

    if (isBlockchainMode) {
      const contract = await getContract(true);
      if (contract) {
        try {
          const event = events.find(e => e.id === eventId);
          if (!event) return;
          const tx = await contract.buyTicket(eventId, { value: ethers.parseEther(event.price) });
          await tx.wait();
          fetchBlockchainData();
          return;
        } catch (error) {
          if (isError(error, "ACTION_REJECTED")) {
            console.warn("User rejected the transaction.");
          } else {
            console.error("Buy ticket failed:", error);
          }
          throw error;
        }
      }
    }

    // Mock Fallback
    alert("Blockchain sync is currently unavailable. Buying in Mock Mode (localStorage only).");
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex !== -1) {
      const updatedEvents = [...events];
      updatedEvents[eventIndex].soldCount += 1;
      setEvents(updatedEvents);
      localStorage.setItem("ticketchain_events", JSON.stringify(updatedEvents));

      const newTicket: Ticket = {
        tokenId: `TCT-${Math.floor(Math.random() * 1000000)}`,
        eventId: eventId,
        owner: address,
        isUsed: false,
        purchaseDate: new Date().toISOString()
      };
      const allTickets = JSON.parse(localStorage.getItem("ticketchain_tickets") || "[]");
      localStorage.setItem("ticketchain_tickets", JSON.stringify([...allTickets, newTicket]));
      setUserTickets(prev => [...prev, newTicket]);
    }
  };

  const verifyTicket = async (tokenId: string) => {
    if (isBlockchainMode) {
      const contract = await getContract(true);
      if (contract) {
        try {
          const tx = await contract.verifyTicket(tokenId);
          await tx.wait();
          fetchBlockchainData();
          return { isValid: true, message: "Ticket verified on-chain!" };
        } catch (error: any) {
          if (isError(error, "ACTION_REJECTED")) {
            return { isValid: false, message: "Transaction cancelled by user." };
          }
          return { isValid: false, message: error.reason || "Verification failed." };
        }
      }
    }

    // Mock Fallback
    const allTickets: Ticket[] = JSON.parse(localStorage.getItem("ticketchain_tickets") || "[]");
    const ticket = allTickets.find(t => t.tokenId === tokenId);
    if (!ticket) return { isValid: false, message: "Ticket not found." };
    if (ticket.isUsed) return { isValid: false, message: "Already used." };
    
    ticket.isUsed = true;
    localStorage.setItem("ticketchain_tickets", JSON.stringify(allTickets));
    return { isValid: true, message: "Verified successfully (Mock).", ticket };
  };

  return (
    <Web3Context.Provider
      value={{
        address,
        balance,
        connectWallet,
        disconnectWallet,
        events,
        userTickets,
        createEvent,
        buyTicket,
        verifyTicket,
        isBlockchainMode
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}
