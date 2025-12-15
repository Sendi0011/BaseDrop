export function Providers({ children }: { children: React.ReactNode }) {
    return (
      <WagmiConfig config={config}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </WagmiConfig>
    )
  }
  