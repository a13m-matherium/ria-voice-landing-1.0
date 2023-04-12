import Link from "next/link";
import React from "react";
import { VoicePanel } from "./VoicePanel";

export const Hero = () => {
  return (
    <div className="text-primary m-0 z-1 flex w-auto h-full blue-purple-orange-with-white-bg-4 bg-center bg-cover overflow-hidden">

      <div className="mt-[7rem] text-center w-full font-bold ">
        <span className="text-xl md:text-2xl lg:text-4xl">
          <h1 className="text-leftfont-bold w-screen">
            EXCEPTIONAL {" "}
            <span className=" font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-red-500">
              AI{" "}
            </span>{" "}
            CUSTOMER SUPPORT 
          </h1>
        </span>
        
        <span className="mt-[2rem] text-xl md:text-2xl lg:text-4xl">
          <h1 className="font-bold">
            IN MINUTES WITH {" "}
          
          <span className="text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#60a5fa] to-red-500">
                RIA VOICE{" "}
          </span>{" "}
          </h1>
        </span>

        

        <h3 className="mt-10 text-center text-sm md:text-base lg:text-xl font-medium ">
        Upload Your FAQs and Documents and That’s It. <br /> Our Conversational AI will Answer Your Customer Calls.
        </h3>
        {/* <h4 className="text-md text-gray-500 mt-5"> Don't make them press 1 again!</h4> */}
      
      <video className="mt-[2.5rem] mx-auto rounded-lg max-w-[15rem] max-h-[20rem] lg:max-w-[30rem] lg:max-h-[30rem] " src="/demo-loop.mp4" loop autoPlay muted/>
      
      {/* the trial button */}
      <button  className="mt-[3rem] p-[1rem] rounded-full white text-white bg-red-500 hover:bg-red-400 ">
        <Link href="/#register">
          TRY RIA VOICE FOR FREE
        </Link> 
      </button>

      <div className="self-center mx-auto mt-[2.5rem] mb-[2.5rem] md:mt-[3rem] md:mb-[3rem]">
        <ul className="space-y-2 md:space-y-3 mx-auto text-blue-950">
          <li>
            <span className="flex space-x-1 md:space-x-3 text-xs md:text-sm place-content-center">
              <img className="w-4 h-4 md:w-6 md:h-6" src="/check-mark.png" alt="a check mark" />
              <span>Understands open-ended questions</span> 
            </span>
          </li>
          <li>
            <span className="flex space-x-1 md:space-x-3 text-xs md:text-sm place-content-center">
              <img className="w-4 h-4 md:w-6 md:h-6" src="/check-mark.png" alt="a check mark" />  
              <span>Handles entire conversations</span> 
            </span>
          </li>
          <li>
            <span className="flex space-x-1 md:space-x-3 text-xs md:text-sm place-content-center">
              <img className="w-4 h-4 md:w-6 md:h-6" src="/check-mark.png" alt="a check mark" />  
              <span className="my-auto">Quick and Easy Setup</span> 
            </span>
          </li>
  
        </ul>
      </div>

        {/* <div className="self-center">
            <span className="w-6">
              <img className="w-6" src="/check-mark.png" alt="a check mark" /> <span>Understands open-ended questions</span>
            </span>
            <span className="w-6">
              <img className="w-6" src="/check-mark.png" alt="a check mark" /> <span>Handles entire conversations</span>
            </span>
            <span className="w-6">
              <img className="w-6" src="/check-mark.png" alt="a check mark" /> <span>Quick and Easy Setup</span>
            </span>
    
        </div> */}
      </div>
      
    </div>
  );
};
