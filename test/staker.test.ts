import {expect} from "chai"
import { Signer } from "ethers";
import {ethers} from "hardhat"
import { MockERC20, Staker__factory, Staker } from "../typechain-types";

describe("Staker Contract", function () {
  let Staker: Staker__factory
  let staker: Staker
  let stakingToken: MockERC20
  let owner: Signer
  let addr1: Signer
  let addr2: Signer

  const initialBalance = ethers.parseEther("100000");

  beforeEach(async function () {
    const Token = await ethers.getContractFactory("MockERC20");
    stakingToken = await Token.deploy("Test Token", "TT", initialBalance);
    await stakingToken.waitForDeployment();

    Staker = await ethers.getContractFactory("Staker");
    staker = await Staker.deploy(stakingToken);
    await staker.waitForDeployment();

    [owner, addr1, addr2] = await ethers.getSigners();
    await stakingToken.mint(await addr1.getAddress(), ethers.parseEther("1000"));
  });

  it("Should allow staking", async function () {
    await stakingToken.connect(addr1).approve(staker, ethers.parseEther("10"));
    
    await expect(staker.connect(addr1).stake(ethers.parseEther("10")))


    const stakeInfo = await staker.AddressStakeInfoMap(addr1);
    expect(stakeInfo.amount).to.equal(ethers.parseEther("10"));
  });

  it("Should allow unstaking", async function () {
    await stakingToken.connect(addr1).approve(staker, ethers.parseEther("10"));
    await staker.connect(addr1).stake(ethers.parseEther("10"));

    await expect(staker.connect(addr1).unstake(ethers.parseEther("10")))

  });

  it("Should penalize early unstake", async function () {
    await stakingToken.connect(addr1).approve(staker, ethers.parseEther("10"));
    await staker.connect(addr1).stake(ethers.parseEther("10"));

    await ethers.provider.send("evm_increaseTime", [3600]); 
    await ethers.provider.send("evm_mine", []);

    await expect(staker.connect(addr1).unstake(ethers.parseEther("10"))).to.be.revertedWith("unable to unstake");
  });

  it("Should allow the owner to update reward rate", async function () {
    await staker.setRewardRate(200);
    expect(await staker.rewardRate()).to.equal(200);
  });
});
