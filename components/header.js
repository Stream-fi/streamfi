import { Flex, Image, Text, Button } from "@chakra-ui/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ConnectBtn } from "./custombutton";
import { useRouter } from "next/router";
export default function Header() {
  const router = useRouter();
  const [header, setHeader] = useState("");

  useEffect(() => {
    const path = router.asPath;
    if (path == "/create") {
      setHeader("create");
    } else if (path == "/dashboard") {
      setHeader("dashboard");
    } else if (path == "/dca") {
      setHeader("dca");
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
            <Link href={"./dca"}>
              <Text
                fontSize={"20px"}
                fontWeight={"medium"}
                opacity={header == "dca" ? "100%" : "70%"}
                _hover={{ opacity: "80%" }}
              >
                DCA
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
