import {ethers} from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const Token = await ethers.getContractFactory("MockERC20");
    const token = await Token.deploy("Mock Token", "MTK", ethers.parseEther("1000000000")); // Initial supply of 1 million tokens
    console.log("MockERC20 contract deployed to:", token);
  
    const recipient = "0x8221e7579FFB07c7b93B15Fc42f4ccC2B0E71808";
    const recipient1 = "0x411B16f6ab04dA7A555da838d1198fC1C3E4A089";

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