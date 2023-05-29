// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "MintToken.sol";

contract SaleToken {
  // MintToken contract address 값 할당 변수
  MintToken public mintTokenAddress;

  constructor (address _mintTokenAddress) {
      mintTokenAddress = MintToken(_mintTokenAddress);
  }

  mapping(uint256 => uint256) public tokenPrices;

  // 어떤 token이 판매중인지 
  uint256[] public onSaleTokenArray;

  function setForSaleToken(uint256 _tokenId,uint256 _price) public {
    address tokenOwner = mintTokenAddress.ownerOf(_tokenId);

    // token owner 체크
    require(tokenOwner == msg.sender, "caller is not token owner.");
    
    // price 값 유효체크
    require(_price > 0, "price is zere or lower.");
    
    // 판매 등록 상태 체크
    require(tokenPrices[_tokenId] == 0, "This token is already on sale.");

    // isApprovedForAll는 소유자가 contract에 판메 권한을 넘겼는지 체크
    // address(this)는 SaleToken의 contract address를 의미
    require(mintTokenAddress.isApprovedForAll(tokenOwner, address(this)),"token owner did not approve token.");

    tokenPrices[_tokenId] = _price;
    onSaleTokenArray.push(_tokenId);
  }

  function purchaseToken(uint256 _tokenId) public payable {
      uint256 price = tokenPrices[_tokenId];
      address tokenOwner = mintTokenAddress.ownerOf(_tokenId);

      // 판매 등록 여부 체크
      require(price > 0, "token is not for sale.");

      // msg.value는 함수 실행시 실행자가 보내는 코인의 양
      require(price <= msg.value,"caller sent lower than price.");

      // 소유자가 아닌 경우에만 구매 가능
      require(tokenOwner != msg.sender,"caller is token owner.");


      // 구매 금액 tokenOwner에게 전송
      payable(tokenOwner).transfer(msg.value);
      // token을 구매자에게 전송
      mintTokenAddress.safeTransferFrom(tokenOwner, msg.sender, _tokenId);
  
      tokenPrices[_tokenId] = 0;

      for(uint256 i=0;i<onSaleTokenArray.length;i++) {
          if(tokenPrices[onSaleTokenArray[i]] == 0) {
              onSaleTokenArray[i] = onSaleTokenArray[onSaleTokenArray.length - 1];
              onSaleTokenArray.pop();
          }
      }
  }

  function getOnSaleTokenArrayLength() view public returns (uint256) {
    return onSaleTokenArray.length;
  }

  function cancelOrder(uint256 _tokenId) public {
    address tokenOwner = mintTokenAddress.ownerOf(_tokenId);

    // token owner 체크
    require(tokenOwner == msg.sender, "caller is not token owner.");
        
    // 판매 등록 상태 체크
    require(tokenPrices[_tokenId] > 0, "This order is already on canceled.");

    tokenPrices[_tokenId] = 0;

    for(uint256 i=0;i<onSaleTokenArray.length;i++) {
      if(tokenPrices[onSaleTokenArray[i]] == 0) {
        onSaleTokenArray[i] = onSaleTokenArray[onSaleTokenArray.length - 1];
        onSaleTokenArray.pop();
      }
    }
  }

  function getTokenPrice(uint256 _tokenId) public view returns (uint256) {
    return tokenPrices[_tokenId];
  }
}