// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/ERC20.sol)
pragma solidity ^0.8.0;

import "./pakotoken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdSale is Ownable{

    // Payable address can receive Ether
    address payable public admin;
    
       
    PakoToken public tokenContract;
    uint256 public PricePerEther;


    event Sell(address _buyer, uint256 _amount);

    constructor(PakoToken _tokenContract, uint256 _PricePerEther) {
        admin = payable(msg.sender);
        tokenContract = _tokenContract;
        PricePerEther = _PricePerEther;
    }

}