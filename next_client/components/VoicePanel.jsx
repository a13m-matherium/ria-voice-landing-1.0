import React from "react";

export const VoicePanel = () => {
  return (
    <div className="w-[50rem] h-[30rem] mt-[5rem] shadow-2xl ease-in duration-500 backdrop-blur-md bg-white/30 z-1 absolute rounded-md flex item-center justify-center">
      <div className="grid grid-cols-2 gap-24 mt-5">
        <div className="w-[15rem] h-[3rem] bg-white">1</div>
        <div className="w-[15rem] h-[3rem] bg-white">2</div>
        <div className="w-[15rem] h-[3rem] bg-white">1</div>
        <div className="w-[15rem] h-[3rem] bg-white">2</div>
      </div>
    </div>
  );
};
