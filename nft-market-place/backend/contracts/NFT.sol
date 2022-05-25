// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint public tokenCount;
    constructor() ERC721("DApp NFT", "DAPP"){}
    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }
}



// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";


// contract NFT is ERC721URIStorage {

    
//     using Counters for Counters.Counter;
//     Counters.Counter private _tokenIds;
//     Counters.Counter private  _totalIndex;

//     uint startTokenPrice = 10000;

//     mapping(uint => uint) tokenPrice ;

//     // Array with all token ids, used for enumeration
//     uint256[] _allTokens;
//     mapping (uint=> uint) tokenIndexById;
//     uint _totalSupply; //last token id;.. 
    
//     // Mapping from owner address to their set of owned tokens
//     mapping (address => uint256[]) private _ownerTokens;
//     //tariq ->1,2,3,4
//     //        0,1,2,3 
//     //danish -> 5,6        
//     //         0,1
    
//     //mapping for holding index of token in owner 
//     mapping(address => mapping(uint256 => uint256)) private _ownerTokenIndex;
//     //tariq -> 1 => 0, 2=>1, 3=>2, 4=>3 
//     //danish -> 5 => 0, 6=>1
    
    
//     constructor() ERC721("NFT", "JK") {

//     }

//     function generatetoken(string memory tokenURI) public returns (uint256){
        
//         _tokenIds.increment();


//         uint256 newItemId = _tokenIds.current();
//         uint newItemIndex = _totalIndex.current();

//         addToken(msg.sender,newItemId);    
        
//         _safeMint(msg.sender, newItemId);
//         _totalSupply ++;

//         _setTokenURI(newItemId, tokenURI);    

//         tokenIndexById[newItemId]= newItemIndex;

//         _allTokens.push(newItemId);

//         _totalIndex.increment();

//         tokenPrice[newItemId] = startTokenPrice;
        
        
//         return newItemId;
//     }
//     function buyToken(uint _tokenId) payable public {
//         require(ownerOf(_tokenId) != msg.sender , "owner can't buy his owned Token");
//         require(msg.value == tokenPrice[_tokenId],"value is not eqaul to price of token" );
//         address owner = ownerOf(_tokenId);
        
//         deleteToken( owner ,_tokenId);
//         addToken( msg.sender, _tokenId );
//         _transfer( owner , msg.sender, _tokenId);
                
        

//     }
    
//     function transfer(        
//         address to,
//         uint256 tokenId
//     ) public {
        
//         require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
//         deleteToken(msg.sender,tokenId);

//         _transfer(msg.sender, to, tokenId);
//         addToken(to, tokenId);
//     }

//     function safeTransferFrom(
//         address from,
//         address to,
//         uint256 tokenId,
//         bytes memory _data
//     ) public virtual override {
//         require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
//         deleteToken(from,tokenId);
//         _safeTransfer(from, to, tokenId, _data);
//         addToken(to , tokenId);
//     }

//     function safeTransferFrom(
//         address from,
//         address to,
//         uint256 tokenId
//     ) public virtual override {
//         // deleteToken(from,tokenId);
//         // addToken(to,tokenId);
//         safeTransferFrom(from, to, tokenId, "");
//     }

//     function transferFrom(        
//         address from,
//         address to,
//         uint256 tokenId
//     ) public  override {

//         //solhint-disable-next-line max-line-length
//         require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
//         deleteToken(from,tokenId);
//         addToken(to,tokenId);
//         _transfer(from, to, tokenId);
                
//     }

    
//     function addToken(address owner,uint tokenId) private returns(bool success,uint256 newIndex) {

        
//         //push new token into owner's posession
//         _ownerTokens[owner].push(tokenId);
        
//         //stored new index 
//         newIndex = _ownerTokens[owner].length-1;
//         _ownerTokenIndex[owner][tokenId]= newIndex;
        
        
//         success = true;
//     }

//     function deleteToken(address owner, uint tokenId) private returns(bool success, uint256 index){
//         require(_exists(tokenId),"ERC721:Invalid Token - Token not exist");
//         require(ownerOf(tokenId) == owner,"ERC721: Invalid ownership - Token is not owned by owner");
      
//         index = _ownerTokenIndex[owner][tokenId];
      
        
//         if(_ownerTokens[owner].length>1){
      
//             uint lastToken = _ownerTokens[owner][_ownerTokens[owner].length-1];  
      
//             _ownerTokens[owner][index] = lastToken;
      
//             _ownerTokenIndex[owner][lastToken] = index;
//         }
      
        
//         //remove last entry
//         _ownerTokens[owner].pop();
        
//         //remove Index
//         delete _ownerTokenIndex[owner][tokenId];    
        
//         success = true;
//     }
//     function BurnToken(uint256 tokenId) external {
//         require(_exists(tokenId),"ERC721:Invalid Token - Token not exist");
//         require(ownerOf(tokenId) == msg.sender,"ERC721: Invalid ownership - Token is not owned by msg.sender");
//         deleteToken(msg.sender,tokenId);
//         uint index = tokenIndexById[tokenId];
//         delete _allTokens[index];
//         _burn(tokenId);

//         _totalSupply = _totalSupply - 1;
//     }

//     function totalSupply() public view  returns (uint256) {
//         // _tokenOwners are indexed by tokenIds, so .length() returns the number of tokenIds
//         return _totalSupply;
//     } 

//     function indexOf(address owner, uint256 tokenId) external view returns (uint256){
//         require(tokenId > 0,"ERC721: Query for non existent token");
//         require(owner != address(0), "ERC721: owner query for nonexistent token");
//                                // 0 =  Noman   5 
//         return _ownerTokenIndex[owner][tokenId];
//     }
    
//     function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256) {
//         return _ownerTokens[owner][index];
//     }

//     function setTokenPrice(uint _tokenId, uint _price) public {
//         require(ownerOf(_tokenId) == msg.sender,"only owner can set the price");
//         tokenPrice[_tokenId] = _price;

//     }


// }