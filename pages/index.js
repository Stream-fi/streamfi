import Link from "next/link";
import { Flex, Image, Text, Button } from "@chakra-ui/react";
export default function index() {
  return (
    <>
      <Flex
        display={{ base: "none", lg: "flex" }}
        height={"100vh"}
        bg={"#0F1215"}
        fontFamily={"Space Grotesk, sans-serif"}
        color={"white"}
        align={"center"}
        flexDir={"column"}
      >
        <Flex h={"44px"} marginTop={"45px"} w={"1250.57px"} gap={"935px"}>
          <Flex gap={"9px"} align={"center"}>
            <Image src={"logo.svg"} alt={"logo"} h={"20px"} w={"28.57px"} />
            <Text fontSize={"24px"} fontWeight={"medium"}>
              StreamFi
            </Text>
          </Flex>

          <a
            href="https://twitter.com/AayushCodes"
            target={"_blank"}
            rel={"noreferrer"}
          >
            <Button
              borderRadius={"7px"}
              bg={"rgba(255,255,255,0.02)"}
              border={"1px solid rgba(255, 255, 255, 0.15)"}
              h={"44px"}
              w={"147px"}
              justify={"center"}
              align={"center"}
              fontFamily={"22px"}
              fontWeight={"400"}
              _hover={{
                background: "rgba(255,255,255,0.04)",
                boxShadow: "0px 1px 12px rgba(255,255,255,0.05)",
              }}
              _active={{}}
            >
              Contact Us
            </Button>
          </a>
        </Flex>

        <Flex
          marginTop={"235px"}
          flexDir={"column"}
          gap={"28px"}
          w={"622px"}
          align={"center"}
        >
          <Text
            fontSize={"60px"}
            fontWeight={"600"}
            textAlign={"center"}
            lineHeight={"77px"}
          >
            Your personal token streaming dApp
          </Text>
          <Flex gap={"20px"}>
            <Link href="./create">
              <Button
                borderRadius={"7px"}
                bg={"white"}
                color={"#0F1215"}
                h={"54px"}
                w={"167px"}
                justify={"center"}
                align={"center"}
                fontFamily={"22px"}
                fontWeight={"700"}
                _hover={{ boxShadow: "0px 1px 12px rgba(255,255,255,0.42)" }}
                _active={{}}
              >
                Launch App
              </Button>
            </Link>
            <Button
              borderRadius={"7px"}
              bg={"rgba(255,255,255,0.02)"}
              border={"1px solid rgba(255, 255, 255, 0.15)"}
              h={"54px"}
              w={"167px"}
              justify={"center"}
              align={"center"}
              fontFamily={"22px"}
              fontWeight={"700"}
              _hover={{
                background: "rgba(255,255,255,0.04)",
                boxShadow: "0px 1px 12px rgba(255,255,255,0.05)",
              }}
              _active={{}}
            >
              Learn More
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        display={{ base: "flex", lg: "none" }}
        height={"100vh"}
        bg={"#0F1215"}
        flexDir={"column"}
        align={"center"}
        justify={"center"}
        color={"white"}
      >
        <Flex w={"294px"} flexDir={"column"} gap={"18px"} align={"center"}>
          <Flex gap={"9px"} align={"center"}>
            <Image src={"logo.svg"} alt={"logo"} h={"15px"} w={"21.43px"} />
            <Text fontSize={"20px"} fontWeight={"medium"}>
              StreamFi
            </Text>
          </Flex>
          <Text textAlign={"center"} fontSize={"30px"} fontWeight={"600"}>
            Your personal token streaming dApp
          </Text>
          <Button
            color={"#0F1215"}
            borderRadius={"7px"}
            bg={"white"}
            h={"39px"}
            w={"20f0px"}
            justify={"center"}
            align={"center"}
            fontFamily={"15px"}
            fontWeight={"600"}
            _hover={{}}
            _active={{}}
          >
            Coming soon on mobile
          </Button>
        </Flex>
      </Flex>
    </>
  );
}

// export default function Home() {
//   return (
//     <>
//       <CreateFlow />
//     </>
//   );
// }
