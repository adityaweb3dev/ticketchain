const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const TicketChain = await hre.ethers.getContractAt("TicketChain", contractAddress);

  console.log("Seeding blockchain with sample events...");

  const events = [
    {
      title: "Solana Breakpoint 2026",
      description: "The global conference of the Solana community, featuring live music, tech showcases, and the future of DeFi.",
      price: hre.ethers.parseEther("0.1"),
      totalSupply: 1000,
      imageUri: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      date: Math.floor(new Date("2026-11-20").getTime() / 1000),
      location: "Singapore, Bayfront Avenue"
    },
    {
      title: "Tomorrowland: Digital Era",
      description: "Experience the magic of Tomorrowland on the blockchain. Verifiable VIP perks and exclusive NFT memorabilia.",
      price: hre.ethers.parseEther("0.25"),
      totalSupply: 500,
      imageUri: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
      date: Math.floor(new Date("2026-07-15").getTime() / 1000),
      location: "Boom, Belgium"
    },
    {
      title: "Ethereum London Developer Summit",
      description: "A deep dive into Layer 2 scaling, account abstraction, and the road to the Surge.",
      price: hre.ethers.parseEther("0.05"),
      totalSupply: 300,
      imageUri: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
      date: Math.floor(new Date("2026-06-10").getTime() / 1000),
      location: "London, UK"
    }
  ];

  for (const event of events) {
    const tx = await TicketChain.createEvent(
      event.title,
      event.description,
      event.price,
      event.totalSupply,
      event.imageUri,
      event.date,
      event.location
    );
    await tx.wait();
    console.log(`Created event: ${event.title}`);
  }

  console.log("Successfully seeded 3 live events!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
