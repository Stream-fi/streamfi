import Header from "@/components/header";
import { init, getBalances } from "@/utils";
import { useState, useEffect } from "react";
import { Flex, Image, Grid, GridItem, Divider } from "@chakra-ui/react";

async function deleteExistingFlow(
  recipient,
  setSuccess,
  setFailure,
  initiated, token
) {
  const superSigner = initiated[0];
  const streamToken = initiated[1][token];
  try {
    const deleteFlowOperation = streamToken.deleteFlow({
      sender: await superSigner.getAddress(),
      receiver: recipient,
    });

    console.log(deleteFlowOperation);
    console.log("Deleting your stream...");

    const result = await deleteFlowOperation.exec(superSigner);
    console.log(result);
    console.log("Congrats! You just deleted a money stream");
    setSuccess(true);
  } catch (e) {
    console.log(e);
    setFailure(true);
  }
}

const Streams = ({ flow, type, initiated, tokenBalances }) => {
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  console.log(tokenBalances);
  console.log(flow);
  console.log(type);
  if (flow?.length > 0) {
    return (
      <Flex flexDir={"column"} gap={"30px"}>
        {flow.map((_in) => (
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
            key={_in.token.symbol}
          >
            <Flex gap={"124px"}>
              <GridItem>{_in.token.symbol}</GridItem>
              <GridItem>{Math.round(tokenBalances[_in.token.symbol]/1e16)/100}</GridItem>
              <GridItem>
                {type == "inflow"
                  ? `${_in.sender.id.substring(
                      0,
                      4
                    )}...${_in.sender.id.substring(38)}`
                  : `${_in.receiver.id.substring(
                      0,
                      4
                    )}...${_in.receiver.id.substring(38)}`}
              </GridItem>
              <GridItem>
                {type == "inflow" ? "+" : "-"}
                {Math.round((_in.currentFlowRate * 30 * 24 * 60 * 60) / 1e18)}
                /mo
              </GridItem>
            </Flex>
            {type == "outflow" ? (
              <GridItem>
                <Image
                  src={"del.svg"}
                  alt="delete"
                  onClick={() =>
                    deleteExistingFlow(
                      _in.receiver.id,
                      setSuccess,
                      setFailure,
                      initiated,
                      _in.token.symbol.toLowerCase()
                    )
                  }
                />
              </GridItem>
            ) : (
              ""
            )}
          </Grid>
        ))}
      </Flex>
    );
  }
};

export default function Dashboard() {
  const [initiated, setInitiated] = useState();
  const [inflow, setInflow] = useState([]);
  const [outflow, setOutflow] = useState([]);
  const [tokenBalances, setTokenBalances] = useState();

  useEffect(() => {
    (async function () {
      setInitiated(await init());
    })();
  }, []);

  useEffect(() => {
    (async function () {
      setTokenBalances(await getBalances(initiated));
    })();
  }, [initiated]);

  const streamData = async (type, address) => {
    const checkStream = (stream) => {
      return stream.currentFlowRate != 0;
    };

    const query = `
    {
      streams(where: {${type}: "${address.toLowerCase()}"}) {
        currentFlowRate
        token {
          symbol
        }
        sender {
          id
        }
        receiver {
          id
        }
      }
    }
`;
    const data = await (
      await fetch(
        "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: query,
          }),
        }
      )
    ).json();
    // console.log(data.data.streams.filter(checkStream));
    return data.data.streams.filter(checkStream);
  };

  useEffect(() => {
    (async () => {
      if (initiated) {
        const address = initiated[3];
        console.log(address);
        setOutflow(await streamData("sender", address));
        setInflow(await streamData("receiver", address));
      }
    })();
  }, [initiated]);

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
              <GridItem whiteSpace={"nowrap"}>Sender/Reciever</GridItem>
              <GridItem whiteSpace={"nowrap"}>Inflow/Outflow</GridItem>
            </Flex>
          </Grid>
          <Divider opacity={"60%"} />
          {initiated ? (
            <>
              <Streams flow={inflow} type="inflow" initiated={initiated} tokenBalances={tokenBalances} />
              <Streams flow={outflow} type="outflow" initiated={initiated} tokenBalances={tokenBalances} />
            </>
          ) : (
            ""
          )}
        </Flex>
      </Flex>
    </>
  );
}
