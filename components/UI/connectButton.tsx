import React, { useEffect, useState } from "react";
import { useAccount, useConnect } from "@starknet-react/core";
import Button from "./button";
import { FunctionComponent } from "react";
import { Connector } from "starknetkit";
import WalletConnect from "./walletConnect";
import styles from "../../styles/components/walletConnect.module.css";
import ArrowDownIcon from "./iconsComponents/icons/arrowDownIcon";
import { getConnectorIcon, getLastConnector } from "@/utils/connectorWrapper";

const ConnectButton: FunctionComponent = () => {
  const { isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const [showWalletConnectModal, setShowWalletConnectModal] =
    useState<boolean>(false);
  const [lastConnector, setLastConnector] = useState<Connector | null>(null);

  useEffect(() => {
    setLastConnector(getLastConnector());
  }, [isConnected]);

  const connectWallet = async (connector: Connector) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await connectAsync({ connector: connector });
    localStorage.setItem("SID-connectedWallet", connector.id);
  };

  return (
    <>
      <Button
        onClick={
          lastConnector
            ? () => connectWallet(lastConnector)
            : () => setShowWalletConnectModal(true)
        }
      >
        <div className={styles.connectBtn}>
          {lastConnector ? (
            <img
              src={getConnectorIcon(lastConnector.id)}
              className={styles.btnIcon}
            />
          ) : null}
          <p className="mx-auto">Connect wallet</p>
          {lastConnector ? (
            <div
              className={styles.arrowDown}
              onClick={(e) => {
                setShowWalletConnectModal(true);
                e.stopPropagation();
              }}
            >
              <ArrowDownIcon width="18" color="#FFF" className="mt-1 ml-1" />
            </div>
          ) : null}
        </div>
      </Button>
      <WalletConnect
        closeModal={() => setShowWalletConnectModal(false)}
        open={showWalletConnectModal}
        connectors={connectors as Connector[]}
        connectWallet={connectWallet}
      />
    </>
  );
};
export default ConnectButton;
