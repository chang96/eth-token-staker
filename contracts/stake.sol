// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Staker is Ownable, ReentrancyGuard {
    using Math for uint256;
    using SafeERC20 for IERC20;

    IERC20 public stakingToken;
    uint256 public minimumStakingPeriod = 1 days;
    uint256 public minimumStakingAmount = 1 * 10 ** 18;
    uint256 public rewardRate = 100;
    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
    }

    mapping (address => StakeInfo) public AddressStakeInfoMap;
    mapping (address => uint256) public AddressRewardMap;

   constructor(address _stakingToken) Ownable(msg.sender){
        stakingToken = IERC20(_stakingToken);
    }

    function stake (uint256 _amount) external nonReentrant { 
        require(_amount >= minimumStakingAmount, "amount must be >= minimumStaking");
        stakingToken.safeTransferFrom(msg.sender, address(this), _amount);

        StakeInfo storage stakeInfo = AddressStakeInfoMap[msg.sender];
        if (stakeInfo.amount > 0) {
            uint256 reward = calculateReward(msg.sender);
            AddressRewardMap[msg.sender] = AddressRewardMap[msg.sender] + reward;

        }
        stakeInfo.amount = stakeInfo.amount + (_amount);
        stakeInfo.timestamp = block.timestamp;

    }

    function unstake (uint256 _amount) external nonReentrant {
        StakeInfo storage stakeInfo = AddressStakeInfoMap[msg.sender];
        require(stakeInfo.amount > _amount, "unable to unstake");
        uint256 rewards = calculateReward(msg.sender);

        AddressRewardMap[msg.sender] = AddressRewardMap[msg.sender] + rewards;

        uint256 penalty = 0;
        if (block.timestamp < stakeInfo.timestamp + minimumStakingPeriod) {
            penalty = _amount / 10;
        }

        uint256 totalAmountToReturn = _amount - penalty;

        stakeInfo.amount = stakeInfo.amount - _amount;

        stakingToken.safeTransfer(msg.sender, totalAmountToReturn);

        AddressRewardMap[msg.sender] = AddressRewardMap[msg.sender] + rewards;
    }

    function calculateReward (address sender) internal view returns (uint256){
        StakeInfo storage stakeInfo = AddressStakeInfoMap[sender];
        if(stakeInfo.amount == 0){
            return 0;
        }
        
        uint256 stakingDuration = block.timestamp - stakeInfo.timestamp;
        uint256 rewards = ( stakeInfo.amount * (rewardRate) * (stakingDuration) ) / (1 days);


        return rewards;
    }

    function setRewardRate(uint256 _rewardRate) external onlyOwner {
        rewardRate = _rewardRate;
    }

    function setMinimumStakingAmount(uint256 _amount) external onlyOwner {
        minimumStakingAmount = _amount;
    }

    function setMinimumStakingPeriod(uint256 _period) external onlyOwner {
        minimumStakingPeriod = _period;
    }

    function withdrawERC20(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }
}