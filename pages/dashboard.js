import Header from "@/components/header";
import { init } from "@/utils";
import { useState, useEffect } from "react";
import { Flex, Image, Text, Grid, GridItem, Divider } from "@chakra-ui/react";

export default function Dashboard() {
  const [initiated, setInitiated] = useState();
  useEffect(() => {
    (async function () {
      setInitiated(await init());
    })();
  }, []);
  (async () => {
    if (initiated) {
      const daix = initiated[1];
      const signer = initiated[2];
      const address = initiated[3];
      const res = await daix.getAccountFlowInfo({
        account: address,
        providerOrSigner: signer,
      });
      console.log(res);
    }
  })();

  return (
    <>
      <Flex
        bg={"#0F1215"}
        flexDir={"column"}
        align={"center"}
        height="100vh"
        color={"white"}
      >
        <Header />
        <Flex
          flexDir={"column"}
          w={"910px"}
          gap={"35px"}
          bg={"#0F1215"}
          marginTop={"100px"}
        >
          <Grid
            templateColumns="repeat(5, 1fr)"
            w={"910px"}
            fontSize={"18px"}
            fontWeight={"medium"}
          >
            <Flex gap={"124px"}>
              <GridItem whiteSpace={"nowrap"}>Asset</GridItem>
              <GridItem whiteSpace={"nowrap"}>Balance</GridItem>
              <GridItem whiteSpace={"nowrap"}>Net Flow</GridItem>
              <GridItem whiteSpace={"nowrap"}>Inflow/Outflow</GridItem>
            </Flex>
          </Grid>
          <Divider opacity={"60%"} />
          <Flex flexDir={"column"} gap={"30px"}>
            <Grid
              templateColumns="repeat(5, 1fr)"
              display={"flex"}
              flexDir={"row"}
              w={"910px"}
              fontSize={"18px"}
              fontWeight={"medium"}
              paddingBottom={"30px"}
              borderBottom={"1px solid rgba(255,255,255,0.2)"}
              gap={"202px"}
            >
              <Flex gap={"124px"}>
                <GridItem>fDAIx</GridItem>
                <GridItem>2030.3125</GridItem>
                <GridItem>+1500/mo</GridItem>
                <GridItem flexDir={"column"} gap={"4px"}>
                  <Text>+1500/mo</Text>
                  <Text>-0/mo</Text>
                </GridItem>
              </Flex>
              <GridItem>
                <Image src={"del.svg"} alt="delete" />
              </GridItem>
            </Grid>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
