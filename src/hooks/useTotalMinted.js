import { useAccount, useProvider } from "wagmi";
import { USDT_CONTRACT, STEDDY_CONTRACT } from "../constants";
import STEDDYABI from "../STEDDYABI.json"
import { useState, useEffect } from "react";
import { Contract } from "ethers";

export function useTotalMinted() {
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
          const data = await contract.totalMinted();
          console.log("use total minted ", data)


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
    totalMinted: isSuccess ? data : undefined,
    isLoadingTotalMinted: isLoading,
  };
}
