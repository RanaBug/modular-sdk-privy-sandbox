/* eslint-disable @typescript-eslint/no-explicit-any */
"useClient";
import { EtherspotBundler, Factory, ModularSdk } from "@etherspot/modular-sdk";
import { WalletProvider } from "@etherspot/modular-sdk/dist/cjs/sdk/wallet/providers/interfaces";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";

const Login = () => {
  const { login, logout, user, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const [provider, setProvider] = useState<any | undefined>(undefined);
  const [etherspotWalletAddress, setEtherspotWalletAddress] = useState("");

  useEffect(() => {
    if (!wallets.length) return;

    // if there is at least one Privy wallet authentificated, we can start find a provider
    const updateProvider = async () => {
      const privyWalletAddress = user?.wallet?.address;

      const walletProvider = wallets.find(
        (wallet) => wallet.address === privyWalletAddress
      );

      if (walletProvider) {
        const privyProvider = await walletProvider.getEthereumProvider();

        // Using the Viem library to create a wallet provider
        const walletClient = createWalletClient({
          account: walletProvider.address as `0x${string}`,
          chain: polygon,
          transport: custom(privyProvider),
        });

        setProvider(walletClient);
      }
    };

    updateProvider();
  }, [wallets, user]);

  const etherspotModularSdkInstatiation = async () => {
    const etherspotModularSdk = new ModularSdk(provider as WalletProvider, {
      chainId: 137, // any chainId compatible with the Modular SDK
      bundlerProvider: new EtherspotBundler(
        137, // any chainId compatible with the Modular SDK
        process.env.REACT_APP_ETHERSPOT_BUNDLER_API_KEY // Etherspot Bundler API Key
      ),
      factoryWallet: "etherspotModular" as Factory,
    });

    // load the address into SDK state
    const walletAddress = await etherspotModularSdk.getCounterFactualAddress();

    setEtherspotWalletAddress(walletAddress);
    return etherspotModularSdk;
  };

  useEffect(() => {
    if (provider) {
      etherspotModularSdkInstatiation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  return (
    <div className="flex flex-col justify-center items-center p-16 gap-10">
      <div className="flex gap-4">
        {authenticated ? (
          <button className="px-6 py-3 bg-red rounded-lg" onClick={logout}>
            Logout
          </button>
        ) : (
          <button className="px-6 py-3 bg-green rounded-lg" onClick={login}>
            Login with Privy
          </button>
        )}
      </div>
      {authenticated && (
        <p>
          Your Modular wallet address:{" "}
          <span className="font-bold">{etherspotWalletAddress}</span>
        </p>
      )}
    </div>
  );
};

export default Login;
