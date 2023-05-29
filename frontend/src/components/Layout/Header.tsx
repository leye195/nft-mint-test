import { useAccount, useDisconnect } from "wagmi";
import { Link } from "react-router-dom";

import Flex from "@/components/Flex";

const Header = () => {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <header
      style={{
        padding: "12px",
        width: "100%",
        backgroundColor: "#3c76c8",
      }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Link to="/">
          <span
            style={{
              color: "white",
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            NFT Mint
          </span>
        </Link>
        <Flex gap="12px" alignItems="center">
          <Link to="/sale">
            <span
              style={{
                color: "white",
                fontWeight: 800,
                fontSize: 20,
              }}
            >
              on Sale
            </span>
          </Link>
          {isConnected && (
            <>
              <Link to="/my-token">
                <span
                  style={{
                    color: "white",
                    fontWeight: 800,
                    fontSize: 20,
                  }}
                >
                  My Token
                </span>
              </Link>
              <button onClick={() => disconnect()}>Disconnect</button>
            </>
          )}
        </Flex>
      </Flex>
    </header>
  );
};

export default Header;
