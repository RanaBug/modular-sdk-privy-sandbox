"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { polygon } from "viem/chains";

// components
import Login from "./components/Login/Login";

export default function Home() {
  // PrivyProvider will give you access to the Privy Login UI and to Privy Hooks
  return (
    <PrivyProvider
      appId={process.env.REACT_APP_PRIVY_APP_ID || ""}
      config={{
        appearance: {
          theme: "dark",
        },
        defaultChain: polygon,
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      <Login />
    </PrivyProvider>
  );
}
