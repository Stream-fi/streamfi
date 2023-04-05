import { ethers } from "ethers";
import abi_dca from "../abi_dca.json";
import Header from "@/components/header";
import { useState, useEffect } from "react";
import { Flex, Input, Text, Button, Divider, Tooltip } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { init, calculateFlowRate } from "@/utils";
import abi_cfa from "../abi_cfa.json";
import { Loading } from "@nextui-org/react";
import { InfoIcon } from "@chakra-ui/icons";

const getSwappedTokens = async (
  initiated,
  dca_address,
  setWethBal,
  setFdaiBal,
  setAvailableFdai,
  setLastTimestamp
) => {
  const signer = initiated[2];
  const address = initiated[3];
  const contract = new ethers.Contract(dca_address, abi_dca.abi, signer);
  const tokens = await contract.getSwappedTokens(address);
  console.log(parseInt(tokens[0]._hex));
  setWethBal(Math.round(parseInt(tokens[0]._hex) / 1e8) / 1e10);
  setFdaiBal(Math.round(parseInt(tokens[1]._hex) / 1e14) / 1e4);
  const available = await contract.calculateAmount(address);
  setAvailableFdai(Math.round(parseInt(available._hex) / 1e14) / 1e4);
  const timestamp = await contract.getUserTimestamp(address);
  const newTimestamp = parseInt(timestamp._hex);
  console.log(newTimestamp);
  const formattedTimestamp = new Date(newTimestamp * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  const finalTimestamp =
    formattedTimestamp.getDate().toString() +
    " " +
    months[formattedTimestamp.getMonth()] +
    " " +
    formattedTimestamp.getFullYear().toString();
  console.log(finalTimestamp);
  console.log(formattedTimestamp);
  setLastTimestamp(finalTimestamp);
};

const approve = async (initiated, flowRateCalc, dca_address, setApproval) => {
  const signer = initiated[2];
  const provider = initiated[4];
  console.log(provider);
  const fdaix = initiated[1]["fdaix"];
  console.log(dca_address);
  try {
    const updateFlowOperatorOperation = fdaix.updateFlowOperatorPermissions({
      flowOperator: dca_address,
      permissions: 7,
      flowRateAllowance: flowRateCalc,
    });
    const result = await updateFlowOperatorOperation.exec(signer);
    console.log(result);
    await provider.waitForTransaction(result.hash);
    console.log("approved");
    setApproval(true);
  } catch (e) {
    console.log(e);
  }
};

const startFlow = async (initiated, flowRateCalc, dca_address) => {
  const signer = initiated[2];
  const provider = initiated[4];
  const contract = new ethers.Contract(dca_address, abi_dca.abi, signer);
  const result = await contract.startFlow(flowRateCalc);
  console.log(result);
  await provider.waitForTransaction(result.hash);
  console.log("started");
};

const manualSwap = async (initiated, dca_address) => {
  const signer = initiated[2];
  const provider = initiated[4];
  const contract = new ethers.Contract(dca_address, abi_dca.abi, signer);
  const result = await contract.manualSwap();
  console.log(result);
  await provider.waitForTransaction(result.hash);
  console.log("swapped");
};

const checkApproval = async (
  initiated,
  cfa_address,
  dca_address,
  setApproval,
  flowRateCalc
) => {
  const signer = initiated[2];
  const address = initiated[3];
  const contract = new ethers.Contract(cfa_address, abi_cfa.abi, signer);
  const [permissions, allowedFlowRate] =
    await contract.getFlowOperatorPermissions(
      "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00",
      address,
      dca_address
    );
  console.log(permissions);
  console.log(allowedFlowRate);
  if (permissions != 7) {
    setApproval(false);
  } else {
    if (flowRateCalc != "init") {
      setApproval(flowRateCalc <= parseInt(allowedFlowRate._hex));
    } else {
      setApproval(true);
    }
  }
};

export default function DCA() {
  const [initiated, setInitiated] = useState();
  const [auth, setAuth] = useState();
  const { address, isConnected } = useAccount();
  const [flowRate, setFlowRate] = useState("");
  const [approval, setApproval] = useState();
  const [flowRateCalc, setFlowRateCalc] = useState("");
  const [wethBal, setWethBal] = useState();
  const [fdaiBal, setFdaiBal] = useState();
  const [lastTimestamp, setLastTimestamp] = useState();
  const [availableFdai, setAvailableFdai] = useState();
  const [chain, setChain] = useState();
  const dca_address = "0xf96e197fE7b05407dA8d0b38D75e371CbA8e22c6";
  const cfa_address = "0xcfA132E353cB4E398080B9700609bb008eceB125";

  const handleFlowRateChange = (e) => {
    setFlowRate(() => ([e.target.name] = e.target.value));
    calculateFlowRate(e.target.value, setFlowRate, setFlowRateCalc);
  };

  useEffect(() => {
    setAuth(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (auth) {
      (async function () {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (chainId == "0x5") {
          setChain(true);
          setInitiated(await init());
        } else {
          setChain(false);
        }
      })();
    }
  }, [auth]);

  useEffect(() => {
    if (initiated) {
      (async function () {
        await checkApproval(
          initiated,
          cfa_address,
          dca_address,
          setApproval,
          "init"
        );
        await getSwappedTokens(
          initiated,
          dca_address,
          setWethBal,
          setFdaiBal,
          setAvailableFdai,
          setLastTimestamp
        );
      })();
    }
  }, [initiated]);

  return (
    <>
      <Flex
        bg={"#0F1215"}
        flexDir={"column"}
        align={"center"}
        minH="100vh"
        color={"white"}
      >
        <Header />
        {auth ? (
          chain ? (
            <Flex
              marginTop={["90px"]}
              flexDir={"column"}
              gap={"37px"}
              align={"center"}
            >
              <Flex gap={"13px"} flexDir={"column"}>
                <Text
                  fontSize={["14px", "14px", "20px"]}
                  color={"white"}
                  fontWeight={"medium"}
                >
                  Flow Rate for DCA
                </Text>
                <Input
                  width={["200px", "200px", "484px"]}
                  height={["40px", "40px", "62px"]}
                  border={"1px solid rgba(255,255,255,0.40)"}
                  borderRadius={"6px"}
                  bg={"none"}
                  color={"white"}
                  fontSize={["12px", "12px", "18px"]}
                  _hover={{}}
                  focusBorderColor={"rgba(255, 255, 255, 0.5)"}
                  value={flowRate}
                  onChange={handleFlowRateChange}
                  placeholder="Enter fDAIx/month for DCA"
                  _placeholder={{ color: "rgba(255,255,255,0.60)" }}
                />
              </Flex>

              {approval ? (
                <Flex flexDir={"column"} gap={"37px"} align={"center"}>
                  <Button
                    height={["40px", "40px", "62px"]}
                    width={["200px", "200px", "484px"]}
                    border={"1px solid rgba(255, 255, 255, 0.2)"}
                    justify={"center"}
                    bg={"white"}
                    color={"#0F1215"}
                    borderRadius={"6px"}
                    fontSize={["12px", "12px", "20px"]}
                    _hover={{}}
                    onClick={() => {
                      startFlow(initiated, flowRateCalc, dca_address);
                    }}
                  >
                    Click to start Flow
                  </Button>
                  <Button
                    height={["40px", "40px", "62px"]}
                    width={["200px", "200px", "484px"]}
                    border={"1px solid rgba(255, 255, 255, 0.2)"}
                    justify={"center"}
                    bg={"white"}
                    color={"#0F1215"}
                    borderRadius={"6px"}
                    fontSize={["12px", "12px", "20px"]}
                    _hover={{}}
                    onClick={async () => {
                      await manualSwap(initiated, dca_address);
                    }}
                  >
                    Manual Swap
                  </Button>

                  <Divider />

                  <Flex
                    flexDir={"column"}
                    width={["200px", "200px", "484px"]}
                    gap={"15px"}
                    cursor={"default"}
                  >
                    <Flex justifyContent={"space-between"}>
                      <Flex gap={"10px"} alignItems={"center"}>
                        <Text
                          fontSize={["14px", "14px", "20px"]}
                          color={"white"}
                          fontWeight={"medium"}
                        >
                          WETH received
                        </Text>
                        <Tooltip
                          label="Swapped tokens are automatically transferred to your account"
                          textAlign={"center"}
                          fontSize="md"
                        >
                          <InfoIcon />
                        </Tooltip>
                      </Flex>
                      <Text
                        fontSize={["14px", "14px", "20px"]}
                        color={"white"}
                        fontWeight={"medium"}
                      >
                        {wethBal == undefined ? (
                          <Loading
                            type="points-opacity"
                            size={"lg"}
                            color={"white"}
                          />
                        ) : (
                          wethBal
                        )}
                      </Text>
                    </Flex>
                    <Flex justifyContent={"space-between"}>
                      <Flex gap={"10px"} alignItems={"center"}>
                        <Text
                          fontSize={["14px", "14px", "20px"]}
                          color={"white"}
                          fontWeight={"medium"}
                        >
                          fDAIx swapped
                        </Text>
                        <Tooltip
                          label="Amount of tokens our contract has swapped"
                          textAlign={"center"}
                          fontSize="md"
                        >
                          <InfoIcon />
                        </Tooltip>
                      </Flex>
                      <Text
                        fontSize={["14px", "14px", "20px"]}
                        color={"white"}
                        fontWeight={"medium"}
                      >
                        {fdaiBal == undefined ? (
                          <Loading
                            type="points-opacity"
                            size={"lg"}
                            color={"white"}
                          />
                        ) : (
                          fdaiBal
                        )}
                      </Text>
                    </Flex>

                    <Flex justifyContent={"space-between"}>
                      <Flex gap={"10px"} alignItems={"center"}>
                      <Text
                        fontSize={["14px", "14px", "20px"]}
                        color={"white"}
                        fontWeight={"medium"}
                      >
                        fDAIx available
                      </Text>
                      <Tooltip
                          label="Amount of your tokens in our contract"
                          textAlign={"center"}
                          fontSize="md"
                        >
                          <InfoIcon />
                        </Tooltip>
                      </Flex>
                      <Text
                        fontSize={["14px", "14px", "20px"]}
                        color={"white"}
                        fontWeight={"medium"}
                      >
                        {availableFdai == undefined ? (
                          <Loading
                            type="points-opacity"
                            size={"lg"}
                            color={"white"}
                          />
                        ) : (
                          availableFdai
                        )}
                      </Text>
                    </Flex>

                    <Flex justifyContent={"space-between"}>
                      <Flex gap={"10px"} alignItems={"center"}>
                      <Text
                        fontSize={["14px", "14px", "20px"]}
                        color={"white"}
                        fontWeight={"medium"}
                      >
                        Last Swap
                      </Text>
                      <Tooltip
                          label="Time of last token swap"
                          textAlign={"center"}
                          fontSize="md"
                        >
                          <InfoIcon />
                        </Tooltip>
                      </Flex>
                      <Text
                        fontSize={["14px", "14px", "20px"]}
                        color={"white"}
                        fontWeight={"medium"}
                      >
                        {lastTimestamp == undefined ? (
                          <Loading
                            type="points-opacity"
                            size={"lg"}
                            color={"white"}
                          />
                        ) : wethBal == 0 ? (
                          "none"
                        ) : (
                          lastTimestamp
                        )}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              ) : approval == undefined ? (
                <>
                  <Flex justify={"center"} marginTop={"40px"}>
                    <Loading
                      type="points-opacity"
                      size={"lg"}
                      color={"white"}
                    />
                  </Flex>
                </>
              ) : (
                <Button
                  height={["40px", "40px", "62px"]}
                  width={["200px", "200px", "484px"]}
                  marginRight={["8px", "8px", "16px"]}
                  border={"1px solid rgba(255, 255, 255, 0.2)"}
                  justify={"center"}
                  bg={"white"}
                  color={"#0F1215"}
                  borderRadius={"6px"}
                  fontSize={["12px", "12px", "20px"]}
                  _hover={{}}
                  onClick={() => {
                    approve(initiated, flowRateCalc, dca_address, setApproval);
                  }}
                >
                  Click to approve stream
                </Button>
              )}
            </Flex>
          ) : (
            <Flex marginTop={"350px"} w={"400px"} color={"white"}>
              <Text fontSize={"28px"} fontWeight={"medium"}>
                Change Network to Goerli
              </Text>
            </Flex>
          )
        ) : (
          <Flex marginTop={"350px"} w={"518px"} color={"white"}>
            <Text fontSize={"28px"} fontWeight={"medium"}>
              Connect Wallet to start using streamfi
            </Text>
          </Flex>
        )}
      </Flex>
    </>
  );
}
