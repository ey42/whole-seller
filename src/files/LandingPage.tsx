"use client"
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { PRODUCTCS } from './fakedatabase'
import { Icons } from '@/Icons/iconica'
import Link from 'next/link'
import {motion} from "motion/react"
import GridBackground from './GridBackground'
// import { CartContext } from './context/CartContext'


const LandingPage = () => {
  const [randomArray, setRandomArray] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [randomArrayProducts, setRandomArrayProducts] = useState<number>()
  const [showNextPage, setShowNextPage] = useState<boolean>(false);
  const nextSectionRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    setIsLoading(true)
    let randomArrays: number[] = []
     let randonNumberProduct = Math.floor(Math.random() * PRODUCTCS.length)
    // let randonNumberProduct = 0
     console.log(`catagory: ${randonNumberProduct}`)
     setRandomArrayProducts(randonNumberProduct)
      for (let i = 0; i < 2; i++) {
        let randonNumber = Math.floor(Math.random() * PRODUCTCS[randonNumberProduct].products.length)
        if(randomArrays === null || randomArrays[0] !== randonNumber || randomArray.includes(randonNumber)){
          randomArrays.push(randonNumber)
          console.log(`product: ${randonNumber}`)
        } else if (randomArrays[0] === randonNumber){
          i--
        }
      
    }
    setRandomArray(randomArrays)
    setIsLoading(false)
  },[])

  const handleVideoEnd = () => {
    setShowNextPage(true)
    setTimeout(() => {
      nextSectionRef.current?.scrollIntoView({behavior: 'smooth'});
    })
  }

  
  return (
    <GridBackground>
    <div className='flex select-none flex-col pb-10 justify-center'>
      <div className='relative h-screen max-sm:hidden w-full'>
      {!showNextPage && 
      // <Image className='h-full' alt="hy" src="/merkato-panoramic-shot 1.svg" objectFit='cover' objectPosition='center' fill/> :
      <video src="/AddisAbabaMerkato.mp4" className='top-0 object-cover left-0 absolute h-full w-full' onEnded={handleVideoEnd} autoPlay muted playsInline></video>}
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-5 items-center text-2xl'>
        <h1 className='font-bold text-white opacity-100 max-md:text-6xl whitespace-nowrap text-8xl'>EYOB SHOP</h1>
        <div className='relative flex flex-col justify-center items-center'>
          <div className='w-80 max-md:w-72 max-md:h-12 h-16 bg-white opacity-65 rounded-lg'></div>
          <h1 className='absolute font-bold max-md:text-xl whitespace-nowrap text-black'>Eyob Whole Distributer</h1>
          </div>
        <motion.button whileHover={{scale: 1.1}} whileTap={{scale: 0.8}} className='bg-black px-6 py-2 cursor-pointer text-white font-bold rounded-md' onClick={handleVideoEnd}>Order now</motion.button>
      </div>
      </div>
      
      <div className='text-white flex flex-col justify-center gap-10 mt-10 items-center' ref={nextSectionRef}>
        <h1 className='font-bold text-4xl max-sm:hidden max-w-4xl'>Your Search For A Comprehensive Wholesale Partner In Addis Ababa Ends Here.</h1>
        <p className='max-w-2xl text-lg max-sm:hidden self-start p-5 ml-5 bg-[rgba(0,0,0,0.8)]'> <span className='font-bold'>Eyob Whole Seller</span> specializes in the efficient distribution of a wide spectrum of categorized goods. Get instant access to top-tier Milk, everyday Foods, a refreshing line of Soft Drinks, satisfying Snacks, creamy Yogurts, and delightful Biscuits. We are committed to ensuring your business receives fresh, quality products with unparalleled reliability and speed, right here in Addis Ababa.</p>
        <div className='flex flex-col self-start max-lg:self-center gap-10 px-5 wrap-break-word'>
          <h1 className='font-bold max-sm:text-xl text-4xl max-w-4xl'>Explore Our Diverse Product Categories</h1>
          <div className='flex flex-col '>
         
              <div className='columns-2 max-sm:gap-y-25 max-sm:max-w-full max-sm:gap-x-20  space-y-24'>
                {PRODUCTCS.map((product, pIndex) => (
                  <div className='flex border border-[#d7dade] gap-5 break-inside-avoid max-lg:flex-col max-lg:w-full flex-1 w-full overflow-hidden bg-[rgba(0,0,0,0.8)] p-4' key={pIndex}>
                    <div className='flex gap-2 flex-col max-lg:items-center max-lg:order-2'>
                    <h1 className='text-2xl order font-bold'>{product.catagory}</h1>
                    <p className='max-w-xs max-md:hidden text-[#828282]'>{product.description}</p>
                  <motion.div whileHover={{scale: 1.1}} whileTap={{scale:0.8}} className='border-2 h-10 max-md:text-sm max-md:px-2 max-md:py-1 self-center max-md:self-start bg-black text-white font-bold text-center items-center justify-center rounded-[5px] max-sm:rounded-xl max-md:w-full cursor-pointer w-56'>
                    <Link href={`/category/${product.id}`} className='w-full'> <h2 className='text-center w-full mt-1'>order now</h2></Link>
                  </motion.div>
                    </div>
                    <Image className='max-h-full w-full max-w-full flex-1 max-sm:w-full max-sm:h-full max-lg:order-1' width={200} height={100} alt={product.catagory} src={product.image}/>
                  </div>
                ))}
              </div>
          
          </div>
        </div>
        <div className='flex flex-col max-sm:hidden self-start rounded-md px-10 gap-10'>
          <h1 className='font-bold text-4xl self-center max-w-4xl'>sample price of product</h1>
          <div className='flex bg-[rgba(0,0,0,0.8)] p-4 self-center gap-20'>
            {randomArrayProducts !== null && randomArrayProducts !== undefined ? <div className='flex gap-4 flex-col'>
             <Image width={250} height={1000} alt={PRODUCTCS[randomArrayProducts!].catagory} src={PRODUCTCS[randomArrayProducts!].image} />
             <h1 className='font-bold text-2xl'>{PRODUCTCS[randomArrayProducts!].catagory} Products</h1>
             <p className='max-w-sm  text-[#828282] font-medium'>{PRODUCTCS[randomArrayProducts!].description}</p>
            </div> :<div className='flex gap-4 w-60 h-96 bg-gray-300'>
             {/* <Image width={250} height={1000} alt={'hy'} src={PRODUCTCS[randomArrayProducts!].image} />
             <h1 className='font-bold text-2xl'>{PRODUCTCS[randomArrayProducts!].catagory} Products</h1>
             <p className='max-w-sm  text-[#828282] font-medium'>{PRODUCTCS[randomArrayProducts!].description}</p> */}
            </div>}
            
              {/* {PRODUCTCS[randomArrayProducts!].products.map((category, index) => ( */}
                <div className='flex flex-col gap-10'>
                  
                  {randomArrayProducts !== undefined && isLoading ? 
                   <div className='max-w-sm flex flex-col gap-2'>
                        <div className='w-40 h-40 bg-gray-400'></div>
                        <h1 className='w-20 h-8' bg-gray-400></h1>
                        <p className=' w-32 h-8 bg-gray-400'></p>
                        <p className='w-32 h-8 bg-gray-400'></p>
                      </div>
                  : randomArray.map((num, nIndex) => {
                    const category = randomArrayProducts !== undefined ? PRODUCTCS[randomArrayProducts] : undefined;
                    const item = category?.products?.[num];

                    return (
                      <div className='max-w-sm flex flex-col gap-2' key={nIndex}>
                        <Image width={100} height={100} alt={item?.name ?? ''} src={item?.image ?? ''} />
                        <h1 className='font-bold'>{item?.name}</h1>
                        <p className=' text-[#828282]'>{item?.description}</p>
                        <p className='font-medium'>Price: {item?.price ?? ''} ETB</p>
                      </div>
                    )
                  })}
                    
                
                </div>


              {/* ))} */}
            
          </div>
        </div>
        <div className='flex flex-col gap-10 self-start px-10'>
          <h1 className='font-bold text-4xl max-sm:text-xl max-w-4xl'>Our Wholesale Distribution Services</h1>
          <div className='grid grid-cols-2 max-sm:grid-cols-1 gap-x-20 gap-y-10'>
              <div className='flex flex-col p-2 gap-2 bg-[rgba(0,0,0,0.8)]'>
                <Icons.world width={20} height={20} fill='#ffffff'/>
                <h1 className='text-lg font-medium'>Serving All place of Addis Ababa</h1>
                <p className='text-[#828282]'>Leverage our robust and far-reaching distribution network across all major place and unknown place of Addis Ababa. We ensure efficient and timely delivery of your products, reaching your target markets effectively.</p>
              </div>
              <div className='flex flex-col gap-2 p-2 bg-[rgba(0,0,0,0.8)]'>
                <Icons.Lock width={20} height={20} fill='#ffffff'/>
                 <h1 className='text-lg font-medium'>Reliable & Secure Supply Chain</h1>
                 <p className='text-[#828282]'>We prioritize the integrity and security of your products throughout the entire distribution process. From secure warehousing to carefully managed logistics, we ensure your goods arrive safely and in optimal condition, protecting your brand reputation.</p>
              </div>
              <div className='flex flex-col gap-2 p-2 bg-[rgba(0,0,0,0.8)]'>
                <Icons.User width={20} height={20} fill='#ffffff'/>
                 <h1 className='text-lg font-medium'>Why Choose Us?</h1>
                 <p className='text-[#828282]'>Beyond just logistics, we offer personalized support tailored to your unique business needs. Our dedicated account managers work closely with you to understand your goals and provide solutions that drive growth and profitability.</p>
              </div>
              <div className='flex flex-col gap-2 p-2 bg-[rgba(0,0,0,0.8)]'>
                <Icons.Calendar width={20} height={20} fill='#ffffff'/>
                 <h1 className='text-lg font-medium'>Your Products, On Time, Every Time</h1>
                 <p className='text-[#828282]'>Our advanced logistics and planning ensure rapid order processing and consistent, on-time delivery across Ethiopia. We understand the importance of speed in the market and are equipped to meet your demanding schedules.</p>
              </div>
          </div>
        </div>
      </div>
    </div>
    </GridBackground>
  )
}

export default LandingPage
