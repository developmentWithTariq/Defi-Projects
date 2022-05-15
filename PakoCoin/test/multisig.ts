import { expect } from "chai";
import { ethers } from "hardhat";

let tokenPrice = 100;
  
describe("MultiSigCrowdSale of Pako token", function () {
  
  
    it("initializes the contract with the correct values", async function () {
        let mainOwner:any, addr1:any,addr2:any , addr3:any, addr4:any, addr5:any;
        [mainOwner, addr1, addr2] = await ethers.getSigners();        
        const TokenContract = await ethers.getContractFactory("PakoToken");
        const tokenContract = await TokenContract.deploy();
        await tokenContract.deployed();

        const CrowdSaleToken = await ethers.getContractFactory("MultiSigCrowdSale");
        const crowdSaleToken = await CrowdSaleToken.deploy(tokenContract.address, tokenPrice);
        await crowdSaleToken.deployed();

        expect(await crowdSaleToken.address).not.equal(0x0,'has contract address');

        expect(await crowdSaleToken.tokenContract()).not.equal(0x0,"has token contract address")
        expect( (await crowdSaleToken.PricePerEther()).toNumber()).to.equal(tokenPrice,'token price is correct')
        
    });
    it("Create buy token request and then cancel it", async function () {
        let mainOwner:any, addr1:any,addr2:any , addr3:any, addr4:any, addr5:any;
        [mainOwner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();        
        const TokenContract = await ethers.getContractFactory("PakoToken");
        const tokenContract = await TokenContract.deploy();
        await tokenContract.deployed();
  
        const CrowdSaleToken = await ethers.getContractFactory("MultiSigCrowdSale");
        const crowdSaleToken = await CrowdSaleToken.deploy(tokenContract.address, tokenPrice);
        await crowdSaleToken.deployed();      
        // Provision 75% of all tokens to the token sale
        let availableBlance = ethers.utils.parseUnits("75000") ;
        let transaction =  await tokenContract.transfer(crowdSaleToken.address,availableBlance)
        
        if (transaction) {
            //check owners
            let ownerLen = (await crowdSaleToken.getWalletOners()).length;
            expect(ownerLen).to.equal(1);
            //add addr1 to owner
            await crowdSaleToken.addWalletOwner(addr1.address);
            //add addr2 to owner
            await crowdSaleToken.addWalletOwner(addr2.address);
            expect(3).to.equal((await crowdSaleToken.getWalletOners()).length);
            expect(0).to.equal((await crowdSaleToken.getTransferRequests()).length,"Transfer  Request Before Buy")
            let etherValue =  ethers.utils.parseEther("1");

            await crowdSaleToken.connect(addr3).createBuyRequest({value : etherValue})
            
            expect(etherValue).to.equal(await crowdSaleToken.pendingWithDrawals(mainOwner.address),"pending with drawals for  main owner ");
            let request = await crowdSaleToken.getTransferRequests();
            expect(1).to.equal((request).length,"Transfer request after Buy")
            expect(false).to.equal(await crowdSaleToken.getApprovals(request[0].id),"check the state of request of given id");
            expect(0).to.equal((await crowdSaleToken.getTransferRequests())[0].approvals,"check the number of approvals for given request id before first approve");
            await crowdSaleToken.approveTransferRequest(request[0].id);
            expect(1).to.equal((await crowdSaleToken.getTransferRequests())[0].approvals,"check the number of approvals for given request id after first approved");

            await crowdSaleToken.cancelTransferRequest(request[0].id)
            expect(etherValue).to.equal(await crowdSaleToken.pendingWithDrawals(addr3.address),"pending withDrawals for sender after cancel Transaction");            
            expect(0).to.equal(await crowdSaleToken.pendingWithDrawals(mainOwner.address),"pending WithDrawaals for mainOwner address ");            

            let request1 = await crowdSaleToken.getTransferRequests();
            expect(0).to.equal((request1).length,"Transfer request after Buy")
        }      
      });
      it("Create Buy Request and approve it.", async function () {
        let mainOwner:any, addr1:any,addr2:any , addr3:any, addr4:any, addr5:any;
        [mainOwner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();        
        const TokenContract = await ethers.getContractFactory("PakoToken");
        const tokenContract = await TokenContract.deploy();
        await tokenContract.deployed();
  
        const CrowdSaleToken = await ethers.getContractFactory("MultiSigCrowdSale");
        const crowdSaleToken = await CrowdSaleToken.deploy(tokenContract.address, tokenPrice);
        await crowdSaleToken.deployed();      
        // Provision 75% of all tokens to the token sale
        let availableBlance = ethers.utils.parseUnits("75000") ;
        let transaction =  await tokenContract.transfer(crowdSaleToken.address,availableBlance)
        expect(ethers.utils.parseUnits("75000").toString()).to.equal((await crowdSaleToken.getBalance(crowdSaleToken.address)).toString())
        
        if (transaction) {
            //check owners
            let ownerLen = (await crowdSaleToken.getWalletOners()).length;
            expect(ownerLen).to.equal(1);
            //add addr1 to owner
            await crowdSaleToken.addWalletOwner(addr1.address);
            //add addr2 to owner
            await crowdSaleToken.addWalletOwner(addr2.address);
            expect(3).to.equal((await crowdSaleToken.getWalletOners()).length);
            expect(0).to.equal((await crowdSaleToken.getTransferRequests()).length,"Length of Transfer  Request Before Buy")
            let pendingForMainOwner =  ethers.utils.parseEther("11");

            //Transfer Request #1
            await crowdSaleToken.connect(addr3).createBuyRequest({value : pendingForMainOwner})
            
            expect(pendingForMainOwner).to.equal(await crowdSaleToken.pendingWithDrawals(mainOwner.address),"pending with drawals for  main owner ");

            let request1 = await crowdSaleToken.getTransferRequests();
            expect(1).to.equal((request1).length,"Transfer request after Buy")
            expect(false).to.equal(await crowdSaleToken.getApprovals(request1[0].id),"check the state of request of given id");
            expect(0).to.equal((await crowdSaleToken.getTransferRequests())[0].approvals,"check the number of approvals for given request id before first approve");

            await crowdSaleToken.approveTransferRequest(request1[0].id);

            expect(true).to.equal(await crowdSaleToken.getApprovals(request1[0].id),"check the state of request of given id");  
            expect(1).to.equal((await crowdSaleToken.getTransferRequests())[0].approvals,"check the number of approvals for given request id after first approved");
            expect(0).to.equal(await crowdSaleToken.getBalance(addr3.address),"Token balance of addr3 before token transfer")

            await crowdSaleToken.connect(addr2).approveTransferRequest(0);
            
            expect(ethers.utils.parseUnits("1100")).to.equal(await crowdSaleToken.getBalance(addr3.address),"Token balance of addr3 after token transfer")
            expect(ethers.utils.parseUnits("73900").toString()).to.equal((await crowdSaleToken.getBalance(crowdSaleToken.address)).toString(),"contract Balance after token sold")
            
            
            //Transfer Request #2
            await crowdSaleToken.connect(addr4).createBuyRequest({value : ethers.utils.parseEther('1')})
            
            expect(ethers.utils.parseEther('12')).to.equal(await crowdSaleToken.pendingWithDrawals(mainOwner.address),"pending with drawals for  main owner ");
            

            let request2 = await crowdSaleToken.getTransferRequests();

            expect(1).to.equal((request2).length,"Length of Transfer request before cancel request ")
            expect(false).to.equal(await crowdSaleToken.getApprovals(request2[0].id),"check the state of request of given id");
            expect(0).to.equal((await crowdSaleToken.getTransferRequests())[0].approvals,"check the number of approvals for given request id before first approve");
            
            await crowdSaleToken.cancelTransferRequest(request2[0].id);

            expect(0).to.equal((await crowdSaleToken.getTransferRequests()).length,"length of Transfer request after cancel request")
            // expect(1).to.equal((await crowdSaleToken.getTransferRequests())[0].approvals,"check the number of approvals for given request id after first approved");
            expect(0).to.equal(await crowdSaleToken.getBalance(addr4.address),"Token balance of addr3 before token transfer")
            expect(pendingForMainOwner).to.equal(await crowdSaleToken.pendingWithDrawals(mainOwner.address),"pending with drawals for  main owner ");
            expect(ethers.utils.parseEther("1")).to.equal(await crowdSaleToken.pendingWithDrawals(addr4.address),"set pending with drawals for cancelled request buyer");
            let ethersOfAddr4Before = await ethers.provider.getBalance(addr4.address);

            await crowdSaleToken.connect(addr4).withdraw();

            expect(ethersOfAddr4Before).not.equal( await ethers.provider.getBalance(addr4.address),"ether send back to addr4 after cancel transaction")

            //endcrowdSale
            let ownerBeforeAfterEndSale = await crowdSaleToken.getBalance(mainOwner.address);
            let contractBalance = await crowdSaleToken.getBalance(crowdSaleToken.address);
            expect(false).to.equal(await crowdSaleToken.paused(),"Pauseable not Pause")

            await crowdSaleToken.endCrowdSaleRequest();

            let ownerBalanceAfterEndSale = await crowdSaleToken.getBalance(mainOwner.address);
            expect(ownerBeforeAfterEndSale).not.equal(ownerBalanceAfterEndSale,"Token balance of addr3 after token transfer")
            expect(ethers.utils.parseUnits("0").toString()).to.equal((await crowdSaleToken.getBalance(crowdSaleToken.address)).toString(),"contract Balance after token sold")
            expect(true).to.equal(await crowdSaleToken.paused(),"Pauseable Paused No one can create BuyRequest")

            await crowdSaleToken.withdraw()

            expect(0).to.equal(await crowdSaleToken.pendingWithDrawals(mainOwner.address));            
            
        }      
      });      
    })