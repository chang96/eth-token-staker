import dotenv from "dotenv";
dotenv.config();
import {ethers} from "hardhat"
async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Staker = await ethers.getContractFactory("Staker");
    const stakingTokenAddress = process.env.TOKEN_CONTRACT_ADDRESS!;
  
    const staker = await Staker.deploy(stakingTokenAddress);
    console.log("Staker contract deployed to:", staker);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  