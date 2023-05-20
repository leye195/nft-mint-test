import { useAccount, useDisconnect } from "wagmi";
import Flex from "../Flex";
import { Link } from "react-router-dom";

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
        {isConnected && (
          <Flex gap="12px" alignItems="center">
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
          </Flex>
        )}
      </Flex>
    </header>
  );
};

export default Header;
