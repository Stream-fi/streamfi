import { Flex, Image, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ConnectBtn } from "./custombutton";
import { useRouter } from "next/router";
export default function Header() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [header, setHeader] = useState("");

  // const checkIfWalletIsConnected = async () => {
  //   console.log("runs");
  //   const { ethereum } = window;

  //   if (!ethereum) {
  //     console.log("Make sure you have metamask!");
  //     return;
  //   } else {
  //     console.log("We have the ethereum object", ethereum);
  //     setIsConnected(true);
  //   }

  //   const accounts = await window.ethereum.request({ method: "eth_accounts" });
  //   const chain = await window.ethereum.request({ method: "eth_chainId" });
  //   let chainId = chain;
  //   console.log("chain ID:", chain);
  //   console.log("global Chain Id:", chainId);
  //   if (accounts.length !== 0) {
  //     console.log("Found an authorized account:", accounts[0]);
  //     setCurrentAccount(accounts[0]);
  //   } else {
  //     console.log("No authorized account found");
  //   }
  // };

  // useEffect(() => {
  //   checkIfWalletIsConnected();
  // }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setIsConnected(true);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const disconnectHandler = () => {
    setIsConnected(false);
  };

  useEffect(() => {
    const path = router.asPath;
    if (path == "/create") {
      setHeader("create");
    } else if (path == "/dashboard") {
      setHeader("dashboard");
    }
  }, [router.asPath]);

  return (
    <>
      <Flex
        display={{ base: "none", lg: "flex" }}
        bg={"#0F1215"}
        fontFamily={"Space Grotesk, sans-serif"}
        color={"white"}
        align={"center"}
        flexDir={"column"}
      >
        <Flex h={"44px"} marginTop={"45px"} gap={"935px"}>
          <Flex align={"center"} gap={"16px"}>
            <Link href={"./"}>
              <Image src={"logo.svg"} alt={"logo"} h={"20px"} w={"28.57px"} />
            </Link>
            <Link href={"./create"}>
              <Text
                fontSize={"20px"}
                fontWeight={"medium"}
                whiteSpace={"nowrap"}
                opacity={header == "create" ? "100%" : "70%"}
                selected={"100%"}
                _hover={{ opacity: "80%" }}
              >
                Create Stream
              </Text>
            </Link>
            <Link href={"./dashboard"}>
              <Text
                fontSize={"20px"}
                fontWeight={"medium"}
                opacity={header == "dashboard" ? "100%" : "70%"}
                _hover={{ opacity: "80%" }}
              >
                Dashboard
              </Text>
            </Link>
          </Flex>
          <ConnectBtn />
          {/* <Button
            bg={"none"}
            height={["30px", "30px", "40px"]}
            width={["110px", "110px", "190px"]}
            marginRight={["8px", "8px", "16px"]}
            border={"1px solid rgba(255, 255, 255, 0.2)"}
            justify={"center"}
            color={"white"}
            borderRadius={"10px"}
            fontSize={["12px", "12px", "20px"]}
            _hover={{}}
            onClick={isConnected ? disconnectHandler : connectWallet}
          >
            {isConnected
              ? `${currentAccount.substring(0, 4)}...${currentAccount.substring(
                  38
                )}`
              : "Connect Wallet"}
          </Button> */}
        </Flex>
      </Flex>
      {/* <Flex marginTop={"100px"}>
          {auth ? (
            <>
              {stream ? <Stream /> : <></>}
              {dashboard ? <Dashboard /> : <></>}
            </>
          ) : (
            <Flex marginTop={"200px"} w={"518px"}>
              <Text fontSize={"28px"} fontWeight={"medium"}>
                Connect Wallet to start using streamfi
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex> */}
    </>
  );
}
