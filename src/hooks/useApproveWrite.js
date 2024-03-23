import { useSigner } from "wagmi";
import { USDT_CONTRACT, STEDDY_CONTRACT } from "../constants";
import { useState } from "react";
import { Contract, utils } from "ethers";
import erc20ABI from "../erc20ABI.json";

export function useApproveWrite(amount,setSuccessMessages) {
  const { data: signer } = useSigner();
  const [states, setStates] = useState({
    isLoading: false,
    isSuccess: false,
    txHash: "",
  });

  const { isLoading, isSuccess, txHash } = states;

  const approveWrite = async (amount) => {
    try {
      setStates((prevValue) => ({
        ...prevValue,
        isSuccess: false,
        isLoading: true,
      }));

      const contract = new Contract(USDT_CONTRACT, erc20ABI, signer);
      const tx = await contract.approve(STEDDY_CONTRACT, amount);

      setStates((prevValue) => ({
        ...prevValue,
        txHash: tx.hash,
      }));

      console.log("Approve tx ", tx);
      await tx.wait();
      setSuccessMessages("Approve successful. Mint now")
      setStates((prevValue) => ({
        ...prevValue,
        isLoading: false,
        isSuccess: true,
      }));
    } catch (error) {
      setStates((prevValue) => ({
        ...prevValue,
        isLoading: false,
      }));

      console.log("contract-write-error-for-approve", error);
    }
  };

  return {
    approveWriteLoading: isLoading,
    approveWriteSuccess: isSuccess,
    approveWrite,
approveTxHash:    txHash,
  };
}
