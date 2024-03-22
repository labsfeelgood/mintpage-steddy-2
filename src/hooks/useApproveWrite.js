import { useSigner } from "wagmi";
import { USDT_CONTRACT, STEDDY_CONTRACT } from "../constants";
import { useState } from "react";
import { Contract, utils } from "ethers";
import erc20ABI from "../erc20ABI.json"

export function useApproveWrite(amount) {
  const { data: signer } = useSigner();
  const [states, setStates] = useState({
    isLoading: false,
    isSuccess: false,
  });

  const { isLoading, isSuccess } = states;

  const approveWrite = async (amount) => {
    try {
      setStates((prevValue) => ({
        ...prevValue,
        isSuccess: false,
        isLoading: true,
      }));

      const contract = new Contract(USDT_CONTRACT, erc20ABI, signer);
      const tx = await contract.approve(
        STEDDY_CONTRACT,
        amount
      );

      console.log("Approve tx ", tx)
      await tx.wait();

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
  };
}
