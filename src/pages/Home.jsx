import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer/index.jsx";
import { FaCrown } from "react-icons/fa6";
import { CiGlobe } from "react-icons/ci";
import { GoCopy } from "react-icons/go";
import { GoArrowUpRight } from "react-icons/go";
import { IoWalletOutline } from "react-icons/io5";
import { LiaShareSolid } from "react-icons/lia";
import { FaTelegram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

import avalancheIcon from "../assests/images/avalanche.png";
import bscIcon from "../assests/images/bsc.png";
import polygonIcon from "../assests/images/polygon.png";
import moonbeamIcon from "../assests/images/moonbeam.png";
import onusIcon from "../assests/images/onus.png";

import metamaskIcon from "../assests/images/metamask.jpeg";
import ricewalletIcon from "../assests/images/ricewallet.png";
import walletconnectIcon from "../assests/images/walletconnect.jpeg";

import MintImg1 from "../assests/images/MintImg1.jpeg";
import MintImg2 from "../assests/images/MintImg2.jpeg";
import MintImg3 from "../assests/images/MintImg3.jpeg";
import MintImg4 from "../assests/images/MintImg4.jpeg";
import MintImg5 from "../assests/images/MintImg5.jpeg";

import mintbg from "../assests/images/mintbg.jpg";
import avatarSrc from "../assests/images/avatar.png";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Connect } from "../Connect.js";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useProvider } from "wagmi";
import { useMemo } from "react";
import { useAllowance } from "../hooks/useAllowance.js";
import { useTotalMinted } from "../hooks/useTotalMinted.js";
import { useTotalSupply } from "../hooks/useTotalSupply.js";
import { useMaxSupply } from "../hooks/useMaxSupply.js";
import { useApproveWrite } from "../hooks/useApproveWrite.js";
import whitelist from "../whitelist.json";
import { usePrice } from "../hooks/usePrice.js";
import { useAlreadyMinted } from "../hooks/useAlreadyMinted.js";
import { useMintWrite } from "../hooks/useMintWrite.js";
import { formatUnits } from "ethers/lib/utils.js";
import { USDT_CONTRACT, STEDDY_CONTRACT } from "../constants.js";
import erc20ABI from "../erc20ABI.json"
import STEDDYABI from "../STEDDYABI.json"
import { Contract } from "ethers";
import "./Home.css";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

gsap.registerPlugin(ScrollTrigger);

const imageArray2 = [
  {
    src: MintImg1,
    title: "keygal",
  },
  {
    src: MintImg2,
    title: "Hadalns",
  },
  {
    src: MintImg3,
    title: "OANac",
  },
  {
    src: MintImg4,
    title: "Flccal",
  },
  {
    src: MintImg5,
    title: "ALCmla",
  },
];

export default function MintPage() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSelected, setIsSelected] = useState(0);

  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageArray, setImageArray] = useState([]);
  const { allowance, isLoadingAllowance } = useAllowance();
  const { totalMinted, isLoadingTotalMinted } = useTotalMinted();
  const { totalSupply, isLoadingTotalSupply } = useTotalSupply();
  const [maxQuantity, setMaxQuantity] = useState(0);
  const [proof, setProof] = useState(null);
  const [count, setCount] = useState(1);
  const { maxSupply, isLoadingMaxSupply } = useMaxSupply();
  const { alreadyminted, isLoadingAlreadyMinted } = useAlreadyMinted();
  const { price, isLoadingPrice } = usePrice();
  const { address } = useAccount();
  const provider = useProvider();
  const {
    approveWrite,
    approveWriteLoading,
    approveWriteSuccess,
    approveTxHash,
  } = useApproveWrite(getTotalAmount());
  // const notifyMintSuccessful = () => toast("Mint successful");
  const [mainText, setMainText] = useState("Approve USDT & Mint");
  const { mintLoading, mintSuccess, mintWrite, mintTxHash } = useMintWrite(
    count,
    maxQuantity,
    proof
  );
