import React from "react";
import logoicon from "../../assests/images/logoicon.png";
import appstore from "../../assests/images/appstore.png";
import googleplay from "../../assests/images/googleplay.png";
import { footerLink, googleplayLink, appstoreLink } from "../../Constants/links";

import twitter from "../../assests/logos/twitter.png";
import telegram from "../../assests/logos/telegram.png";
import medium from "../../assests/logos/m.png";

export default function Footer() {
 
  return (
    <>
    <div className="bg-dark flex flex-col items-center py-20 sm:py-32 px-5 sm:px-16 gap-12">
      <a href="/">
        <img className="w-32 sm:w-40" src={logoicon} alt="" />
      </a>
      <div className="flex gap-10">
        <a href={googleplayLink} target="_blank" rel="noreferrer">
          <img src={googleplay} alt="" />
        </a>
        <a href={appstoreLink} target="_blank" rel="noreferrer">
          <img src={appstore} alt="" />
        </a>
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        {footerLink.map(({ label, src }, index) => {
          return (
            <a
            key={index}
              className="basis-[40%] sm:basis-[10%] no-underline text-white text-center text-xl sm:text-2xl font-normalF whitespace-nowrap"
              href={src}
              target="_blank"
              rel="noreferrer"
            >
              {label}
            </a>
          );
        })}
      </div>
    </div>
    <div className="w-full bg-black py-10 px-5 sm:px-16 flex gap-5 items-center flex-col sm:flex-row text-white font-normalF">
      <p className="flex-1 text-center sm:text-left">Copyright © 2024 OrangeRock Labs | All Rights Reserved</p>
      <p className="flex-1 text-center">Developed by <b>OrangeRock Labs Ltd.</b></p>
      <div className="flex gap-5 justify-end flex-1">
        <a href="https://twitter.com/SappChatApp" target="_blank" rel="noreferrer">
          <img src={twitter} alt="" />
        </a>
        <a href="https://t.me/sappchat" target="_blank" rel="noreferrer">
          <img src={telegram} alt="" />
        </a>
        <a href="https://sappchatapp.medium.com" target="_blank" rel="noreferrer">
          <img src={medium} alt="" />
        </a>
      </div>
    </div>
    </>
  );
}
