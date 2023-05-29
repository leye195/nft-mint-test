// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "SaleToken.sol";

contract MintToken is ERC721Enumerable, Ownable {
    constructor() ERC721("testTokens","TTS") {}

    SaleToken public saleToken;

    mapping(uint256 => uint256) public tokenTypes;

    struct TokenData {
        uint256 tokenId;
        uint256 tokenType;
        uint256 price;
    }

    function mintTestToken() public {
        uint256 tokenId = totalSupply() + 1; // mint id

        require(tokenId < 100,"Mint is not allowed");
        // random 값 추출
        uint256 tokenType = uint256(keccak256(abi.encodePacked(block.timestamp,msg.sender,tokenId))) % 5 + 1;

        tokenTypes[tokenId] = tokenType;

        _mint(msg.sender,tokenId); // mint function suppled by ERC721
    }



    function setSaleToken(address _saleToken) public onlyOwner {
        saleToken = SaleToken(_saleToken);
    }
}

 