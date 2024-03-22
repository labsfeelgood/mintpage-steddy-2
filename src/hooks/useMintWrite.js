import { useSigner } from "wagmi";
import { USDT_CONTRACT, STEDDY_CONTRACT } from "../constants";
import { useState } from "react";
import { Contract, utils } from "ethers";
import erc20ABI from "../erc20ABI.json"
import STEDDYABI from "../STEDDYABI.json"

export function useMintWrite(count, maxQuantity, proof) {
  const { data: signer } = useSigner();
  const [states, setStates] = useState({
    isLoading: false,
    isSuccess: false,
  });

  const { isLoading, isSuccess } = states;

  const mintWrite = async (count, maxQuantity, proof) => {
    try {
      setStates((prevValue) => ({
        ...prevValue,
        isSuccess: false,
        isLoading: true,
      }));

      const contract = new Contract(STEDDY_CONTRACT, STEDDYABI, signer);
      const tx = await contract.mint(
        count, maxQuantity, proof
      );

      console.log("Mint tx ", tx)
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

      console.log("contract-write-error-for-mint", error);
    }
  };

  return {
    mintLoading: isLoading,
    mintSuccess: isSuccess,
    mintWrite,
  };
}
