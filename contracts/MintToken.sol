// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract MintToken is ERC721Enumerable {
    constructor() ERC721("testTokens","TTS") {}

    mapping(uint256 => uint256) public tokenTypes;

    function mintTestToken() public {
        uint256 tokenId = totalSupply() + 1; // mint id

        require(tokenId < 100,"Mint is not allowed");
        // random 값 추출
        uint256 tokenType = uint256(keccak256(abi.encodePacked(block.timestamp,msg.sender,tokenId))) % 5 + 1;

        tokenTypes[tokenId] = tokenType;

        _mint(msg.sender,tokenId); // mint function suppled by ERC721
    }
}

 