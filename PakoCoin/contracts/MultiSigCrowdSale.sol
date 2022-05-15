// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./pakotoken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract MultiSigCrowdSale is Pausable{

    // Payable address can receive Ether
    address payable public mainOwner;
    
    //pending ehters for owner
    mapping(address => uint) public pendingWithDrawals;
       
    PakoToken public tokenContract;
    uint256 public PricePerEther;
    uint256 public tokensSold;    
    address[] walletowners;
    uint limit;
    uint withdrawalId = 0;
    uint transferId = 0;

    event Sell(address _buyer, uint256 _amount);

    constructor(PakoToken _tokenContract, uint256 _PricePerEther) {
        mainOwner = payable(msg.sender);
        tokenContract = _tokenContract;
        PricePerEther = _PricePerEther;
        walletowners.push(mainOwner);
        limit = walletowners.length - 1;
        
    }
    function createBuyRequest() payable public whenNotPaused{           
        uint buyLimit = 100000000000000000000;
        require(msg.value <= buyLimit,"you are exceeding buy limit." );
        for (uint i = 0; i < walletowners.length; i++) {
            
            require(walletowners[i] != msg.sender, "cannot transfer funds withiwn the wallet");
        }
        
        require(msg.value >0 ,"0 value transfer");
        pendingWithDrawals[mainOwner] += msg.value;
        uint _numberOfTokens = msg.value * PricePerEther;
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        
        transferRequests.push(Transfer(address(this), msg.sender, _numberOfTokens,msg.value, transferId, 0, block.timestamp));
        transferId++;
        emit transferCreated( address(this), msg.sender, _numberOfTokens, transferId, 0, block.timestamp);
        
    }
    modifier OnlyMainOwner(){

        require(msg.sender == mainOwner,"Only main owner can call the function.");
        _;
    }
    function stopTransaction() private whenNotPaused onlyowners {
        _pause();
    }
    function startTransaction() public whenPaused onlyowners {
        _unpause();
    }   
    function endCrowdSaleRequest() payable public whenNotPaused {                               
        require(msg.sender == mainOwner);
        uint minBalance = 74000000000000000000000;
        require(tokenContract.balanceOf(address(this)) <= minBalance  ,"Tokens are available for sale.");
        stopTransaction();
        
        uint amount = tokenContract.balanceOf(address(this)); 
        tokenContract.transfer(msg.sender, amount);         
        emit transferCreated( address(this), msg.sender, amount, transferId, 0, block.timestamp);
        
    }

    fallback() external payable {
        createBuyRequest();
    }

    receive() external payable {
        createBuyRequest();
    }
    
    
    
    
    // mapping(address => uint) balance;
    mapping(address => mapping(uint => bool)) approvals;    

    
    struct Transfer {
        
        address sender;
        address receiver;
        uint amount;
        uint ethers;
        uint id;
        uint approvals;
        uint timeOfTransaction;

    }
    
    Transfer[] transferRequests;
    
    event walletOwnerAdded(address addedBy, address ownerAdded, uint timeOfTransaction);
    event walletOwnerRemoved(address removedBy, address ownerRemoved, uint timeOfTransaction);    
    event fundsWithdrawed(address sender, uint amount, uint withdrawalId, uint timeOfTransaction);
    event transferCreated(address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event transferCancelled(address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event transferApproved(address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event fundsTransfered(address sender, address receiver, uint amount, uint id, uint approvals, uint timeOfTransaction);
    event tokenAdded(address addedBy, address tokenAddress, uint timeOfTransaction);
    
    modifier onlyowners() {
        
       bool isOwner = false;
       for (uint i = 0; i< walletowners.length; i++) {
           
           if (walletowners[i] == msg.sender) {
               
               isOwner = true;
               break;
           }
       }
       
       require(isOwner == true, "only wallet owners can call this function");
       _;
        
    }    
            
    function addWalletOwner(address owner) public OnlyMainOwner {
        
        
       for (uint i = 0; i < walletowners.length; i++) {
           
           if(walletowners[i] == owner) {
               
               revert("cannot add duplicate owners");
           }
       }
        
        walletowners.push(owner);
        limit = walletowners.length - 1;
        
        emit walletOwnerAdded(msg.sender, owner, block.timestamp);
    }
    
    
    function removeWalletOwner(address owner) public OnlyMainOwner {
        
        require(msg.sender == mainOwner);
        bool hasBeenFound = false;
        uint ownerIndex;
        for (uint i = 0; i < walletowners.length; i++) {
            
            if(walletowners[i] == owner) {
                
                hasBeenFound = true;
                ownerIndex = i;
                break;
            }
        }
        
        require(hasBeenFound == true, "wallet owner not detected");
        
        walletowners[ownerIndex] = walletowners[walletowners.length - 1];
        walletowners.pop();
        limit = walletowners.length - 1;
        
         emit walletOwnerRemoved(msg.sender, owner, block.timestamp);
       
    }
    function withdraw() public payable {
        require(pendingWithDrawals[msg.sender] >0,"Insufficient amount"  );
        uint amount = pendingWithDrawals[msg.sender];
        pendingWithDrawals[msg.sender] -= amount;        
                            
        payable(msg.sender).transfer(amount);                                        
        
        emit fundsWithdrawed( msg.sender, amount, withdrawalId, block.timestamp);
        
        withdrawalId++;
        
    }    
    
  
    
    function cancelTransferRequest(uint id) public OnlyMainOwner{
        
        
        bool hasBeenFound = false;
        uint transferIndex = 0;
        for (uint i = 0; i < transferRequests.length; i++) {
            
            if(transferRequests[i].id == id) {
                
                hasBeenFound = true;
                break;
               
            }
            
             transferIndex++;
        }
        
        require(hasBeenFound, "transfer request does not exist");
        uint amount = transferRequests[transferIndex].ethers;        
        
        pendingWithDrawals[mainOwner] = pendingWithDrawals[mainOwner] - amount;
        pendingWithDrawals[transferRequests[transferIndex].receiver] += amount; 
        
        transferRequests[transferIndex] = transferRequests[transferRequests.length - 1];
        
        emit transferCancelled( transferRequests[transferIndex].sender, transferRequests[transferIndex].receiver, transferRequests[transferIndex].amount, transferRequests[transferIndex].id, transferRequests[transferIndex].approvals, transferRequests[transferIndex].timeOfTransaction);
        transferRequests.pop();
    }
    
    function approveTransferRequest(uint id) public onlyowners {
        
        
        bool hasBeenFound = false;                         
        uint transferIndex = 0;                    //0
        for (uint i = 0; i < transferRequests.length; i++) {     //i =0, 1,i++ 
            
            if(transferRequests[i].id == id) {                     //0.id == 0 

                hasBeenFound = true;
                break;
                
            }
            
             transferIndex++;
        }
        
        require(hasBeenFound, "no transaction available for approve for given id");
        require(approvals[msg.sender][id] == false, "cannot approve the same transfer twice");
        
        
        approvals[msg.sender][id] = true;              //
        transferRequests[transferIndex].approvals++;
        
        emit transferApproved( msg.sender, transferRequests[transferIndex].receiver, transferRequests[transferIndex].amount, transferRequests[transferIndex].id, transferRequests[transferIndex].approvals, transferRequests[transferIndex].timeOfTransaction);
        
        if (transferRequests[transferIndex].approvals == limit) {
            
            transferFunds(transferIndex);
        }
    }
    
    function transferFunds( uint id) private {
        
        tokenContract.transfer(transferRequests[id].receiver,transferRequests[id].amount);
        
        emit fundsTransfered(address(this), transferRequests[id].receiver, transferRequests[id].amount, transferRequests[id].id, transferRequests[id].approvals, transferRequests[id].timeOfTransaction);
        tokensSold +=transferRequests[id].amount;                 
        transferRequests[id] = transferRequests[transferRequests.length - 1];
        transferRequests.pop();
              
        
    }
    
    function getApprovals(uint id) public view returns(bool) {
        
        return approvals[msg.sender][id];
    }
    
    function getTransferRequests() public view returns(Transfer[] memory) {
        
        return transferRequests;
    }
    
    function getBalance(address account) public view returns(uint) {
        
        return tokenContract.balanceOf(account);
    }
    
    function getApprovalLimit() public view returns (uint) {
        
        return limit;
    }
    
     function getContractBalance() public view returns(uint) {
        
        return tokenContract.balanceOf(address(this));
    }
    
    function getWalletOners() public view returns(address[] memory) {
        
        return walletowners;
    }
}

