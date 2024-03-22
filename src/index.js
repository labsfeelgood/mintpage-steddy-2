import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  RainbowKitProvider,
  darkTheme,
  getDefaultWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { alchemyProvider } from 'wagmi/providers/alchemy'

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygonMumbai],
  [alchemyProvider({ apiKey: 'pzhiewREmfem569HvPQYHcYMff637qfX' })]
);

const { connectors } = getDefaultWallets({
  appName: "Flip Coin Game",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider
      chains={chains}
      theme={darkTheme({ accentColor: "#28a53c" })}
    >
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>
    </RainbowKitProvider>
  </WagmiConfig>
</React.StrictMode>
  // <React.StrictMode>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
