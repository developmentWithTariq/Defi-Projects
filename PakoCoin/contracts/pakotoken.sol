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

    }

     // Ruturn Full cap
    function getCap() external view returns(uint){
        return cap;
    }
  
    
}