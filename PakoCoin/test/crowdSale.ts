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
    it("Buy token", async function () {
      [owner, addr1, addr2] = await ethers.getSigners();        
      const TokenContract = await ethers.getContractFactory("PakoToken");
      const tokenContract = await TokenContract.deploy();
      await tokenContract.deployed();

      const CrowdSaleToken = await ethers.getContractFactory("CrowdSale");
      const crowdSaleToken = await CrowdSaleToken.deploy(tokenContract.address, tokenPrice);
      await crowdSaleToken.deployed();      
      // Provision 75% of all tokens to the token sale
      let availableBlance = ethers.utils.parseUnits("75000") ;
      let transaction =  await tokenContract.transfer(crowdSaleToken.address,availableBlance)
      
      if (transaction) {
        //balance of CrowdSaleContract before transaction
        expect((await tokenContract.balanceOf(crowdSaleToken.address)).toString()).to.equal(availableBlance)
        
        expect((await tokenContract.balanceOf(addr1.address)).toString()).to.equal("0")

        let receipt = await crowdSaleToken.connect(addr1).buyTokens({value: ethers.utils.parseEther('1')})

        let addr1Balance = (await tokenContract.balanceOf(addr1.address)).toString()        
        //balance of addr1 before token purchase
        expect( addr1Balance ).to.equal((ethers.utils.parseUnits(tokenPrice.toString()).toString()),"triggers one event")
        //balance of CrowdSaleContract before transaction
        expect((await tokenContract.balanceOf(crowdSaleToken.address)).toString()).to.equal(ethers.utils.parseUnits("74900") )          
      }      
    });
    it("End crowd sale ", async function () {
      [owner, addr1, addr2] = await ethers.getSigners();        
      const TokenContract = await ethers.getContractFactory("PakoToken");
      const tokenContract = await TokenContract.deploy();
      await tokenContract.deployed();

      const CrowdSaleToken = await ethers.getContractFactory("CrowdSale");
      const crowdSaleToken = await CrowdSaleToken.deploy(tokenContract.address, tokenPrice);
      await crowdSaleToken.deployed();      
      // Provision 75% of all tokens to the token sale
      let availableBlance = ethers.utils.parseUnits("75000") ;

      let transaction =  await tokenContract.transfer(crowdSaleToken.address,availableBlance)
      

      
      if (transaction) {
        //balance of CrowdSaleContract before transaction
        expect((await tokenContract.balanceOf(crowdSaleToken.address)).toString()).to.equal(availableBlance)
        //balance of owner before transaction
        expect((await tokenContract.balanceOf(owner.address)).toString()).to.equal(ethers.utils.parseUnits("25000"))
        expect((await tokenContract.balanceOf(addr1.address))).to.equal(0);

        let receipt = await crowdSaleToken.connect(addr1).buyTokens({value: ethers.utils.parseEther('1')})
        //balance of addr1 after token buy
        expect((await tokenContract.balanceOf(addr1.address)).toString()).to.equal(ethers.utils.parseUnits("100"));

        await crowdSaleToken.endSale();

        let ownerBalance = (await tokenContract.balanceOf(owner.address)).toString()        
        //balance of addr1 before token purchase
        expect( ownerBalance ).to.equal(ethers.utils.parseUnits('99900'),"remaining token will send back to owner's account")
        //balance of CrowdSaleContract before transaction
        expect((await tokenContract.balanceOf(crowdSaleToken.address)).toString()).to.equal(ethers.utils.parseUnits("0") )          
      }      
    });
    
    
  });