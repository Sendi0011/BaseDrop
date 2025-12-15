"use client"

import { useState, useEffect } from "react"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateCampaignDialog } from "@/components/create-campaign-dialog"
import { CampaignCard } from "@/components/campaign-card"
import { Wallet, Plus, Coins } from "lucide-react"
import { getContract } from "@/lib/contract"
import type { Campaign } from "@/types"

export default function HomePage() {
  const { ready, authenticated, login } = usePrivy()
  const { wallets } = useWallets()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (authenticated && wallets[0]) {
      loadCampaigns()
    }
  }, [authenticated, wallets])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const contract = await getContract(wallets[0])
      const count = await contract.campaignCount()

      const campaignData: Campaign[] = []
      for (let i = 1; i <= Number(count); i++) {
        const campaign = await contract.campaigns(i)
        campaignData.push({
          id: i,
          creator: campaign.creator,
          token: campaign.token,
          rewardPerClaim: campaign.rewardPerClaim.toString(),
          referralBonus: campaign.referralBonus.toString(),
          maxClaims: Number(campaign.maxClaims),
          claims: Number(campaign.claims),
          active: campaign.active,
        })
      }
      setCampaigns(campaignData)
    } catch (error) {
      console.error("[v0] Error loading campaigns:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Coins className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">BaseDrop</span>
            </div>
            <Button onClick={login} size="lg">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="max-w-3xl w-full space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
                Token airdrops with referral rewards
              </h1>
              <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
                Create campaigns, reward your community, and grow through referrals. The decentralized platform for
                token distribution on Base.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={login} className="text-lg px-8 py-6">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                View Campaigns
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Create</CardTitle>
                  <CardDescription>Launch your token campaign in seconds</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Distribute</CardTitle>
                  <CardDescription>Reward users with your tokens</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Grow</CardTitle>
                  <CardDescription>Incentivize referrals and expand reach</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Coins className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">BaseDrop</span>
          </div>
          <div className="flex items-center gap-3">
            <CreateCampaignDialog onSuccess={loadCampaigns}>
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </CreateCampaignDialog>
            <Button variant="outline" size="lg">
              <Wallet className="mr-2 h-4 w-4" />
              {wallets[0]?.address.slice(0, 6)}...{wallets[0]?.address.slice(-4)}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Active Campaigns</h2>
            <p className="text-muted-foreground">Browse and claim rewards from available campaigns</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-10 bg-muted rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <Coins className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to create a token distribution campaign</p>
                <CreateCampaignDialog onSuccess={loadCampaigns}>
                  <Button size="lg">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                </CreateCampaignDialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onUpdate={loadCampaigns}
                  userAddress={wallets[0]?.address}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
