"use client"

import { useState } from "react"
import { useWallets } from "@privy-io/react-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { getContract } from "@/lib/contract"
import type { Campaign } from "@/types"
import { Loader2, Coins, Users, Gift, DollarSign } from "lucide-react"

interface CampaignCardProps {
  campaign: Campaign
  onUpdate: () => void
  userAddress?: string
}

export function CampaignCard({ campaign, onUpdate, userAddress }: CampaignCardProps) {
  const { wallets } = useWallets()
  const { toast } = useToast()
  const [claimLoading, setClaimLoading] = useState(false)
  const [fundLoading, setFundLoading] = useState(false)
  const [referrer, setReferrer] = useState("")
  const [fundAmount, setFundAmount] = useState("")
  const [openClaim, setOpenClaim] = useState(false)
  const [openFund, setOpenFund] = useState(false)

  const isCreator = userAddress?.toLowerCase() === campaign.creator.toLowerCase()
  const progress = (campaign.claims / campaign.maxClaims) * 100

  const handleClaim = async () => {
    if (!wallets[0]) return

    try {
      setClaimLoading(true)
      const contract = await getContract(wallets[0])

      const tx = await contract.claim(campaign.id, referrer || "0x0000000000000000000000000000000000000000")

      await tx.wait()

      toast({
        title: "Claimed!",
        description: "You have successfully claimed your reward.",
      })

      setOpenClaim(false)
      setReferrer("")
      onUpdate()
    } catch (error: any) {
      console.error("[v0] Error claiming:", error)
      toast({
        title: "Error",
        description: error?.reason || "Failed to claim. You may have already claimed.",
        variant: "destructive",
      })
    } finally {
      setClaimLoading(false)
    }
  }

  const handleFund = async () => {
    if (!wallets[0]) return

    try {
      setFundLoading(true)
      const contract = await getContract(wallets[0])

      const tx = await contract.fundCampaign(campaign.id, BigInt(fundAmount))
      await tx.wait()

      toast({
        title: "Funded!",
        description: "Campaign has been funded successfully.",
      })

      setOpenFund(false)
      setFundAmount("")
      onUpdate()
    } catch (error) {
      console.error("[v0] Error funding:", error)
      toast({
        title: "Error",
        description: "Failed to fund campaign. Make sure you have approved the tokens.",
        variant: "destructive",
      })
    } finally {
      setFundLoading(false)
    }
  }

  const handleClose = async () => {
    if (!wallets[0]) return

    try {
      const contract = await getContract(wallets[0])
      const tx = await contract.closeCampaign(campaign.id)
      await tx.wait()

      toast({
        title: "Campaign closed",
        description: "Your campaign has been deactivated.",
      })

      onUpdate()
    } catch (error) {
      console.error("[v0] Error closing:", error)
      toast({
        title: "Error",
        description: "Failed to close campaign.",
        variant: "destructive",
      })
    }
  }

  const handleWithdraw = async () => {
    if (!wallets[0]) return

    try {
      const contract = await getContract(wallets[0])
      const tx = await contract.withdraw(campaign.id)
      await tx.wait()

      toast({
        title: "Withdrawn",
        description: "Funds have been withdrawn successfully.",
      })

      onUpdate()
    } catch (error) {
      console.error("[v0] Error withdrawing:", error)
      toast({
        title: "Error",
        description: "Failed to withdraw funds.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">Campaign #{campaign.id}</CardTitle>
          <Badge variant={campaign.active ? "default" : "secondary"}>{campaign.active ? "Active" : "Closed"}</Badge>
        </div>
        <CardDescription className="font-mono text-xs">
          {campaign.token.slice(0, 6)}...{campaign.token.slice(-4)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Gift className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Reward:</span>
            <span className="font-medium">{(Number(campaign.rewardPerClaim) / 1e18).toFixed(4)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Referral:</span>
            <span className="font-medium">{(Number(campaign.referralBonus) / 1e18).toFixed(4)}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {campaign.claims}/{campaign.maxClaims}
              </span>
            </div>
            <Progress value={progress} />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          {campaign.active && !isCreator && (
            <Dialog open={openClaim} onOpenChange={setOpenClaim}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Coins className="mr-2 h-4 w-4" />
                  Claim Reward
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Claim Your Reward</DialogTitle>
                  <DialogDescription>Enter a referrer address to give them a bonus (optional)</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="referrer">Referrer Address (Optional)</Label>
                    <Input
                      id="referrer"
                      placeholder="0x..."
                      value={referrer}
                      onChange={(e) => setReferrer(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleClaim} disabled={claimLoading} className="w-full">
                  {claimLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {claimLoading ? "Claiming..." : "Claim Now"}
                </Button>
              </DialogContent>
            </Dialog>
          )}

          {isCreator && (
            <>
              <Dialog open={openFund} onOpenChange={setOpenFund}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Fund
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Fund Campaign</DialogTitle>
                    <DialogDescription>
                      Add tokens to your campaign. Make sure to approve the contract first.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (in wei)</Label>
                      <Input
                        id="amount"
                        placeholder="1000000000000000000"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={handleFund} disabled={fundLoading} className="w-full">
                    {fundLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {fundLoading ? "Funding..." : "Fund Campaign"}
                  </Button>
                </DialogContent>
              </Dialog>
              <div className="flex gap-2">
                {campaign.active && (
                  <Button variant="outline" size="sm" onClick={handleClose} className="flex-1 bg-transparent">
                    Close
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleWithdraw} className="flex-1 bg-transparent">
                  Withdraw
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
