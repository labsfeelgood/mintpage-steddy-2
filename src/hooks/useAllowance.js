import { useAccount, useProvider } from "wagmi";
import { USDT_CONTRACT, STEDDY_CONTRACT } from "../constants";
import erc20ABI from "../erc20ABI.json"
import { useState, useEffect } from "react";
import { Contract } from "ethers";

export function useAllowance() {
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

          const contract = new Contract(USDT_CONTRACT, erc20ABI, provider);
          const data = await contract.allowance(address, STEDDY_CONTRACT);

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

          console.log("contract-read-error-for-allowance", error);
        }
      })();
    }
  }, [address, provider]);

  return {
    allowance: isSuccess ? data : undefined,
    isLoadingAllowance: isLoading,
  };
}