const contract = new Contract(USDT_CONTRACT, erc20ABI, provider);
const steddyContract = new Contract(STEDDY_CONTRACT, STEDDYABI, provider);


  // useApproveWrite(
  //   (Number(enteredAmount) - Number(formatEther(allowance))) * 10 ** 18
  // );

  const importAll = (r) => {
    return Promise.all(
      r.keys().map(async (key) => {
        const module = await r(key);
        return module;
      })
    );
  };

  const handleIncrement = () => {
    if (totalMinted + count + 1 < maxSupply) {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const handleDecrement = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  function getTotalAmount() {
    if (price) {
      let result = Number(price) * count;
      return result;
    }

    return 0;
  }
  function getAllowedMints() {
    if (address == null) {
      return;
    }
    let proofData = getQuantityAndProof(address);
    if (proofData == null) {
      return;
    }
    let maxQty = proofData.quantity;

    // console.log("ALREADY MINTED ", x.toNumber())
    // console.log("MAX QTY ", maxQty)
    let allowedMniting = maxQty - alreadyminted;
    console.log("Allowed minting ", allowedMniting);

    return allowedMniting;
  }

  function getQuantityAndProof(address) {
    for (const entry of whitelist) {
      if (entry.address === address) {
        return { quantity: entry.quantity, proof: entry.proof };
      }
    }
    return null; // Address not found
  }

  const loadImages = async () => {
    const images = await importAll(require.context("./NFT", false, /\.(png)$/));
    setImagesLoaded(true);
    return images;
  };

  useEffect(() => {
    // console.log("TOTAL MINTED ", totalMinted)
    // console.log("TOTAL SUPPLY ", totalSupply)

    let isMounted = true;
    if (isMounted) {
      loadImages().then((images) => {
        const newImageArray = images.map((image, index) => ({
          src: image,
          title: `STEDDY ${index + 1}`,
        }));
        setImageArray(newImageArray);
        // Example code for setting currentIndex to a new random index every 5 seconds
        const interval = setInterval(() => {
          setCurrentIndex(
            (prevIndex) => (prevIndex + 1) % newImageArray.length
          );
        }, 1000);

        return () => {
          clearInterval(interval);
          isMounted = false;
        };
      });
    }

    // console.log(imageArray);
  }, []);

  const handleClick = (index) => {
    setIsSelected(index);
  };

  const handleOpenClick = () => {
    setIsOpen(!isOpen);
  };

  const handleShareClick = () => {
    setIsShareOpen(!isShareOpen);
  };

  const handleWalletClick = () => {
    setIsWalletOpen(!isWalletOpen);
  };

  useEffect(() => {
    if (address == null || allowance == null || getTotalAmount() == 0) {
      return;
    }
    let proofData = getQuantityAndProof(address);
    if (proofData == null) {
      alert("Your connected wallet is not whitelisted");
      return;
    }
    // return
    let _proof = proofData.proof;
    setProof(_proof);
    // proof = JSON.stringify(proof)
    // proof = "["+proof+"]"
    let maxQty = proofData.quantity;
    setMaxQuantity(maxQty);
    if (Number(formatUnits(allowance, 6)) <= Number(getTotalAmount())) {
      setMainText("Mint");
    } else {
      setMainText("Approve");
    }
  }, [count]);

  useEffect(()=>{
    if(approveWriteSuccess){
      setMainText("Mint")
    }
  },[approveWriteSuccess])
  useEffect(()=>{
    if(mintSuccess){
      setMainText("Mint")
    }
  },[mintSuccess])

  const submit = async () => {
    // if (Number(enteredAmount) === 0) {
    //   setError("Enter some amount");
    //   return;
    // }

    // if (Number(enteredAmount) < MINIMUM_BET) {
    //   setError("Enter minimum bet amount");
    //   return;
    // }

    if (isLoadingAllowance === false && allowance === undefined) {
      // setError("Issue in getting your allowance");
      return;
    }

    // if (Number(maxBet) === 0) {
    //   setError(
    //     "There is no balance in the contract at the moment. No betting."
    //   );
    //   return;
    // }

    // if (Number(enteredAmount) > Number(formatEther(maxBet))) {
    //   setError(`Not a Valid Bet. You can bet max ${formatEther(maxBet)}`);
    //   return;
    // }

    let proofData = getQuantityAndProof(address);
    console.log("PRROF DATA ", proofData)
    if (proofData == null) {
      alert("Your connected wallet is not whitelisted");
      return;
    }
    
    // return
    let _proof = proofData.proof;
    setProof(_proof);
    // proof = JSON.stringify(proof)
    // proof = "["+proof+"]"
    let maxQty = proofData.quantity;
    setMaxQuantity(maxQty);
    console.log("PROOF ", proof);
    console.log("MX QTY ", maxQty);
    console.log("TOT AMT ", getTotalAmount());
    const alreadyminted = await steddyContract.mintedAddresses(address);
    if(alreadyminted>=maxQty){
      alert("You have already minted the maximum allowed "+Number(alreadyminted)+" tokens");
      return;
    }
    
    const data = await contract.allowance(address, STEDDY_CONTRACT);
    console.log("allowance ", Number(data));
    if (Number(data) < Number(getTotalAmount())) {
      console.log("ALLOWANCE IS LESS");
      setMainText("Approving");

      await approveWrite(getTotalAmount());
      console.log("Approve write success ", approveWriteSuccess);
      console.log("Approve Allowance ", allowance);
      console.log("TOT AMT 2 ",  Number(getTotalAmount()));
      
      
      const data = await contract.allowance(address, STEDDY_CONTRACT);
      console.log("allowance  2 ", data);
      setMainText("Mint");
      let _proof = getQuantityAndProof(address).proof
      console.log("Approve proof ", _proof);
      // if (Number(data) >= Number(getTotalAmount())) {
        
      //   console.log("MINTING ", approveWriteSuccess);

      //   await mintWrite(count, maxQuantity, _proof);
      // }
    } else {
      console.log("DIRECT MINTING ");
      console.log("maxqty ", maxQuantity);
      console.log("count ", count);
      console.log("proof ", proof);
      setMainText("Minting");
      console.log("Mint laoding ", mintLoading);
      await mintWrite(count, maxQuantity, proof);

      if(!mintLoading){
        setMainText("Mint")
      }
    }

    // setShowBetText(true);
  };

  useEffect(() => {
    if (isOpen) {
      setDropdownHeight(dropdownRef.current.offsetHeight);
    }
  }, [isOpen]);

  const copyTextToClipboard = () => {
    const textToCopy = document.querySelector(".text-to-copy");
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy.textContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000); // Reset the copied state after 3 seconds
    }
  };

  const txHashToShow = useMemo(() => {
    if (mainText === "Minting" && mintTxHash) {
      return mintTxHash;
    }

    if (mainText === "Approving" && approveTxHash) {
      return approveTxHash;
    }

    return "";
  }, [approveTxHash, mainText, mintTxHash]);

  function About() {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <div className="flex gap-10">
          <div>
            <div className="text-gray-400">Suppply</div>
            <div>10000</div>
          </div>
          <div>
            <div className="text-gray-400">Royalties</div>
            <div className="flex items-center gap-1">
              {" "}
              <span className="text-[#BEC2CE] leading-none">
                <FaCrown />
              </span>{" "}
              5%
            </div>
          </div>
          <div>
            <div className="text-gray-400">Metadata</div>
            <div>Mutable</div>
          </div>
        </div>

        <p>
          Sapp Teddy (STEDDY) is the first established NFTs collection brand to
          launch on the DN404 Binance Chain. There are only 10,000 ultra-limited
          rare Sapp Teddy that will ever be created. They come with several
          unique traits and designs. These collectibles will be forever stored
          on the Blockchain. They will be traded on the open market immediately
          after the mint is completed.
        </p>

        <button className="bg-[#ffffff20] rounded-lg py-3 px-6 font-semibold w-fit flex items-center gap-3 hover:bg-[#ffffff40] transition-all">
          <CiGlobe />
          sappchat/DN404
        </button>

        <div className="w-full border-b border-[#ffffff20]"></div>

        <p>
          The purpose of STEDDY is multifaceted, empowering supporters and
          fueling widespread adoption of decentralized communication and finance
          within the dynamic Sappchat ecosystem. At its core, STEDDY NFTs
          provide compelling incentives, fostering community engagement and
          participation.{" "}
          <b>
            These incentives include DeFi-based stake rewards, royalties on
            secondary sales, voting rights, stake rewards, and exclusive access
            to various opportunities,
          </b>{" "}
          motivating users to actively contribute to the ecosystem's growth.
        </p>

        <p>
          As the world increasingly embraces blockchain technology, the Sappchat
          ecosystem plays a crucial role in revolutionizing how individuals
          connect, communicate, and transact in the blockchain space. By
          leveraging the unique properties of NFTs, such as their
          non-fungibility and scarcity, STEDDY NFTs will help in creating a
          vibrant ecosystem where users can securely engage in decentralized
          interactions.
        </p>

        <p>
          STEDDY holders are categorized into distinct groups, each representing
          custodians responsible for guiding specific aspects of decentralized
          communication and finance within the ecosystem. These categories
          encompass a wide range of areas, including but not limited to privacy,
          security, proprietary wallet systems, launchpads, marketplace,
          artificial intelligence, and payment features. By dividing holders
          into these categories, the ecosystem ensures that individuals with
          relevant expertise and interests contribute to the development and
          realization of each category's function. Furthermore, STEDDY NFTs will
          serve as key components in the governance system within the Sappchat
          ecosystem. Through a structured governance framework, STEDDY holders
          can actively participate in decision-making processes related to
          ecosystem development.
        </p>

        <p>
          To conclude, STEDDY NTFs are the catalyst for decentralized innovation
          within Sappchat. They incentivize participation, facilitate
          governance, and align expertise with ecosystem development. Through
          these mechanisms, STEDDY NFTs will propel the widespread adoption of
          decentralized technologies, shaping the future of communication and
          finance.
        </p>

        <div className="w-full border-b border-[#ffffff20]"></div>

        <p>
          <b>Smart Contract</b>
        </p>

        <div className="flex justify-between">
          <button className="bg-[#ffffff20] rounded-lg py-3 px-6 font-semibold w-fit flex items-center gap-3 hover:bg-[#ffffff40] transition-all">
            <img
              src={avatarSrc}
              alt=""
              className="rounded-full w-6 aspect-square bg-gray-500"
            />
            Hyna...ksn
          </button>

          <div className="flex items-center">
            <button className="py-3 px-3 hover:bg-[#ffffff20] rounded-lg transition-all">
              <GoCopy />
            </button>
            <button className="py-3 px-3 hover:bg-[#ffffff20] rounded-lg transition-all">
              <GoArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    );
  }

  function SharePopUp() {
    return (
      <div className="bg-[#00000080] fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
        <div className="rounded-xl bg-dark w-[calc(100%-32px)] sm:w-[500px] p-8  sm:p-12 font-normalF text-center relative">
          <button
            className="absolute right-0 top-0 text-2xl m-5 py-3 px-3"
            onClick={handleShareClick}
          >
            <RxCross2 />
          </button>

          <img
            src={avatarSrc}
            alt=""
            className="w-14 aspect-square rounded-lg mx-auto my-8"
          />

          <h3 className="text-2xl font-bold mb-2">STEDDY DN404</h3>
          <p className="text-gray-500 text-sm mb-8">
            Copy the link below and share it with your friends and followers.
          </p>
          <div className="flex gap-2">
            <a
              href="https://twitter.com/SappChatApp"
              target="_blank"
              className="bg-[#2D2832] rounded-lg py-3 px-6 text-xl flex-1 flex items-center justify-center hover:bg-[#453d4d] transition-all"
              rel="noreferrer"
            >
              <FaTwitter />
            </a>
            <a
              href="https://t.me/sappchat"
              target="_blank"
              className="bg-[#2D2832] rounded-lg py-3 px-6 text-xl flex-1 flex items-center justify-center hover:bg-[#453d4d] transition-all"
              rel="noreferrer"
            >
              <FaTelegram />
            </a>
          </div>

          <div className="flex items-center justify-between py-3 pl-4 pr-1 border rounded-lg border-[#453d4d] mt-4">
            <p className="overflow-ellipsis overflow-hidden whitespace-nowrap text-left text-to-copy">
              https://sapp-chat.vercel.app/Mint
            </p>

            <div className="flex items-center">
              <button className="py-3 px-3 text-xl">
                <IoEyeOutline />
              </button>
              <button
                className="py-3 px-3 text-xl"
                onClick={copyTextToClipboard}
              >
                <GoCopy />
              </button>
            </div>
          </div>
          {isCopied && (
            <span className="text-green-500 text-sm mb-3 absolute bottom-0 left-1/2 -translate-x-1/2">
              Copied!
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        style={{ backgroundImage: `url(${mintbg})` }}
        className="bg-cover heroSection w-full sm:min-h-screen flex flex-col overflow-hidden relative text-white"
      >
        {/* backgrounds*/}
        <div
          style={{
            backgroundImage:
              "linear-gradient(rgba(18, 18, 18, 0.35) 0%, rgba(20, 17, 21, .95) 100%)",
          }}
          className="absolute w-full max-h-screen h-full left-0 top-0 backdrop-blur-sm z-[0]"
        ></div>
        <div
          style={{
            background: "rgba(20, 17, 21, .95)",
          }}
          className="absolute w-full h-full left-0 top-[100vh] backdrop-blur-sm z-[0]"
        ></div>

        {/* popups */}
        {isShareOpen && <SharePopUp />}
        {/* {isWalletOpen && <WalletPopUp />} */}

        {/* navbar */}
        <div className="bg-[rgba(250,242,246,0.05)] backdrop-blur-xl border-b border-[rgba(250,242,246,0.1)] w-full relative top-0 left-0 sm:flex hidden items-center h-fit py-6 px-6 font-Satoshi whitespace-nowrap shadow-xl justify-between">
          <div>
            <img
              src={avatarSrc}
              alt=""
              className="w-10 aspect-square rounded-sm"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleShareClick}
              className="bg-[#ffffff20] rounded-lg py-2 px-6 font-base w-fit flex items-center gap-3 hover:bg-[#ffffff30] transition-all"
            >
              <LiaShareSolid />
              Share
            </button>
            <ConnectButton showBalance={false} chainStatus="icon" />
            {/* <button
              onClick={handleWalletClick}
              className="bg-[#ffffff20] rounded-lg py-2 px-6 font-base w-fit flex items-center gap-3 hover:bg-[#ffffff30] transition-all"
            >
              <IoWalletOutline />
              Connect Wallet
            </button> */}
          </div>
        </div>

        {/* content */}
        <div className="px-5 sm:px-16 2xl:px-16 flex-grow flex flex-col sm:mx-auto xl:flex-row justify-center gap-4 sm:gap-[6vw] py-6 sm:py-20 items-start relative">
          {imagesLoaded ? (
            imageArray.map((item, index) => {
              return (
                <div
                  style={{ display: currentIndex === index ? "block" : "none" }}
                  className="w-full sm:w-[40vw] xl:w-[25vw] mx-auto rounded-3xl aspect-square bg-[#ffffff20] relative overflow-hidden"
                >
                  <img className="block w-full" src={item.src} alt="" />
                  <div className="opacity-80 absolute bottom-0 right-0 bg-[#636056] w-52 sm:w-64 sm:h-10 h-9 text-[#636056 flex justify-center items-center text-xl sm:text-2xl font-normalF font-bold uppercase">
                    {item.title}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full sm:w-[40vw] xl:w-[25vw] mx-auto rounded-3xl aspect-square bg-[#ffffff20] relative overflow-hidden"></div>
          )}

          <div className="w-full sm:w-[70vw] xl:w-[30vw] font-normalF">
            <h1 className="text-xl sm:text-[48px] font-bold sm:mb-4 mb-0 flex leading-10 items-center justify-between py-2 sm:py-0">
              STEDDY DN404{" "}
              <button
                onClick={handleShareClick}
                className="bg-[#ffffff20] rounded-lg py-3 px-3 font-base w-fit flex sm:hidden items-center gap-3 hover:bg-[#ffffff30] transition-all"
              >
                <LiaShareSolid />
              </button>
            </h1>

            <div className="w-full border-b border-[#ffffff20] flex gap-6">
              <button
                className={`py-4 border-b-2 ${
                  isSelected === 0 ? "border-sec" : "border-transparent"
                }`}
                onClick={() => handleClick(0)}
              >
                Mint
              </button>
              <button
                className={`py-4 border-b-2 ${
                  isSelected === 1 ? "border-sec" : "border-transparent"
                }`}
                onClick={() => handleClick(1)}
              >
                About
              </button>
            </div>

            {isSelected === 0 && (
              <div className="bg-[rgba(250,242,246,0.05)] backdrop-blur-xl rounded-xl w-full p-4 sm:p-6 mt-6 flex flex-col gap-2">
                <div className="font-bold flex justify-between">
                  <span>Public</span>
                  {/* <span>{parseFloat(formatUnits(price,6)).toString()} USDT</span> */}
                  <span>{Number(price) / 1000000} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-500">Live</span>
                  <span className="text-sm text-gray-400 font-semibold">
                    {totalMinted} / {maxSupply} Minted
                  </span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <button className="minus-button" onClick={handleDecrement}>
                    -
                  </button>
                  <span style={{ margin: "0 10px" }}>{count}</span>
                  <button className="plus-button" onClick={handleIncrement}>
                    +
                  </button>
                </div>
                <div className="rounded-full bg-[#ffffff20] p-[6px] my-4"></div>

                <div className="font-bold flex justify-between">
                  {/* <span>Total: {getTotalAmount()}</span> */}
                  <span
                    className="flex items-center gap-1"
                    // onClick={handleOpenClick}
                  >
                    Total amount : {formatUnits(getTotalAmount(), 6)} USDT
                    {/* <span
                      className={`font-bold text-xl leading-none transition-all duration-500 ${
                        isOpen ? "rotate-180" : " "
                      }`}
                    >
                      <IoIosArrowDown />
                    </span> */}
                  </span>
                </div>
                {/* 
                <div
                  style={{ maxHeight: isOpen ? `${dropdownHeight}px` : "0px" }}
                  className="overflow-hidden transition-all duration-500"
                >
                  <div ref={dropdownRef} className="flex flex-col">
                    <div className="flex justify-between">
                      <span className="">Quantity:</span>
                      <span className="text-gray-400">1</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="">Price:</span>
                      <span className="text-gray-400">0.5 BNB</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="">Platform Fee:</span>
                      <span className="text-gray-400">~0.01 BNB</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="">On-Chain Cost:</span>
                      <span className="text-gray-400">~0.024 BNB</span>
                    </div>
                  </div>
                </div>

 */}
                {address ? (
                  <button
                    onClick={submit}
                    disabled={approveWriteLoading || mintLoading}
                    className="mint-button disabled:bg-red rounded-lg p-4 text-black font-semibold"
                  >
                    {mainText}
                  </button>
                ) : (
                  <div className="connect-button"><ConnectButton  showBalance={false} chainStatus="icon" /></div>
                  
                )}
                {txHashToShow ? (
                  <p className="text-center mt-1">
                    Check transaction on
                    <a
                      target="_blank"
                      href={`https://mumbai.polygonscan.com/tx/${txHashToShow}`}
                      rel="noreferrer"
                      className="ml-1 text-green-500"
                    >
                      Explorer
                    </a>
                  </p>
                ) : null}
                 {/* {txHashToShow ? (
                  <p className="text-center mt-1">
                    Check transaction on
                    <a
                      target="_blank"
                      href={`https://mumbai.polygonscan.com/tx/${txHashToShow}`}
                      rel="noreferrer"
                      className="ml-1 text-green-500"
                    >
                      Explorer
                    </a>
                  </p>
                ) : null} */}
              </div>
            )}
            {isSelected === 1 && <About />}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
