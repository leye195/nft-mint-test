import { ComponentProps } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai } from "wagmi/chains";

const { publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const AppProvider = ({ children }: ComponentProps<"div">) => {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};

export default AppProvider;
