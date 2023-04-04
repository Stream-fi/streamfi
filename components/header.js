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
        </Flex>
      </Flex>
    </>
  );
}
