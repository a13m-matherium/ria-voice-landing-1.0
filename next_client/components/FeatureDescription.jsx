import React from 'react'

export const FeatureDescription = () => {
  return (
    <div className='h-screen bg-whiteish text-primary'>
        <h1 className=' text-center font-bold pt-[5rem] text-xl md:text-2xl px-[5rem]'>Don't Make Your Customers Wait <span className=' underline underline-offset-4 decoration-red-400'> Business Days</span>  for a Response</h1>
        
        <div id='grid' className='h-full mt-[5rem] grid grid-row-2 grid-flow-col place-content-stretch gap-2 px-1 text-black'>
            <div className='text-md md:text-lg row-span-1 space-y-[5rem]'>
                <div className='space-y-[2rem]'>
                    <img src="/lightning-icon.png" className='max-w-[2.5rem] md:max-w-[5rem] mx-auto'  alt="icon of lightning"/>
                    <h3 className='text-center'>Instant Responses</h3>
                </div>

                <div className='space-y-[2rem]'>
                    <img src="/email-icon.png" className='max-w-[2.5rem] md:max-w-[5rem] mx-auto' alt="email icon"/>
                    <h3 className='text-center'>Ease Your Email Burden</h3>
                </div>
            </div>


            <div className='text-md md:text-lg row-span-1 space-y-[5rem]'>
                <div className='space-y-[2rem]'>
                    <img src="/24x7-icon.png" className='max-w-[2.5rem] md:max-w-[5rem] mx-auto' alt="icon of that says 24x7"/>
                    <h3 className='text-center'>Always Available</h3>
                </div>

                <div className='space-y-[2rem]'>
                    <img src="/document-icon.png" className='max-w-[2.5rem] md:max-w-[5rem] mx-auto' alt="icon of a document"/>
                    <h3 className='text-center'>Reads through Documents</h3>
                </div>
            </div>
        </div>

        

    </div>
  )
}

export default FeatureDescription