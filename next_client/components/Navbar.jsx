import Link from "next/link";
import Image from "next/image"
import React, { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

export const Navbar = () => {
  const [nav, setNav] = useState(false);

  //background color of the navbar which is transparent (0) or translucent (1)
  const [color, setColor] = useState(0);

  const handleNav = () => {
    setNav(!nav);
  };


  //Add effect to make the navbar become translucent
  useEffect(()=>{
    function changeColorOnScroll(){
      if (window.scrollY > 100){
        //transparent
        setColor(1);
      }
  
      else{
        //translucent
        setColor(0);
      }
    }
    
    window.addEventListener('scroll', changeColorOnScroll);
    
  });


  return (
    <div className={`fixed left-0 top-0 w-full z-10 ease-in duration-300  ${  color == 0 ? "transparent": "backdrop-blur-md bg-white/30"}`}>

      {/* next div is for the navbar to sit inside a container */}
      <div className="max-w-[1240px] m-auto flex items-center justify-between p-4 text-[#191843] font-bold]">
        <Link href="/">
            <Image src='/favicon.ico' alt='matherium logo orca' className="inline" width='30' height='30'></Image>
          <h1 className="font-bold text-xl inline">Matherium</h1>
        </Link>
        {/* sm here means, anything above small media query -- tailwind is mobile-first */}
        <ul className="hidden sm:flex left-20">
          {/* <li className="p-4 hover:text-pink-600">
            <Link href="/#how-it-works">How it works</Link>
          </li> */}
          <li className="p-4">
            {/* <Link href="/">Sign up</Link> */}
            <button className="rounded-3xl  h-12 w-20 font-bold p-2 text-white text-sm  bg-red-500 hover:bg-red-400">
            <Link href="/#register">
            SIGN UP
            </Link>  
            </button> 
          </li>
        </ul>

        {/* Mobile button */}
        <div onClick={handleNav} className="block sm:hidden z-10">
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>

        {/* Mobile Menu */}
        <div
          className={
            nav
              ? "sm:hidden absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center w-full h-screen bg-white bg-opacity-80 backdrop-blur-xl text-center ease-in duration-300"
              : "sm:hidden absolute top-0 left-[-100%] right-0 bottom-0 flex justify-center items-center w-full h-screen bg-white bg-opacity-80 backdrop-blur-xl text-center ease-in duration-300"
          }
        >
          <ul>
            <li onClick={handleNav} className="p-4 text-3xl font-bold hover:text-red-500 block">
              <Link href="/#register">Sign up</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
