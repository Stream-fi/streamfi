import { useState, useEffect } from "react";
import { Flex, Text, Input, Button, Image } from "@chakra-ui/react";
import { Spinner } from "react-bootstrap";
import { useToast } from "@chakra-ui/react";
import { calculateFlowRate, init } from "@/utils";
import Header from "@/components/header";

async function deleteExistingFlow(
  recipient,
  setSuccess,
  setFailure,
  initiated
) {
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // await provider.send("eth_requestAccounts", []);
  // const signer = provider.getSigner();
  // const chainId = await window.ethereum.request({ method: "eth_chainId" });
  // const sf = await Framework.create({
  //   chainId: Number(chainId),
  //   provider: provider,
  // });
  // const superSigner = sf.createSigner({ signer: signer });
  // console.log(signer);
  // console.log(await superSigner.getAddress());
  // const daix = await sf.loadSuperToken("fDAIx");
  // console.log(daix);
  const superSigner = initiated[0];
  const daix = initiated[1];
  try {
    const deleteFlowOperation = daix.deleteFlow({
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

async function createNewFlow(
  recipient,
  flowRateCalc,
  setSuccess,
  setFailure,
  initiated
) {
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // await provider.send("eth_requestAccounts", []);
  // const signer = provider.getSigner();
  // const chainId = await window.ethereum.request({ method: "eth_chainId" });
  // const sf = await Framework.create({
  //   chainId: Number(chainId),
  //   provider: provider,
  // });
  // const superSigner = sf.createSigner({ signer: signer });
  // console.log(signer);
  // console.log(await superSigner.getAddress());
  // const daix = await sf.loadSuperToken("fDAIx");
  // console.log(daix);
  // console.log(typeof flowRateCalc)
  // console.log(flowRateCalc);
  // console.log(flowRateCalc.toString());
  const superSigner = initiated[0];
  const daix = initiated[1];
  try {
    const createFlowOperation = daix.createFlow({
      sender: await superSigner.getAddress(),
      receiver: recipient,
      flowRate: flowRateCalc,
      // userData?: string
    });

    console.log(createFlowOperation);
    console.log("Creating your stream...");

    const result = await createFlowOperation.exec(superSigner);
    console.log(result);

    console.log(
      `Congrats - you've just created a money stream!
    `
    );
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
  const [recipient, setRecipient] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [initiated, setInitiated] = useState();
  const [flowRateCalc, setFlowRateCalc] = useState("");

  useEffect(() => {
    (async function () {
      setInitiated(await init());
    })();
  }, []);

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
        <Flex marginTop={["90px"]} flexDir={"column"} gap={"37px"}>
          <Text fontSize={["24px"]} color={"white"}>
            Create Stream
          </Text>
          <Flex gap={"13px"} flexDir={"column"}>
            <Text fontSize={["14px", "14px", "20px"]} color={"white"}>
              Reciever Wallet Address
            </Text>
            <Input
              width={["200px", "200px", "484px"]}
              height={["40px", "40px", "50px"]}
              border={"1px solid rgba(255, 255, 255, 0.2)"}
              borderRadius={"7px"}
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
          <Flex gap={"13px"} flexDir={"column"}>
            <Text fontSize={["14px", "14px", "20px"]} color={"white"}>
              Enter Amount
            </Text>
            <Input
              width={["200px", "200px", "484px"]}
              height={["40px", "40px", "50px"]}
              border={"1px solid rgba(255, 255, 255, 0.2)"}
              borderRadius={"7px"}
              bg={"none"}
              color={"white"}
              fontSize={["12px", "12px", "18px"]}
              _hover={{}}
              focusBorderColor={"rgba(255, 255, 255, 0.5)"}
              value={flowRate}
              onChange={handleFlowRateChange}
              placeholder="Enter a flowRate in tokens/month"
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
              createNewFlow(
                recipient,
                flowRateCalc,
                setSuccess,
                setFailure,
                initiated
              );
              setTimeout(() => {
                setIsButtonLoading(false);
              }, 1000);
            }}
          >
            Click to Create Your Stream
          </CreateButton>
        </Flex>
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
              borderRadius={"7px"}
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
