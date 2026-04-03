// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketChain is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 private _nextEventId;

    struct Event {
        uint256 id;
        string title;
        string description;
        uint256 price;
        uint256 totalSupply;
        uint256 soldCount;
        address organizer;
        string imageUri;
        uint256 date;
        string location;
    }

    struct Ticket {
        uint256 tokenId;
        uint256 eventId;
        bool isUsed;
        uint256 purchaseTime;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(address => uint256[]) public userTickets;
    
    uint256 public platformFee = 250; // 2.5% in basis points
    uint256 public collectedFees;

    event EventCreated(uint256 indexed eventId, string title, uint256 price, address organizer, uint256 date);
    event TicketBought(uint256 indexed tokenId, uint256 indexed eventId, address buyer, uint256 price);
    event TicketVerified(uint256 indexed tokenId, uint256 indexed eventId, address verifier);
    event FeesWithdrawn(address indexed owner, uint256 amount);

    constructor() ERC721("TicketChain", "TCT") Ownable(msg.sender) {}

    function createEvent(
        string memory title,
        string memory description,
        uint256 price,
        uint256 totalSupply,
        string memory imageUri,
        uint256 date,
        string memory location
    ) public returns (uint256) {
        uint256 eventId = _nextEventId++;
        
        events[eventId] = Event({
            id: eventId,
            title: title,
            description: description,
            price: price,
            totalSupply: totalSupply,
            soldCount: 0,
            organizer: msg.sender,
            imageUri: imageUri,
            date: date,
            location: location
        });
        
        emit EventCreated(eventId, title, price, msg.sender, date);
        return eventId;
    }

    function buyTicket(uint256 eventId) public payable returns (uint256) {
        Event storage myEvent = events[eventId];
        require(msg.value >= myEvent.price, "Insufficient payment");
        require(myEvent.soldCount < myEvent.totalSupply, "Sold out");

        uint256 tokenId = _nextTokenId++;
        myEvent.soldCount++;

        _safeMint(msg.sender, tokenId);
        
        tickets[tokenId] = Ticket({
            tokenId: tokenId,
            eventId: eventId,
            isUsed: false,
            purchaseTime: block.timestamp
        });

        userTickets[msg.sender].push(tokenId);

        // Calculate platform fee and organizer share
        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 organizerShare = msg.value - fee;
        
        collectedFees += fee;
        payable(myEvent.organizer).transfer(organizerShare);

        emit TicketBought(tokenId, eventId, msg.sender, msg.value);
        return tokenId;
    }

    function withdrawFees() public onlyOwner {
        uint256 amount = collectedFees;
        collectedFees = 0;
        payable(owner()).transfer(amount);
        emit FeesWithdrawn(owner(), amount);
    }

    function setPlatformFee(uint256 _newFee) public onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _newFee;
    }

    function verifyTicket(uint256 tokenId) public {
        Ticket storage ticket = tickets[tokenId];
        require(ownerOf(tokenId) != address(0), "Ticket does not exist");
        require(!ticket.isUsed, "Ticket already used");
        
        // Authorization check: Only organizer or owner can verify? 
        // Usually, the checker at the gate (authorized by organizer)
        Event storage myEvent = events[ticket.eventId];
        require(msg.sender == myEvent.organizer || msg.sender == owner(), "Unauthorized verifier");

        ticket.isUsed = true;
        emit TicketVerified(tokenId, ticket.eventId, msg.sender);
    }

    function getEvents() public view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](_nextEventId);
        for (uint256 i = 0; i < _nextEventId; i++) {
            allEvents[i] = events[i];
        }
        return allEvents;
    }

    function getUserTickets(address user) public view returns (uint256[] memory) {
        return userTickets[user];
    }
    
    function getTicketDetails(uint256 tokenId) public view returns (Ticket memory) {
        return tickets[tokenId];
    }
}
