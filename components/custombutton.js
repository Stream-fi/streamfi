import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@chakra-ui/react";

export const ConnectBtn = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    borderRadius={"7px"}
                    bg={"rgba(255,255,255,0.02)"}
                    border={"1px solid rgba(255, 255, 255, 0.15)"}
                    h={"44px"}
                    w={"147px"}
                    justify={"center"}
                    align={"center"}
                    fontFamily={"22px"}
                    fontWeight={"400"}
                    _active={{}}
                    _hover={{
                      background: "rgba(255,255,255,0.04)",
                      boxShadow: "0px 1px 12px rgba(255,255,255,0.05)",
                    }}
                  >
                    Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button
                    onClick={openChainModal}
                    type="button"
                    borderRadius={"7px"}
                    bg={"rgba(255,255,255,0.02)"}
                    border={"1px solid rgba(255, 255, 255, 0.15)"}
                    h={"44px"}
                    w={"147px"}
                    justify={"center"}
                    align={"center"}
                    fontFamily={"22px"}
                    fontWeight={"400"}
                    _active={{}}
                    _hover={{
                      background: "rgba(255,255,255,0.04)",
                      boxShadow: "0px 1px 12px rgba(255,255,255,0.05)",
                    }}
                  >
                    Wrong network
                  </Button>
                );
              }
              return (
                <div style={{ display: "flex", gap: 12 }}>
                  <Button
                    onClick={openAccountModal}
                    type="button"
                    borderRadius={"7px"}
                    bg={"rgba(255,255,255,0.02)"}
                    border={"1px solid rgba(255, 255, 255, 0.15)"}
                    h={"44px"}
                    w={"147px"}
                    justify={"center"}
                    align={"center"}
                    fontFamily={"22px"}
                    fontWeight={"400"}
                    _active={{}}
                    _hover={{
                      background: "rgba(255,255,255,0.04)",
                      boxShadow: "0px 1px 12px rgba(255,255,255,0.05)",
                    }}
                  >
                    Connected
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
