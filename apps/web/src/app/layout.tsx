'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { PermissionlessContextProvider } from '../context/permissionless-context';
import { PassKeyContextProvider } from '../context/passkey-context';
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { lineaTestnet } from 'viem/chains';
import { UiContextProvider } from '../context/ui-context';
import { Analytics } from '@vercel/analytics/react';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [lineaTestnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Analytics />
        <WagmiConfig config={config}>
          <UiContextProvider>
            <PassKeyContextProvider>
              <PermissionlessContextProvider>
                <>{children}</>
              </PermissionlessContextProvider>
            </PassKeyContextProvider>
          </UiContextProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
