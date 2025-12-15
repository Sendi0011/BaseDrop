import { ethers } from "ethers"
import type { ConnectedWallet } from "@privy-io/react-auth"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x..." // Replace with your deployed contract address

const ABI = [
  "function campaignCount() view returns (uint256)",
  "function campaigns(uint256) view returns (address creator, address token, uint256 rewardPerClaim, uint256 referralBonus, uint256 maxClaims, uint256 claims, bool active)",
  "function hasClaimed(uint256, address) view returns (bool)",
  "function createCampaign(address token, uint256 rewardPerClaim, uint256 referralBonus, uint256 maxClaims) returns (uint256)",
  "function fundCampaign(uint256 id, uint256 amount)",
  "function claim(uint256 id, address referrer)",
  "function closeCampaign(uint256 id)",
  "function withdraw(uint256 id)",
]

export async function getContract(wallet: ConnectedWallet) {
  const provider = await wallet.getEthersProvider()
  const signer = await provider.getSigner()
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
}
