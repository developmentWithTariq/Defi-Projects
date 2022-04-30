// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract PakoToken is ERC20, Ownable, Pausable {

    uint256 private cap;
    uint _initialSupply;

    constructor() ERC20("PakoToken","Pako") {
        _initialSupply = 10000 * (10 ** decimals());
        cap = _initialSupply * (1 * ( 10 **16));
        _mint(msg.sender, _initialSupply);
    }

    function generateToken(address account , uint amount ) public onlyOwner {
        require(account != address(0), "ERC20: mint to the zero address");
        require(amount >0 ,"Invalid amount");
        require(totalSupply() + amount < cap,"OverLimit token: Token generation failed");
        _mint(account, amount);
    }

     // Ruturn Full cap
    function getCap() external view returns(uint){
        return cap;
    }
  
    
}