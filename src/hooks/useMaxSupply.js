import { useAccount, useProvider } from "wagmi";
import { USDT_CONTRACT, STEDDY_CONTRACT } from "../constants";
import STEDDYABI from "../STEDDYABI.json"
import { useState, useEffect } from "react";
import { Contract, ethers } from "ethers";

export function useMaxSupply() {
  const provider = useProvider();
  const { address } = useAccount();

  const [states, setStates] = useState({
    isLoading: false,
    isSuccess: false,
    data: "",
  });
  const { isLoading, isSuccess, data } = states;

  useEffect(() => {
    if (address && provider) {
      (async () => {
        try {
          setStates((prevValue) => ({
            ...prevValue,
            isLoading: true,
            isSuccess: false,
          }));

          const contract = new Contract(STEDDY_CONTRACT, STEDDYABI, provider);
          let data = await contract.MAX_SUPPLY();
        

          console.log("use max supply ", data)


          setStates((prevValue) => ({
            ...prevValue,
            isLoading: false,
            isSuccess: true,
            data,
          }));
        } catch (error) {
          setStates((prevValue) => ({
            ...prevValue,
            isLoading: false,
          }));

          console.log("contract-read-error-for-total minted", error);
        }
      })();
    }
  }, [address, provider]);

  return {
    maxSupply: isSuccess ? data : undefined,
    isLoadingMaxSupply: isLoading,
  };
}
