import React from "react";
import { useState, useEffect } from "react";
import { Flex, Text, Input, Button, Image, Select } from "@chakra-ui/react";
import { Spinner } from "react-bootstrap";
import { useToast } from "@chakra-ui/react";
import { calculateFlowRate, init } from "@/utils";
import Header from "@/components/header";
import { useAccount } from "wagmi";
import { Dropdown } from "@nextui-org/react";

async function createNewFlow(
  recipient,
  flowRateCalc,
  setSuccess,
  setFailure,
  initiated,
  token
) {
  const superSigner = initiated[0];
  const streamToken = initiated[1][token];
  console.log(token);
  console.log(streamToken);
  const signer = initiated[2];
  const address = initiated[3];
  try {
    const res = await streamToken.getFlow({
      sender: address,
      receiver: recipient,
      providerOrSigner: signer,
    });
    console.log(res.flowRate);
    if (res.flowRate == 0) {
      const createFlowOperation = streamToken.createFlow({
        sender: await superSigner.getAddress(),
        receiver: recipient,
        flowRate: flowRateCalc,
      });
      console.log(createFlowOperation);
      console.log("Creating your stream...");

      const result = await createFlowOperation.exec(superSigner);
      console.log(result);

      console.log(
        `Congrats - you've just created a money stream!
    `
      );
    } else {
      const updateFlowOperation = streamToken.updateFlow({
        sender: await superSigner.getAddress(),
        receiver: recipient,
        flowRate: flowRateCalc,
      });
      console.log(updateFlowOperation);
      console.log("Updating your stream...");

      const result = await updateFlowOperation.exec(superSigner);
      console.log(result);

      console.log(
        `Congrats - you've just updated your money stream!
    `
      );
    }

    setSuccess(true);
  } catch (error) {
    console.log(
      "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    );
    console.error(error);
    setFailure(true);
  }
}

export default function CreateFlow() {
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const [auth, setAuth] = useState();
  const [recipient, setRecipient] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [initiated, setInitiated] = useState();
  const [flowRateCalc, setFlowRateCalc] = useState("");
  const [token, setToken] = useState();
  const [selected, setSelected] = React.useState(new Set(["Select Token"]));

  const selectedValue = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  useEffect(() => {
    if (auth) {
    (async function () {
      setInitiated(await init());
    })();
  }
  }, [auth]);

  useEffect(() => {
    setAuth(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (success) {
      toast({
        title: "Congrats!",
        description: "Action has been successful",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setSuccess(false);
    }
  }, [success, toast]);

  useEffect(() => {
    if (failure) {
      toast({
        title: "Oops!",
        description:
          "There seems to be an error. Kindly check that you've entered a valid Ethereum address",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setFailure(false);
  }, [failure, toast]);

  useEffect(() => {
    const temp = selectedValue.toLowerCase();
    setToken(temp);
  }, [selected, selectedValue]);

  function CreateButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value));
  };

  const handleFlowRateChange = (e) => {
    setFlowRate(() => ([e.target.name] = e.target.value));
    calculateFlowRate(e.target.value, setFlowRate, setFlowRateCalc);
  };

  return (
    <>
      <Flex bg={"#0F1215"} flexDir={"column"} align={"center"} height="100vh">
        <Header />
        {auth ? (
          <Flex marginTop={["90px"]} flexDir={"column"} gap={"37px"}>
            <Flex gap={"13px"} flexDir={"column"}>
              <Text
                fontSize={["14px", "14px", "20px"]}
                color={"white"}
                fontWeight={"medium"}
              >
                Reciever Wallet Address
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
                value={recipient}
                onChange={handleRecipientChange}
                placeholder="0x..."
                _placeholder={{ color: "rgba(255,255,255,0.60)" }}
              />
            </Flex>
            <Flex gap={"13px"} flexDir={"column"}>
              <Text
                fontSize={["14px", "14px", "20px"]}
                color={"white"}
                fontWeight={"medium"}
              >
                Enter Amount
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
                placeholder="Enter a flowRate in tokens/month"
                _placeholder={{ color: "rgba(255,255,255,0.60)" }}
              />
            </Flex>

            {/* <Select
              borderRadius={"6px"}
              width={["200px", "200px", "484px"]}
              height={["40px", "40px", "62px"]}
              border={"1px solid rgba(255,255,255,0.40)"}
              onChange={handleTokenChange}
              color={"white"}
              placeholder="Select Token"
              focusBorderColor={"rgba(255, 255, 255, 0.5)"}
            >
              <option value="fdaix" style={{ color: "black" }}>
                fDAIx
              </option>
              <option value="ftusdx" style={{ color: "black" }}>
                fTUSDx
              </option>
              <option value="fusdcx" style={{ color: "black" }}>
                fUSDCx
              </option>
            </Select> */}

            <Dropdown>
              <Dropdown.Button
                flat
                css={{
                  height: "62px",
                  width: "484px",
                  background: "none",
                  border: "1px solid rgba(255,255,255,0.40)",
                  borderRadius: "6px",
                  color: "white",
                  fontSize: "16px",
                  focusBorderColor: "rgba(255,255,255,0.40)",
                }}
              >
                {selectedValue}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Static Actions"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selected}
                onSelectionChange={setSelected}
              >
                <Dropdown.Item key="fDAIx" value="fdaix">
                  fDAIx
                </Dropdown.Item>
                <Dropdown.Item key="fTUSDx" value="ftusdx">
                  fTUSDx
                </Dropdown.Item>
                <Dropdown.Item key="fUSDCx" value="fusdcx">
                  fUSDCx
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <CreateButton
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
                setIsButtonLoading(true);
                createNewFlow(
                  recipient,
                  flowRateCalc,
                  setSuccess,
                  setFailure,
                  initiated,
                  token
                );
                setTimeout(() => {
                  setIsButtonLoading(false);
                }, 1000);
              }}
            >
              Click to Create Your Stream
            </CreateButton>
          </Flex>
        ) : (
          <Flex marginTop={"200px"} w={"518px"} color={"white"}>
            <Text fontSize={"28px"} fontWeight={"medium"}>
              Connect Wallet to start using streamfi
            </Text>
          </Flex>
        )}

        {/* <Flex marginTop={["90px"]} flexDir={"column"} gap={"37px"}>
          <Text fontSize={["24px"]} color={"white"}>
            Delete Stream
          </Text>
          <Flex gap={"13px"} flexDir={"column"}>
            <Text fontSize={["14px", "14px", "20px"]} color={"white"}>
              Reciever Wallet Address
            </Text>
            <Input
              width={["200px", "200px", "484px"]}
              height={["40px", "40px", "50px"]}
              border={"1px solid rgba(255, 255, 255, 0.2)"}
              borderRadius={"6px"}
              bg={"none"}
              color={"white"}
              fontSize={["12px", "12px", "18px"]}
              _hover={{}}
              focusBorderColor={"rgba(255, 255, 255, 0.5)"}
              value={recipient}
              onChange={handleRecipientChange}
              placeholder="0x..."
            />
          </Flex>
          <CreateButton
            bg={"none"}
            height={["40px", "40px", "50px"]}
            width={["200px", "200px", "484px"]}
            marginRight={["8px", "8px", "16px"]}
            border={"1px solid rgba(255, 255, 255, 0.2)"}
            justify={"center"}
            color={"white"}
            borderRadius={"10px"}
            fontSize={["12px", "12px", "20px"]}
            _hover={{}}
            onClick={() => {
              setIsButtonLoading(true);
              deleteExistingFlow(recipient, setSuccess, setFailure, initiated);
              setTimeout(() => {
                setIsButtonLoading(false);
              }, 1000);
            }}
          >
            Click to delete Stream
          </CreateButton>
        </Flex> */}
      </Flex>
    </>
  );
}
