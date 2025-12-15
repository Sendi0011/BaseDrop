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

    function createCampaign(
        address token,
        uint256 rewardPerClaim,
        uint256 referralBonus,
        uint256 maxClaims
    ) external returns (uint256) {
        require(maxClaims > 0, "invalid max");

        campaignCount++;

        campaigns[campaignCount] = Campaign({
            creator: msg.sender,
            token: IERC20(token),
            rewardPerClaim: rewardPerClaim,
            referralBonus: referralBonus,
            maxClaims: maxClaims,
            claims: 0,
            active: true
        });

        return campaignCount;
    }

    function fundCampaign(uint256 id, uint256 amount) external {
    Campaign storage c = campaigns[id];
    require(msg.sender == c.creator, "not creator");

    c.token.transferFrom(msg.sender, address(this), amount);
}

}
