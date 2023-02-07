import { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { Flex, Text, Input, Button, Image } from "@chakra-ui/react";
import { Spinner } from "react-bootstrap";
import { useToast } from "@chakra-ui/react";
import { calculateFlowRate } from "@/utils";

let account;

async function deleteExistingFlow(recipient, setSuccess, setFailure) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });
  const superSigner = sf.createSigner({ signer: signer });
  console.log(signer);
  console.log(await superSigner.getAddress());
  const daix = await sf.loadSuperToken("fDAIx");
  console.log(daix);

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

async function createNewFlow(recipient, flowRate, setSuccess, setFailure) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  const sf = await Framework.create({
    chainId: Number(chainId),
    provider: provider,
  });
  const superSigner = sf.createSigner({ signer: signer });
  console.log(signer);
  console.log(await superSigner.getAddress());
  const daix = await sf.loadSuperToken("fDAIx");
  console.log(daix);
  try {
    const createFlowOperation = daix.createFlow({
      sender: await superSigner.getAddress(),
      receiver: recipient,
      flowRate: flowRate,
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

const CreateFlow = () => {
  const toast = useToast();
  const [recipient, setRecipient] = useState("");
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [flowRate, setFlowRate] = useState("");
  const [flowRateDisplay, setFlowRateDisplay] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);

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
      account = currentAccount;
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectHandler = () => {
    setIsConnected(false);
  };

  const checkIfWalletIsConnected = async () => {
    console.log("runs");
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      setIsConnected(true);
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const chain = await window.ethereum.request({ method: "eth_chainId" });
    let chainId = chain;
    console.log("chain ID:", chain);
    console.log("global Chain Id:", chainId);
    if (accounts.length !== 0) {
      account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

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
    let newFlowRateDisplay = calculateFlowRate(e.target.value);
    if (newFlowRateDisplay != undefined) {
      setFlowRateDisplay(newFlowRateDisplay.toString());
    }
  };

  return (
    <>
      <Flex bg={"#080808"} flexDir={"column"} align={"center"}>
        <Flex
          marginTop={"56px"}
          height={["40px", "40px", "60px"]}
          bg={"rgba(32, 34, 35, 0.3)"}
          borderRadius={"20px"}
          border={"1px solid rgba(255, 255, 255, 0.2)"}
        >
          <Flex
            justifyContent={"space-between"}
            width={{ base: "250px", md: "750px", lg: "1058.71px" }}
            align={"center"}
          >
            <Flex
              gap={["5px", "5px", "10px"]}
              marginLeft={["8px", "8px", "16px"]}
              align={"center"}
            >
              <Image
                src={"logo.svg"}
                height={["14px", "14px", "18px"]}
                width={"25.71px"}
                alt="logo"
              />
              <Text
                fontSize={["14px", "14px", "28px"]}
                fontWeight={"600"}
                color={"white"}
              >
                StreamFi
              </Text>
            </Flex>
            <Button
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
                ? `${currentAccount.substring(
                    0,
                    4
                  )}...${currentAccount.substring(38)}`
                : "Connect Wallet"}
            </Button>
          </Flex>
        </Flex>
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
              placeholder="Enter a flowRate in wei/second"
            />
          </Flex>
          <Flex
            width={["200px", "200px", "484px"]}
            height={["40px", "40px", "50px"]}
            border={" 1px solid rgba(255, 255, 255, 0.2)"}
            borderRadius={"7px"}
            bg={"rgba(18, 18, 18, 0.5)"}
            color={"white"}
            fontSize={["14px", "14px", "20px"]}
            fontWeight={"500"}
            justify={"center"}
            align={"center"}
          >
            {flowRateDisplay !== "" ? `$${flowRateDisplay}` : "Amount"}
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
              createNewFlow(recipient, flowRate, setSuccess, setFailure);
              setTimeout(() => {
                setIsButtonLoading(false);
              }, 1000);
            }}
          >
            Click to Create Your Stream
          </CreateButton>
        </Flex>
        <Flex marginTop={["90px"]} flexDir={"column"} gap={"37px"}>
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
              deleteExistingFlow(recipient, setSuccess, setFailure);
              setTimeout(() => {
                setIsButtonLoading(false);
              }, 1000);
            }}
          >
            Click to delete Stream
          </CreateButton>
        </Flex>
      </Flex>
    </>
  );
};

export default function Home() {
  return (
    <>
      <CreateFlow />
    </>
  );
}
