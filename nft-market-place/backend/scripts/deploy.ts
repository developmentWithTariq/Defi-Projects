// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  
  // Get the ContractFactories and Signers here.
  const NFT = await ethers.getContractFactory("NFT");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  // deploy contracts
  const marketplace = await Marketplace.deploy(1);
  await marketplace.deployed();
  const nft = await NFT.deploy();
  await nft.deployed();

  console.log("Market Place contract address", marketplace.address)
  console.log("Nft contract address", nft.address)

  // Save copies of each contracts abi and address to the frontend.
  // saveFrontendFiles(marketplace , "Marketplace");
  // saveFrontendFiles(nft , "NFT");
}


// function saveFrontendFiles(contract:any, name:string) {
//   const fs = require("fs");
//   const contractsDir = __dirname + "/../../frontend/contractsData";

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   fs.writeFileSync(
//     contractsDir + `/${name}-address.json`,
//     JSON.stringify({ address: contract.address }, undefined, 2)
//   );
//   // import {abi } from `../artifacts/contracts/{name}`;
//   // const contractArtifact = ethers.getContractAtFromArtifact() artifacts.readArtifactSync(name);
  
//   fs.writeFileSync(
//     contractsDir + `/${name}.json`,
//     JSON.stringify(contractArtifact, null, 2)
//   );
// }

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });