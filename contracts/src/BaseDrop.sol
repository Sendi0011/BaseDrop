// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseDrop is Ownable {
    uint256 public campaignCount;

    constructor() Ownable(msg.sender) {}
}
