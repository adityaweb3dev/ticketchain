import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TicketChainModule = buildModule("TicketChainModule", (m) => {
  const ticketChain = m.contract("TicketChain");

  return { ticketChain };
});

export default TicketChainModule;
