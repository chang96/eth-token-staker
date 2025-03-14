import dotenv from "dotenv";
dotenv.config();
import {ethers} from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Token = await ethers.getContractFactory("MockERC20");
    const token = await Token.deploy("Mock Token", "MTK", ethers.parseEther("1000000000"));
    console.log("MockERC20 contract deployed to:", JSON.stringify(token));

    const recipient = process.env.RECIPIENT! 
    const recipient1 = process.env.RECIPIENT1!

    await token.mint(recipient, ethers.parseEther("1000000"));
    await token.transfer(recipient1, ethers.parseEther("1500000"));
    console.log("Minted tokens to:", recipient, recipient1);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });