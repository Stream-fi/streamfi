import { Flex, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
export default function fourOfour() {
  return (
    <Flex
      display={{ base: "none", lg: "flex" }}
      height={"100vh"}
      bg={"#0F1215"}
      fontFamily={"Space Grotesk, sans-serif"}
      color={"white"}
      justify={"center"}
      align={"center"}
      flexDir={"column"}
      draggable={"false"}
      userSelect={"none"}
    >
      <Flex gap={"25px"} flexDir={"column"} align={"center"}>
        <Flex gap={"9px"} align={"center"}>
          <Image src={"logo.svg"} alt={"logo"} h={"20px"} w={"28.57px"} />
          <Text fontSize={"24px"} fontWeight={"medium"}>
            StreamFi
          </Text>
        </Flex>
        <Text textAlign={"center"} fontSize={"32px"} fontWeight={"medium"}>
          oops, this page doesn&apos;t exist
        </Text>
        <Text textAlign={"center"} fontSize={"24px"} opacity={"60%"}>
          lets go back{" "}
          <Link href="./" style={{ textDecoration: "underline" }}>
            home
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
}
