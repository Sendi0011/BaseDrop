export interface Campaign {
    id: number
    creator: string
    token: string
    rewardPerClaim: string
    referralBonus: string
    maxClaims: number
    claims: number
    active: boolean
  }
  