// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseDrop is Ownable {
    uint256 public campaignCount;

    struct Campaign {
    address creator;
    IERC20 token;
    uint256 rewardPerClaim;
    uint256 referralBonus;
    uint256 maxClaims;
    uint256 claims;
    bool active;
}

 mapping(uint256 => Campaign) public campaigns;
 mapping(uint256 => mapping(address => bool)) public hasClaimed;


    constructor() Ownable(msg.sender) {}
}
