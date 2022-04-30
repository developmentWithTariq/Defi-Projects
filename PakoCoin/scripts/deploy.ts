// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { AbiCoder } from "ethers/lib/utils";
import { ethers } from "hardhat";

async function main() {
  const [owner, addr1, addr2 ] = await ethers.getSigners()
  const PakoToken = await ethers.getContractFactory("PakoToken");
  // const pakoToken = await PakoToken.attach("0x7422858126598B08b2b41bB79D2Cf167D0300196");
  const pakoToken = await PakoToken.deploy();
  // await pakoToken.deployed();

  console.log("Greeter deployed to:", pakoToken.address);
  const balanceOfOwner =await pakoToken.balanceOf(await pakoToken.getOwner());
  console.log(balanceOfOwner);
  const initialSupply= await pakoToken._initialSupply();
  console.log("initial Supply", initialSupply)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
