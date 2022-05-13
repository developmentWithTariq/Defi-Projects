import { expect } from "chai";
import { ethers } from "hardhat";

describe("Pako token", function () {
  let owner:any, addr1:any,addr2:any, PakoToken, pakoToken;
  
  describe("IERC20Metadata TEST", function () {
    let owner:any, addr1:any,addr2:any, PakoToken, pakoToken;
    it("Should return name of Token as Pako Token", async function () {
      [owner, addr1, addr2] = await ethers.getSigners();
      // const cont = await new ERC20__factory(owner).deploy();
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();

      expect(await pakoToken.name()).to.equal("PakoToken");
      
    });
    it("msg.sender should be owner Should ", async function () {
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();

      expect(await pakoToken.owner()).to.equal(owner.address);
      
    });

    it("Should return Symbol as Pako", async function () {
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();

      expect(await pakoToken.symbol()).to.equal("Pako");
    });
    it("Should return currect price per ether before and after change", async function () {
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();

      const tokenPrice =  pakoToken.pricePerEth;
      expect(await tokenPrice()).to.equal(100);

      await pakoToken.setPrice(200);
      const newTokenPrice =await pakoToken.pricePerEth();
      expect(newTokenPrice).to.equal(200);
    });
    it("Should return 18 decimal", async function () {
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();

      const decimals = await  pakoToken.decimals();
      expect(await decimals).to.equal(18);      
    });        
  });
  describe("Pako ", function () {
    it("Should assign initial supply to Owner", async function () {
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();
      const _owner  = await pakoToken.owner();
      
      const balanceOfOwner = await pakoToken.balanceOf(owner.address);
      expect(await balanceOfOwner.toString()).to.equal(await pakoToken._initialSupply());
    });
    it("Should revert transaction with error of Insufficient balance",async ()=>{
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();

      let initialBalanceOfAddr1 = await pakoToken.balanceOf(addr1.address);
      expect(initialBalanceOfAddr1).to.equal(0);
      expect(await pakoToken
        .connect(addr1)
        .transfer(addr2.address,100)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      

    })
    it("Should return currect balance of addr1 and addr2",async ()=>{
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();

      let beforeBalanceOfAddr1 = await pakoToken.balanceOf(addr1.address);
      let beforeBalanceOfOwner = await pakoToken.balanceOf(owner.address);
      expect(beforeBalanceOfAddr1.toString()).to.equal("0");
      let transfer = await pakoToken.transfer(addr1.address,100);
      if (transfer){
        let afterBalanceOfAddr1 = await pakoToken.balanceOf(addr1.address);  
        expect(await pakoToken.balanceOf(addr1.address)).to.equal(100);
        // expect( (await pakoToken.balanceOf(owner.address)).toNumber()/18).to.equal((beforeBalanceOfOwner.toNumber()/18) - (afterBalanceOfAddr1.toNumber()/18));  
      }
      
    })
    it("Should return currect balance of addr1 and addr2",async ()=>{
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();
      
      let beforeBalanceOfAddr1 = await pakoToken.balanceOf(addr1.address);
      let beforeBalanceOfOwner = await pakoToken.balanceOf(owner.address);
      expect(beforeBalanceOfAddr1.toString()).to.equal("0");
      let transfer = await pakoToken.transfer(addr1.address,100);
      if (transfer){
        let afterBalanceOfAddr1 = await pakoToken.balanceOf(addr1.address);  
        expect(await pakoToken.balanceOf(addr1.address)).to.equal(100);
        // expect( (await pakoToken.balanceOf(owner.address)).toNumber()/18).to.equal((beforeBalanceOfOwner.toNumber()/18) - (afterBalanceOfAddr1.toNumber()/18));  
      }
      
    })

    it("Address1 Should have allawance after aprove some ",async ()=>{
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();
      
      let beforeAllowance = await pakoToken.allowance(owner.address,addr1.address);
      expect(beforeAllowance).to.equal(0);
      let approve = await pakoToken.approve(addr1.address,50);
      if (approve){
        let afterAllowance = await pakoToken.allowance(owner.address,addr1.address);
        expect(afterAllowance).to.equal(50);
      }
    })
    it("Address1 should transfer from owner account to address2 ",async ()=>{
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();
      
      let beforeAllowance = await pakoToken.allowance(owner.address,addr1.address);
      expect(beforeAllowance).to.equal(0);

      let approve = await pakoToken.approve(addr1.address,50);
      if (approve){
        let afterAllowance = await pakoToken.allowance(owner.address,addr1.address);
        expect(afterAllowance).to.equal(50);

        let addr2BalanceBefore = await pakoToken.balanceOf(addr2.address);
        expect(addr2BalanceBefore).to.equal(0);

        const transferFrom = await pakoToken.connect(addr1).transferFrom(owner.address,addr2.address,30);
        expect(await pakoToken.allowance(owner.address,addr1.address)).to.equal(20);
        expect(await pakoToken.balanceOf(addr2.address)).to.equal(30,"30");        
      }
    })
    it("Allowance to address2 should increase  ",async ()=>{
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();
      
      let beforeAllowance = await pakoToken.allowance(owner.address,addr1.address);
      expect(beforeAllowance).to.equal(0);

      let approve = await pakoToken.approve(addr1.address,100);
      if (approve){
        let afterAllowance = await pakoToken.allowance(owner.address,addr1.address);
        expect(afterAllowance).to.equal(100);

        let addr2BalanceBefore = await pakoToken.balanceOf(addr2.address);
        expect(addr2BalanceBefore).to.equal(0);

        const transferFrom = await pakoToken.connect(addr1).transferFrom(owner.address,addr2.address,30);
        expect(await pakoToken.allowance(owner.address,addr1.address)).to.equal(70);
        expect(await pakoToken.balanceOf(addr2.address)).to.equal(30);        
        
        let increaseAllowance = await pakoToken.increaseAllowance(addr1.address,30);
        expect(await pakoToken.allowance(owner.address,addr1.address)).to.equal(100);
      }
    });
    it("Allowance to address2 Should decreased ",async ()=>{
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();
      
      let beforeAllowance = await pakoToken.allowance(owner.address,addr1.address);
      expect(beforeAllowance).to.equal(0);

      let approve = await pakoToken.approve(addr1.address,100);
      if (approve){
        let afterAllowance = await pakoToken.allowance(owner.address,addr1.address);
        expect(afterAllowance).to.equal(100);

        let addr2BalanceBefore = await pakoToken.balanceOf(addr2.address);
        expect(addr2BalanceBefore).to.equal(0);

        const transferFrom = await pakoToken.connect(addr1).transferFrom(owner.address,addr2.address,30);
        expect(await pakoToken.allowance(owner.address,addr1.address)).to.equal(70);
        expect(await pakoToken.balanceOf(addr2.address)).to.equal(30);        
        
        let decreaseAllowance = await pakoToken.decreaseAllowance(addr1.address,20);
        expect(await pakoToken.allowance(owner.address,addr1.address)).to.equal(50);
      }
    });
    it("Allowance Should be increased ",async ()=>{
      const PakoToken = await ethers.getContractFactory("PakoToken");
      const pakoToken = await PakoToken.deploy();
      await pakoToken.deployed();
      
      let beforeAllowance = await pakoToken.allowance(owner.address,addr1.address);
      expect(beforeAllowance).to.equal(0);

      let approve = await pakoToken.approve(addr1.address,100);
      if (approve){
        let afterAllowance = await pakoToken.allowance(owner.address,addr1.address);
        expect(afterAllowance).to.equal(100);

        let addr2BalanceBefore = await pakoToken.balanceOf(addr2.address);
        expect(addr2BalanceBefore).to.equal(0);

        const transferFrom = await pakoToken.connect(addr1).transferFrom(owner.address,addr2.address,30);
        expect(await pakoToken.allowance(owner.address,addr1.address)).to.equal(70);
        expect(await pakoToken.balanceOf(addr2.address)).to.equal(30);        
        
        let increaseAllowance = await pakoToken.increaseAllowance(addr1.address,30);
        expect(await pakoToken.allowance(owner.address,addr1.address)).to.equal(100);
      }
    });
  });
  it("Should not have any pendingWithDrawals for owner", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    // const cont = await new ERC20__factory(owner).deploy();
    const PakoToken = await ethers.getContractFactory("PakoToken");
    const pakoToken = await PakoToken.deploy();
    await pakoToken.deployed();

    const ownerPendingWithDrawals = await pakoToken.pendingWithDrawals(owner.address);
    expect(ownerPendingWithDrawals.toString).to.equal((await ethers.provider.getBalance(owner.address)).toString);    
  });
  it("address1 will buy the token by sending 1ether", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    // const cont = await new ERC20__factory(owner).deploy();
    const PakoToken = await ethers.getContractFactory("PakoToken");
    const pakoToken = await PakoToken.deploy();
    await pakoToken.deployed();
    
    const ownerPendingWithDrawalsBefore = await pakoToken.pendingWithDrawals(owner.address);
    expect(ownerPendingWithDrawalsBefore.toString()).to.equal((0).toString());    

    const etherBeforebuy = await ethers.provider.getBalance(addr1.address);
    expect(etherBeforebuy.toString()).to.equal("9997999693921206045209");

    const beforeBalanceOfAddr1 = await pakoToken.balanceOf(addr1.address);
    expect(beforeBalanceOfAddr1).to.equal(0);
    const beforeBalanceOfOwner = await pakoToken.balanceOf(owner.address);
    expect(beforeBalanceOfOwner).to.equal(await pakoToken.totalSupply());
    const buy = await pakoToken.connect(addr1).buyToken({value:ethers.utils.parseEther("1")});

    const ownerPendingWithDrawalsAfter = await pakoToken.pendingWithDrawals(owner.address);
    expect(ownerPendingWithDrawalsAfter.toString()).to.equal((ethers.utils.parseEther("1")).toString());    
    // console.log(buy);

    const etherAfterbuy = await ethers.provider.getBalance(addr1.address);
    expect(etherAfterbuy.toString).to.equal(ethers.utils.parseEther("9999").toString);
    const afterBalanceOfAddr1 = await pakoToken.balanceOf(addr1.address);
    // expect( afterBalanceOfAddr1.toString()).to.equal((100000000000000000000).toString());
    const afterBalanceOfOwner = await pakoToken.balanceOf(owner.address);
    const _owner = await pakoToken.owner();
    expect( afterBalanceOfOwner.toString()).to.equal((await pakoToken.balanceOf(_owner)).toString());
  });
  
  
  it("owner should mint the token", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const PakoToken = await ethers.getContractFactory("PakoToken");
    const pakoToken = await PakoToken.deploy();
    await pakoToken.deployed();
    //check balance of owner before transaction
    const beforeBalanceOfOwner = await pakoToken.balanceOf(owner.address);
    expect(beforeBalanceOfOwner).to.equal(await pakoToken.totalSupply());

    const totalSupply = await pakoToken.totalSupply();
    expect(totalSupply).to.equal(await pakoToken._initialSupply())

    await pakoToken.generateToken(owner.address,100);
    
    // expect((await pakoToken.totalSupply()).toString()).to.equal((await pakoToken.balanceOf(owner.address)).toString());
    
    const afterBalanceOfOwner = await pakoToken.balanceOf(owner.address);
    const _owner = await pakoToken.owner();
    expect( afterBalanceOfOwner.toString()).to.equal(await pakoToken.totalSupply());
  }); 
  it("owner will burn the Token and total Supply will decrease", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const PakoToken = await ethers.getContractFactory("PakoToken");
    const pakoToken = await PakoToken.deploy();
    await pakoToken.deployed();
    //check balance of owner before transaction
    const beforeBalanceOfOwner = await pakoToken.balanceOf(owner.address);
    expect(beforeBalanceOfOwner).to.equal(await pakoToken.totalSupply());
    
    const totalSupply = await pakoToken.totalSupply();
    expect(totalSupply).to.equal(await pakoToken._initialSupply())

    await pakoToken.burnToken(owner.address,100);
    
    const afterBalanceOfOwner = await pakoToken.balanceOf(owner.address);
    const _owner = await pakoToken.owner();
    expect( afterBalanceOfOwner.toString()).to.equal(await pakoToken.totalSupply());
  }); 
  it("Transfer ownership from owner to address1", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const PakoToken = await ethers.getContractFactory("PakoToken");
    const pakoToken = await PakoToken.deploy();
    await pakoToken.deployed();
    //check owner of the contract
    expect(await pakoToken.owner()).to.equal(owner.address);

    await pakoToken.transferOwnership(addr1.address);

    expect(await pakoToken.owner()).to.equal(addr1.address);
  }); 
  it("RenounceOwnership", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const PakoToken = await ethers.getContractFactory("PakoToken");
    const pakoToken = await PakoToken.deploy();
    await pakoToken.deployed();
    //check owner of the contract
    expect(await pakoToken.owner()).to.equal(owner.address);

    await pakoToken.renounceOwnership();

    expect(await pakoToken.owner()).to.equal("0x0000000000000000000000000000000000000000");
  }); 
  it("address1 will buy the token by sending 1ether", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    // const cont = await new ERC20__factory(owner).deploy();
    const PakoToken = await ethers.getContractFactory("PakoToken");
    const pakoToken = await PakoToken.deploy();
    await pakoToken.deployed();

    const beforeBalanceOfAddr1 = await pakoToken.balanceOf(addr1.address);
    expect(beforeBalanceOfAddr1).to.equal(0);

    await addr1.sendTransaction({
      to:pakoToken.address,
      value: ethers.utils.parseEther("1")
    })
    
    const afterBalanceOfAddr1 = await pakoToken.balanceOf(addr1.address);
    expect(afterBalanceOfAddr1.toString()).to.equal((100*(10**18)).toString());

    const etherAfterbuy = await ethers.provider.getBalance(addr1.address);
    expect(etherAfterbuy.toString).to.equal(ethers.utils.parseEther("9999").toString);

    const etherBalanceOfContract = await ethers.provider.getBalance((pakoToken.address));
    expect(etherBalanceOfContract.toString()).to.equal((1*(10**18)).toString());
    
  });
});

