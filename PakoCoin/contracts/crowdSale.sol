// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/ERC20.sol)
pragma solidity ^0.8.0;

import "./pakotoken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdSale is Ownable{

    // Payable address can receive Ether
    address payable public admin;
    
    //pending ehters for owner
    mapping(address => uint) public pendingWithDrawals;
       
    PakoToken public tokenContract;
    uint256 public PricePerEther;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);

    constructor(PakoToken _tokenContract, uint256 _PricePerEther) {
        admin = payable(msg.sender);
        tokenContract = _tokenContract;
        PricePerEther = _PricePerEther;
    }

    function buyTokens() public payable {
        require(msg.value >0 ,"0 value transfer");
        pendingWithDrawals[admin] += msg.value;
        uint _numberOfTokens = msg.value * PricePerEther;
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens ;

        emit Sell(msg.sender, _numberOfTokens);
    }
    

    fallback() external payable {
        buyTokens();
    }

    receive() external payable {
        buyTokens();
    }
}