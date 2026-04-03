import { expect } from "chai";
import pkg from "hardhat";
const { ethers } = pkg;
import { TicketChain } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("TicketChain", function () {
  let ticketChain: any;
  let owner: SignerWithAddress;
  let organizer: SignerWithAddress;
  let buyer: SignerWithAddress;
  let otherAccount: SignerWithAddress;

  const EVENT_TITLE = "Web3 Workshop";
  const EVENT_DESC = "Learn to build dApps";
  const EVENT_PRICE = ethers.parseEther("0.1");
  const EVENT_SUPPLY = 10;
  const EVENT_IMAGE = "ipfs://image";
  const EVENT_DATE = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
  const EVENT_LOCATION = "Silicon Valley";

  beforeEach(async function () {
    [owner, organizer, buyer, otherAccount] = await ethers.getSigners();
    const TicketChainFactory = await ethers.getContractFactory("TicketChain");
    ticketChain = await TicketChainFactory.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ticketChain.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await ticketChain.name()).to.equal("TicketChain");
      expect(await ticketChain.symbol()).to.equal("TCT");
    });
  });

  describe("Event Creation", function () {
    it("Should create an event successfully", async function () {
      await expect(ticketChain.connect(organizer).createEvent(
        EVENT_TITLE,
        EVENT_DESC,
        EVENT_PRICE,
        EVENT_SUPPLY,
        EVENT_IMAGE,
        EVENT_DATE,
        EVENT_LOCATION
      )).to.emit(ticketChain, "EventCreated")
        .withArgs(0, EVENT_TITLE, EVENT_PRICE, organizer.address, EVENT_DATE);

      const event = await ticketChain.events(0);
      expect(event.title).to.equal(EVENT_TITLE);
      expect(event.organizer).to.equal(organizer.address);
      expect(event.location).to.equal(EVENT_LOCATION);
    });
  });

  describe("Ticket Purchasing", function () {
    beforeEach(async function () {
      await ticketChain.connect(organizer).createEvent(
        EVENT_TITLE,
        EVENT_DESC,
        EVENT_PRICE,
        EVENT_SUPPLY,
        EVENT_IMAGE,
        EVENT_DATE,
        EVENT_LOCATION
      );
    });

    it("Should allow a user to buy a ticket", async function () {
      const initialOrganizerBalance = await ethers.provider.getBalance(organizer.address);
      
      await expect(ticketChain.connect(buyer).buyTicket(0, { value: EVENT_PRICE }))
        .to.emit(ticketChain, "TicketBought")
        .withArgs(0, 0, buyer.address, EVENT_PRICE);

      expect(await ticketChain.ownerOf(0)).to.equal(buyer.address);
      
      const event = await ticketChain.events(0);
      expect(event.soldCount).to.equal(1);

      // Check balances (taking platform fee into account)
      const platformFeeBps = await ticketChain.platformFee();
      const expectedFee = (EVENT_PRICE * BigInt(platformFeeBps)) / 10000n;
      const expectedOrganizerShare = EVENT_PRICE - expectedFee;

      const finalOrganizerBalance = await ethers.provider.getBalance(organizer.address);
      expect(finalOrganizerBalance - initialOrganizerBalance).to.equal(expectedOrganizerShare);
      
      expect(await ticketChain.collectedFees()).to.equal(expectedFee);
    });

    it("Should fail if payment is insufficient", async function () {
      await expect(ticketChain.connect(buyer).buyTicket(0, { value: ethers.parseEther("0.05") }))
        .to.be.revertedWith("Insufficient payment");
    });

    it("Should fail if event is sold out", async function () {
      // Create an event with 1 supply
      await ticketChain.connect(organizer).createEvent(
        "Small Event", "Desc", EVENT_PRICE, 1, EVENT_IMAGE, EVENT_DATE, EVENT_LOCATION
      );
      
      await ticketChain.connect(buyer).buyTicket(1, { value: EVENT_PRICE });
      
      await expect(ticketChain.connect(otherAccount).buyTicket(1, { value: EVENT_PRICE }))
        .to.be.revertedWith("Sold out");
    });
  });

  describe("Verification", function () {
    beforeEach(async function () {
      await ticketChain.connect(organizer).createEvent(
        EVENT_TITLE, EVENT_DESC, EVENT_PRICE, EVENT_SUPPLY, EVENT_IMAGE, EVENT_DATE, EVENT_LOCATION
      );
      await ticketChain.connect(buyer).buyTicket(0, { value: EVENT_PRICE });
    });

    it("Should allow organizer to verify a ticket", async function () {
      await expect(ticketChain.connect(organizer).verifyTicket(0))
        .to.emit(ticketChain, "TicketVerified")
        .withArgs(0, 0, organizer.address);

      const ticket = await ticketChain.tickets(0);
      expect(ticket.isUsed).to.be.true;
    });

    it("Should fail if ticket is verified twice", async function () {
      await ticketChain.connect(organizer).verifyTicket(0);
      await expect(ticketChain.connect(organizer).verifyTicket(0))
        .to.be.revertedWith("Ticket already used");
    });

    it("Should fail if unauthorized person tries to verify", async function () {
      await expect(ticketChain.connect(otherAccount).verifyTicket(0))
        .to.be.revertedWith("Unauthorized verifier");
    });
  });

  describe("Fee Management", function () {
    it("Should allow owner to withdraw fees", async function () {
      await ticketChain.connect(organizer).createEvent(
        EVENT_TITLE, EVENT_DESC, EVENT_PRICE, EVENT_SUPPLY, EVENT_IMAGE, EVENT_DATE, EVENT_LOCATION
      );
      await ticketChain.connect(buyer).buyTicket(0, { value: EVENT_PRICE });

      const initialOwnerBalance = await ethers.provider.getBalance(owner.address);
      const collectedFees = await ticketChain.collectedFees();

      const tx = await ticketChain.connect(owner).withdrawFees();
      const receipt = await tx.wait();
      const gasUsed = BigInt(receipt.gasUsed) * BigInt(receipt.gasPrice);

      const finalOwnerBalance = await ethers.provider.getBalance(owner.address);
      expect(finalOwnerBalance + gasUsed - initialOwnerBalance).to.equal(collectedFees);
      expect(await ticketChain.collectedFees()).to.equal(0);
    });

    it("Should fail if non-owner tries to withdraw fees", async function () {
      await expect(ticketChain.connect(otherAccount).withdrawFees())
        .to.be.revertedWithCustomError(ticketChain, "OwnableUnauthorizedAccount");
    });
  });
});
