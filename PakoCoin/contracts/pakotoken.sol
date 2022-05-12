// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/ERC20.sol)

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract PakoToken is ERC20, Ownable, Pausable {

    mapping(address => uint) public pendingWithDrawals;
    
    mapping(address => uint) private _balances;

    uint256 private cap;
    uint public _initialSupply;
    uint private _tokenPrice;
    address payable private _owner;
    

    // Emit a BuyTokens event that will log who’s the buyer, the amount of ETH sent and the amount of Token bought
    event BuyTokens(address indexed buyer, uint value, uint256 tokens);

    constructor() ERC20("PakoToken","Pako") {
        _initialSupply = 100000 * (10 ** decimals());
        cap = 10000000*(10** decimals());
        _mint(msg.sender, _initialSupply);
        _tokenPrice = 100;
        _owner = payable(msg.sender);
    }

    function generateToken(address account , uint amount ) public whenNotPaused onlyOwner {
        require(account != address(0), "ERC20: mint to the zero address");
        require(amount >0 ,"Invalid amount");
        require(totalSupply() + amount < cap,"OverLimit token: Token generation failed");
        _mint(account, amount);
    }

    function burnToken(address account, uint256 amount) whenNotPaused public {
        require(account != address(0), "ERC20: burn from the zero address");
        require(amount > 0,"Invalid amount.");
        _burn(account, amount);
    }
    function stopTransaction() public whenNotPaused onlyOwner {
        _pause();
    }
    function startTransaction() public whenPaused onlyOwner {
        _unpause();
    }
      
    function buyToken() public payable whenNotPaused returns(uint, string memory){
        require(msg.value > 0, "Pay the amount of Eth you want to send.");        
        uint tokenAmount = (msg.value * _tokenPrice);
        address Buyer = msg.sender;
        pendingWithDrawals[_owner] += msg.value;
        _transfer(_owner,Buyer,tokenAmount);
     
        
        emit BuyTokens(Buyer,msg.value,tokenAmount);
        return (tokenAmount, "Sent to your wallet");
    }

  

    function withDraw() payable onlyOwner public{
       uint amount = pendingWithDrawals[_owner];
       pendingWithDrawals[_owner] = 0;
       payable(_owner).transfer(amount);        
    }

    function pricePerEth()external view returns(uint){
        return _tokenPrice;
    }

     // Ruturn Full cap
    function getCap() external view returns(uint){
        return cap;
    }
    // 3. There should be an additional method to adjust the price that allows the owner to adjust the price.
    //returns price
    function setPrice(uint _newPrice)external onlyOwner() returns(string memory){
        _tokenPrice = _newPrice;
        return "The token new price is updated.";
    }
    receive()external payable{
        //if our contract recieve some ether our contract receive function will call the buyToken function and send Token to the msg.sender
        buyToken();
    }
    fallback() external  payable{
        buyToken();
    }   
}