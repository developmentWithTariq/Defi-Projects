// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import abi from  "./PakoToken.json";
let contractAbi = abi.abi;

async function main() {
  const [owner, addr1, addr2 ] = await ethers.getSigners()
  const PakoToken = await ethers.getContractFactory("PakoToken");  
  const pakoToken = await PakoToken.attach("0x664a5aCf2acAa8bbc9F7302E4EC933A5E19E1d95");
  // await pakoToken.deployed();

  console.log("Greeter deployed to:", pakoToken.address);
  //balance of owenr
  const balanceOfOwner =await pakoToken.balanceOf(await pakoToken.owner());
  console.log(balanceOfOwner);
  //initial Supply 
  const initialSupply= await pakoToken._initialSupply();
  console.log("initial Supply", initialSupply);  


function send_token(contract_address:any,
  send_token_amount:any,
  to_address:any,
  send_account:any,
  private_key:any
  	){

  //your metamask wallet
  let wallet = new ethers.Wallet(private_key)
  // connect with etherjs
  let walletSigner = wallet.connect(ethers.provider)
  //get gas price
  ethers.provider.getGasPrice().then((currentGasPrice) => {
    let gas_price = ethers.utils.hexlify(parseInt( currentGasPrice.toString()))
    console.log(`gas_price: ${gas_price}`)
      
  if (contract_address) {
      // general token send
    let contract = new ethers.Contract(
      contract_address,
      contractAbi,
      walletSigner)
        
    // How many tokens?
    let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18)
    console.log(`numberOfTokens: ${numberOfTokens}`)

    // Send tokens
    contract.transfer(to_address, numberOfTokens).then((transferResult:boolean) => {
      console.dir(transferResult)
      // alert("sent token")
    })
  } // ether send
  else {
    const tx = {
    from: send_account, //from 0xDdF1303c0d6aefa77d28eaDB5aa5835bdB445bA7
    to: to_address, // to 0x12bD0171aF61eF6d9B46935DC0067d38CF1Be662
    value: ethers.utils.parseEther(send_token_amount), // "1" pakoToken 
    nonce: ethers.provider.getTransactionCount(
      send_account,
      "latest"
    ),
    gasLimit: ethers.utils.hexlify(gas_limit), // 100000
    gasPrice: gas_price,
  }
  console.dir(tx)
  try {
    walletSigner.sendTransaction(tx).then((transaction) => {
      console.dir(transaction)
      alert("Send finished!")
    })
  } catch (error) {
    alert("failed to send!!")
  }}
  })
}
  
let private_key ="6932f4e79184aba14c86fbb36df27ecfdf5030d2a0f086894dc4c1f6dca07e2b"
let send_token_amount = "1"
let to_address = "0x12bD0171aF61eF6d9B46935DC0067d38CF1Be662";
let send_address = "0xDdF1303c0d6aefa77d28eaDB5aa5835bdB445bA7";
let gas_limit = "0x100000"
let wallet = new ethers.Wallet(private_key)
let walletSigner = wallet.connect(ethers.provider)
let contract_address = pakoToken.address;
ethers.provider = new ethers.providers.InfuraProvider("ropsten")
	
send_token(
  contract_address,
	send_token_amount,
	to_address,
	send_address,
	private_key
	)

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
