import { ethers } from "ethers";
import { Framework } from "@superfluid-finance/sdk-core";
import abi_DAI from "./abi_dai.json";
import abi_FTUSD from "./abi_ftusd.json";
import abi_FUSDC from "./abi_fusdc.json";

export function calculateFlowRate(amount, setFlowRate, setFlowRateCalc) {
  if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
    alert("You can only calculate a flowRate based on a number");
    setFlowRate("");
    return;
  } else if (typeof Number(amount) === "number") {
    if (Number(amount) === 0) {
      return 0;
    }
    const amountInWei = ethers.BigNumber.from(
      ethers.utils.parseEther(String(amount))
    );
    const calculatedFlowRate = amountInWei.div(3600 * 24 * 30);
    console.log(parseInt(calculatedFlowRate._hex));
    if (calculatedFlowRate != undefined) {
      setFlowRateCalc(calculatedFlowRate);
    }
  }
}

export async function init() {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    console.log(chainId);
    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
    });
    const superSigner = sf.createSigner({ signer: signer });
    console.log(await superSigner.getAddress());
    const fDAIx = await sf.loadSuperToken("fDAIx");
    const fTUSDx = await sf.loadSuperToken("fTUSDx");
    const fUSDCx = await sf.loadSuperToken("fUSDCx");
    const tokens = { fdaix: fDAIx, ftusdx: fTUSDx, fusdcx: fUSDCx };
    return [superSigner, tokens, signer, address, provider];
  } catch (e) {
    console.log(e);
  }
}

export async function getBalances(initiated) {
  if (initiated) {
    const signer = initiated[2];
    const address = initiated[3];
    const abi_dai = abi_DAI.abi;
    const abi_ftusd = abi_FTUSD.abi;
    const abi_fusdc = abi_FUSDC.abi;
    const contract_dai = "0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00";
    const contract_ftusd = "0x95697ec24439E3Eb7ba588c7B279b9B369236941";
    const contract_fusdc = "0x8aE68021f6170E5a766bE613cEA0d75236ECCa9a";
    const tokens = [
      [abi_dai, contract_dai, "fDAIx"],
      [abi_ftusd, contract_ftusd, "fTUSDx"],
      [abi_fusdc, contract_fusdc, "fUSDCx"],
    ];
    const tokenBalances = {};
    tokens.map(async (_item) => {
      let contr = new ethers.Contract(_item[1], _item[0], signer);
      let bal = await contr.realtimeBalanceOfNow(address);
      tokenBalances[_item[2]] = parseInt(bal.availableBalance);
    });
    console.log(tokenBalances);
    return tokenBalances;
  }
}
