import React, { useState, useEffect } from "react";



const RegisterSectionLandingPage = () => {
  let [snackBarVisibile, setSnackBarVisibile] = useState(false);
  
  //function to show success
  function showSucessSnackBar(){
    setSnackBarVisibile(true);
    // After 3 seconds, remove the snackbar
    setTimeout(()=>setSnackBarVisibile(false), 3000);
  }

  //the function that gets executed when you sign up
  function SignUpEvent(){
    
    //check if a valid input was made
    //show success snackbar TODO: if and only if it is a valid email
    showSucessSnackBar();
    //send a POST request

  }

  return (
    <div id="register" className='text-primary blue-purple-orange-with-white-bg flex-col overflow-hidden'>
        <h1 className='text-4xl md:text-6xl font-bold text-center pt-[2rem]'>
            Get Early Access 🚀
        </h1>

        <h4 className='text-md md:text-lg text-center mt-10 mb-[4rem]'>
            We will onboard you as soon as possible🙂
        </h4>
        
        <form action="" className='mt-5 w-screen place-content-center flex'>
            <input type="email" placeholder='Email Address' inputMode='email' pattern="[^@\s]+@[^@\s]+\.[^@\s]+" className='rounded-full h-10 w-80 my-auto p-1' />
            <button onClick={SignUpEvent} type='submit' className='my-auto ml-[-3rem] border bg-red-500 hover:bg-red-400 text-white text-xs p-2 rounded-full h-[2.6rem] font-bold' >SIGN UP</button>
        </form>
        {/* <div className={`z-2 text-center rounded-full bg-green-500 text-white mt-2 max-w-[15rem]  h-10 mx-auto p-2 ${snackBarVisibile ? "visible":"invisible"}`}> */}
        <div id="snackbar" className={`z-2 text-center rounded-full bg-green-500 text-white mt-2 max-w-[15rem]  h-10 mx-auto p-2  ${snackBarVisibile? "show" : ""}`}>

          You've Signed Up!🎉
        </div>
        
        <span className='w-full flex place-content-center mt-[5rem] text-slate-600'>contact@matherium.com</span>
        <span className='text-slate-600 bottom-1px text-sm flex place-content-center mt-[10rem]'>© Matherium LLC 2023. All rights reserved.</span>

        
    </div>
  )
}

export default RegisterSectionLandingPage