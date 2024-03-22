import { useAccount, useProvider } from "wagmi";
import { USDT_CONTRACT, STEDDY_CONTRACT } from "../constants";
import STEDDYABI from "../STEDDYABI.json"
import { useState, useEffect } from "react";
import { Contract } from "ethers";

export function usePrice() {
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
          const data = await contract.price();
          console.log("use price ", data)


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
    price: isSuccess ? data : undefined,
    isLoadingPrice: isLoading,
  };
}
