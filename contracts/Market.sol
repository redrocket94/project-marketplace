//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MockNFT.sol";

contract Market is Ownable {
    address public _mockNFTAddr;
    IMockNFT private _mockNFT;

    ListedItem[] public listedItems;

    enum Development {
        LOW,
        MID,
        HIGH
    }

    enum Goods {
        GRAIN,
        IRON,
        FISH
    }

    struct MockedNFT {
        string name;
        Development development;
        Goods goods;
    }

    struct ListedItem {
        uint256 id;
        address owner;
        uint256 price;
        uint256 listingDate;
    }

    function listItem(uint256 id, uint256 price) public view {
        require(msg.sender == _mockNFT.ownerOf(id), "User does not own NFT");
        _mockNFT.transferFrom(msg.sender, owner(), id);
    }

    function setMockNFTAddr(address mockNFTAddr) public onlyOwner {
        _mockNFTAddr = mockNFTAddr;
    }

    constructor(address mockNFTAddr) {
        _mockNFTAddr = mockNFTAddr;
        _mockNFT = IMockNFT(_mockNFTAddr);
    }

    function callMint(string memory uri) public onlyOwner returns (uint256) {
        return _mockNFT.mint(uri);
    }
}
