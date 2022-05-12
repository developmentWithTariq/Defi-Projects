import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

let tokenPrice = 100;
  
describe("CrowdSale of Pako token", function () {
  let owner:any, addr1:any,addr2:any, tokenContract, crowdSaleToken:any;
  
    it("initializes the contract with the correct values", async function () {
      [owner, addr1, addr2] = await ethers.getSigners();        
      const TokenContract = await ethers.getContractFactory("PakoToken");
      const tokenContract = await TokenContract.deploy();
      await tokenContract.deployed();

      const CrowdSaleToken = await ethers.getContractFactory("CrowdSale");
      const crowdSaleToken = await CrowdSaleToken.deploy(tokenContract.address, tokenPrice);
      await crowdSaleToken.deployed();

      expect(await crowdSaleToken.address).not.equal(0x0,'has contract address');

      expect(await crowdSaleToken.tokenContract()).not.equal(0x0,"has token contract address")
      expect( (await crowdSaleToken.PricePerEther()).toNumber()).to.equal(tokenPrice,'token price is correct')
      
      
    });
    
    
  });