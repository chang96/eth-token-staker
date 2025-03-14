# Token-Staking-Task

This project implements a **staking** using Solidity. Users can **stake and unstake** their token via a deployed smart contract.

## 🚀 Features

- **approvetoken** 
- **stake** 
- **getstakedbalance** 
- **getstatedrewards**
- **unstake tokens**

- **Interact using Ethers.js**.

## Setup

### Clone the Repository
```sh
git clone https://github.com/chang96/eth-token-staker.git
cd eth-token-staker
```

### Install Dependencies
```sh
npm install
```

### Set Up Environment Variables
Create a `.env` file in the root directory based on .env.sample

## Deployment
To deploy the contract to a testnet (e.g., Sepolia):
```sh
 npx hardhat run scripts/deploy-test-tokens.ts --network sepolia
npx hardhat run scripts/deploy.ts --network sepolia   
```

## Interaction with the Smart Contract

Use **Ethers.js** to interact with the contract. The functions are located in `etherjs-sample.ts`.

### Available Functions (in `etherjs-sample.ts`):

- **approve**: `approveTokens`
- **stake**: `stakeTokens`
- **get stake balance**: `getStakedBalance`
- **get rewards**: `getRewards`
- **untake tokens**: `unstakeTokens`

## Testing
Run automated tests using Hardhat:
```sh
npx hardhat test
```

## License

MIT

