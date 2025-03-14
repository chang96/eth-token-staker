import { ethers } from "ethers";
import dotenv from "dotenv";
import stakerAbi from "./stakerAbi.json";
import mock from "./mockercAbi.json";
dotenv.config();


const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL!);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const STAKING_CONTRACT_ADDRESS = process.env.STAKING_CONTRACT!;
const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS!;

const stakingContract = new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakerAbi.abi, signer);

const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, mock.abi, signer);

async function approveTokens(amount: string) {
    try {
        const tx = await tokenContract.approve(STAKING_CONTRACT_ADDRESS, ethers.parseEther(amount));
        await tx.wait();
        console.log(`approved ${amount} tokens for staking.`);
    } catch (error) {
        console.error("error approving tokens:", error);
    }
}

async function stakeTokens(amount: string) {
    try {
        const tx = await stakingContract.stake(ethers.parseEther(amount));
        await tx.wait();
        console.log(`staked ${amount} tokens.`);
    } catch (error) {
        console.error("error staking tokens:", error);
    }
}


async function getStakedBalance(userAddress: string) {
    try {
        const balance = await stakingContract.stakes(userAddress);
        console.log(`staked Balance: ${ethers.formatEther(balance.amount)} tokens`);
        return balance;
    } catch (error) {
        console.error("error fetching staked balance:", error);
    }
}

async function getRewards(userAddress: string) {
    try {
        const rewards = await stakingContract.calculateRewards(userAddress);
        console.log(`rewards: ${ethers.formatEther(rewards)} tokens`);
        return rewards;
    } catch (error) {
        console.error("error fetching rewards:", error);
    }
}

async function unstakeTokens() {
    try {
        const tx = await stakingContract.unstake();
        await tx.wait();
        console.log("unstaked tokens.");
    } catch (error) {
        console.error("error unstaking tokens:", error);
    }
}

// approveTokens("10000")
// stakeTokens("10000")



