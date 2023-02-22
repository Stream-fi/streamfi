import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
export function calculateFlowRate(amount, setFlowRate, setFlowRateCalc) {
  if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
    alert("You can only calculate a flowRate based on a number");
    setFlowRate("");
    setFlowRateDisplay("");
    return;
  } else if (typeof Number(amount) === "number") {
    if (Number(amount) === 0) {
      return 0;
    }
    const amountInWei = ethers.BigNumber.from(
      ethers.utils.parseEther(String(amount))
    );
    console.log(amountInWei.toString());
    const calculatedFlowRate = amountInWei.div(3600 * 24 * 30);
    console.log(calculatedFlowRate);
    if (calculatedFlowRate != undefined) {
      setFlowRateCalc(calculatedFlowRate);
    }
  }
}

export async function init() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  const address = await signer.getAddress()
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
  return [superSigner, daix, signer, address]
}
