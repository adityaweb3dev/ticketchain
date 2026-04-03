# 🎟️ TicketChain

**Decentralized Event Ticketing Ecosystem | NFT-Powered Access | Immersive 3D Experience**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22-yellow?logo=hardhat)](https://hardhat.org/)
[![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-blue?logo=ethereum)](https://ethereum.org/)

---

## 🌟 Overview

**TicketChain** is a cutting-edge decentralized application (dApp) designed to revolutionize the event ticketing industry. By leveraging blockchain technology and NFTs, it eliminates common issues such as counterfeit tickets and lacks of transparency, while providing an immersive, high-performance user interface powered by Next.js and Three.js.

Whether you're an event organizer looking for a secure platform or an attendee seeking frictionless access, TicketChain provides a robust, end-to-end solution for modern events.

---

## 🚀 Key Features

### 💎 NFT-Based Ticketing (ERC721)
Every ticket issued on TicketChain is a unique NFT. This ensures:
- **Verifiable Authenticity**: No more fake or duplicate tickets.
- **Controlled Resale**: Event organizers can set parameters for ticket transfers.
- **Collectibility**: Attendees own a digital souvenir of the event.

### 🎮 Immersive 3D UI/UX
Beyond simple lists, TicketChain offers:
- **Interactive Visuals**: Powered by Three.js and React Three Fiber.
- **Fluid Animations**: Smooth transitions with Framer Motion.
- **Glassmorphic Design**: A modern, premium aesthetic that wows users.

### 🛡️ Secure Organizer Dashboard
Organizers can:
- **Create Events**: Set ticket price, supply, date, and location.
- **Manage Sales**: Real-time tracking of ticket distribution.
- **On-Site Verification**: A restricted function for organizers to verify ticket NFTs using QR codes on-site.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **State Management**: [React Context API](https://react.dev/reference/react/useContext)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Graphics**: [Three.js](https://threejs.org/) & [React Three Fiber](https://r3f.docs.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Blockchain & Smart Contracts
- **Language**: [Solidity 0.8.24](https://soliditylang.org/)
- **Library**: [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
- **Environment**: [Hardhat](https://hardhat.org/)
- **Network**: [Sepolia Testnet](https://sepolia.etherscan.io/) (Configured)
- **Integration**: [Ethers.js v6](https://docs.ethers.org/v6/)

---

## 📦 Prerequisites

Before running the project locally, ensure you have:
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MetaMask](https://metamask.io/) browser extension
- Some test ETH on the Sepolia network (get some from a [faucet](https://sepoliafaucet.com/))

---

## ⚙️ Installation & Setup

1. **Clone the project:**
   ```bash
   git clone https://github.com/adityaweb3dev/ticketchain.git
   cd ticketchain
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   RPC_URL=your_infura_or_alchemy_url
   PRIVATE_KEY=your_wallet_private_key
   ```
   > [!WARNING]
   > Do **NOT** commit your `.env` file or share your private key.

4. **Compile Smart Contracts:**
   ```bash
   npx hardhat compile
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the dApp.

---

## 📜 Smart Contract: `TicketChain.sol`

The core logic resides in `contracts/TicketChain.sol`. It is an **ERC721URIStorage** contract that provides the following functionality:

| Function | Description |
| :--- | :--- |
| `createEvent(...)` | Allows organizers to list a new event with total supply and price. |
| `buyTicket(eventId)` | Allows users to purchase a ticket NFT by paying the required ETH. |
| `verifyTicket(tokenId)` | Restricted to organizers. Marks a ticket as "used" upon entry. |
| `withdrawFees()` | Owner-only function to collect platform revenue. |

---

## 📂 Project Structure

```text
├── contracts/          # Solidity smart contracts
├── src/
│   ├── app/            # Next.js App Router pages
│   ├── components/     # UI Components (Sections, UI kit)
│   ├── constants/      # Contract ABIs and Addresses
│   ├── context/        # Web3 Content & State Management
│   ├── lib/            # Utility functions
│   └── styles/         # CSS and theme configuration
├── hardhat.config.ts   # Blockchain environment config
└── public/             # Static assets (images, fonts)
```

---

## 🎨 Design Philosophy

TicketChain is built with a focus on **Visual Excellence**:
- **Modern Color Palette**: Deep dark modes with vibrant accent gradients.
- **Micro-Animations**: Hover effects and interactive 3D elements for a premium feel.
- **Mobile Responsive**: Fully optimized for mobile and tablet browsing.

---

## 🚧 Future Roadmap

- [ ] Secondary marketplace for ticket trading.
- [ ] Integration with decentralized storage (IPFS/Arweave) for metadata.
- [ ] Multi-chain support (Polygon, Arbitrum).
- [ ] DAO-governance for platform fee adjustments.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

*Made with ❤️ for the Web3 Community.*