describe("pakora", function(){
  let owner:any, addr1:any,addr2:any, PakoToken, pakoToken;
  it("owner should recieve the ether from pendingWithDrawals", async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    // const cont = await new ERC20__factory(owner).deploy();
    const PakoToken = await ethers.getContractFactory("PakoToken");
    const pakoToken = await PakoToken.deploy();
    await pakoToken.deployed();
    //check the owner pending with drawals before transaction
    const ownerPendingWithDrawalsBefore = await pakoToken.pendingWithDrawals(owner.address);
    expect(ownerPendingWithDrawalsBefore.toString()).to.equal((0).toString());    
    //check the ether balance of owner before buy transaction
    const etherBeforebuy = await ethers.provider.getBalance(owner.address);
    // expect(etherBeforebuy).to.equal("9999985404088421077612");

    //check balance of owner before transaction
    const beforeBalanceOfOwner = await pakoToken.balanceOf(owner.address);
    expect(beforeBalanceOfOwner).to.equal(await pakoToken.totalSupply());
    // buy the token from addr1
    const buy = await pakoToken.connect(addr1).buyToken({value:ethers.utils.parseEther("1")});
    // check the owner pending withdrawals after transaction
    const ownerPendingWithDrawalsAfter = await pakoToken.pendingWithDrawals(owner.address);
    expect(ownerPendingWithDrawalsAfter.toString()).to.equal((ethers.utils.parseEther("1")).toString());    
    // check the balance of owner after transaction
    const afterBalanceOfOwner = await pakoToken.balanceOf(owner.address);
    const _owner = await pakoToken.owner();
    expect( afterBalanceOfOwner.toString()).to.equal((await pakoToken.balanceOf(_owner)).toString());
    //With Draw pending Ethers of owner
    await pakoToken.withDraw();
    //owner pending withdrawals after withdraw
    const ownerPendingAfterWithDraw = await pakoToken.pendingWithDrawals(owner.address);
    expect(ownerPendingAfterWithDraw.toString()).to.equal((0).toString()); 
    //check the owner ether balance after withdraw
    const etherAfterWithDraw = await ethers.provider.getBalance(owner.address);
    expect(etherAfterWithDraw).to.equal("10001916028468681479766");
   
  }); 
})