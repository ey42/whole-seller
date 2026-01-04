"use client"
import { ChangeEvent, useEffect, useState, WheelEvent } from 'react'
import { PRODUCTCS } from '../fakedatabase'
import Image from 'next/image'
import Link from 'next/link'
import { Icons } from '@/Icons/iconica'
import { ChevronDown } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'
import { oneCategory } from '../types'
import { authClient } from '@/lib/auth-client'

interface nameObject {
  [name: string]: string
}
interface User {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
}
const Category = ({id,specificCategory}: {id:string,specificCategory: oneCategory}) => {
  const [amount, setAmount] = useState<number | null>(null)
  const [user, setUser] = useState<string | null>(null)
  const [comment, setComment] = useState<string | null>(null)
  const [nameO, setName] = useState<nameObject>({})
  const [commentO, setCommentO] = useState<nameObject>({})
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const {toggleCart, addItem, items} = useCart()
  const router = useRouter()

  const handleAmount = (event: ChangeEvent<HTMLInputElement>, productName: string) => {
    const { value, name } = event.target
    setAmount(Number(value))
  
    setName((prev) => ({
      ...prev,
      [productName]: value
    }))
  }
  
  const handleComment = (event: ChangeEvent<HTMLTextAreaElement>, productName: string) => {
    const { value, name } = event.target
    setComment(value) 
    setCommentO((prev) => ({
      ...prev,
      [productName]: value
    }))
  }

  useEffect(() => {
    setIsMobile(window.innerWidth >= 640);

    const handleResize = () => {
      setIsMobile(window.innerWidth >= 640)
    };

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  },[])

  useEffect(() => {
    const user = authClient.getSession().then((session) => {
      if(session.data?.user.email){
        setUser(session.data?.user.email)
      }else {
        setUser(null)
      }
    })
  },[])
  console.log(nameO)
  return (
    <div className='text-black w-full wrap max-sm:whitespace-pre-line flex mb-10 gap-20 flex-col'>
      {specificCategory && <div className='flex justify-between px-20 items-start w-full max-sm:flex-col gap-10 max-sm:px-5'>
        <Image className='w-64 max-sm:w-fit' alt={specificCategory?.catagory} src={specificCategory?.image} width={200} height={400}/>
        <div className='flex w-1/2 bg-[rgba(0,0,0,0.3)] p-5 text-amber-50 max-sm:w-full flex-col rounded-2xl gap-8'>
          <div><h1 className='font-bold text-4xl'>{specificCategory?.catagory}</h1></div>
          <div className='flex flex-col gap-2'>
            <h2 className='font-medium text-lg'>details</h2>
            <p className='text-[#565353]'>{specificCategory?.details}</p>
          </div>
  
            <h1 className='text-2xl flex font-bold'><span className='-mt-2 -ml-3'><ChevronDown strokeWidth={3} width={70} height={50}/></span>Explore the different types of {specificCategory?.catagory} we offer below </h1>
        </div>
      </div>}
      <div className='flex flex-col gap-y-20 justify-center gap-10 px-20 max-sm:px-5 items-start w-full'>
        {
         specificCategory !== undefined && specificCategory.products.map((product, index) => (
            <div className='flex max-sm:whitespace-pre-line max-sm:flex-col max-sm:p-0 justify-between pr-10 w-full' key={index}>
              <div className='border-2 border-white flex max-sm:flex-row flex-col gap-4 p-5 rounded backdrop-blur-lg backdrop-opacity-50 justify-start items-start'>
                <div className='w-44 h-44'>
                <Image className='w-full h-full' alt={product.name} src={product.image} width={1000} height={1000} />
                </div>
                <div className='flex gap-4 flex-col'>                
                <p className='text-[#ffffff] w-full max-w-72 max-sm:hidden text-lg'>{product.description}</p>
                <div className='flex flex-col gap-1'>
                <h2 className='text-[#ffffff] font-medium border-b'>amount on stock: {product.amountOnStock}</h2>
                <h2 className='text-[#ffffff] font-medium border-b'>{product.name} {specificCategory.catagory}</h2>
                <p className='text-[#ffffff] font-medium border-b'>ETB {product.price}.00</p>
                </div>
                </div>

              </div>
              <div className='flex flex-col border-2 border-white text-white mt-10 gap-6 max-sm:gap-3 rounded p-5 backdrop-blur-lg backdrop-opacity-50 w-1/3 max-sm:w-full'>
                <div className='flex flex-col min-w-full'>
                  <label className='text-[#565353]' htmlFor="amount">amount</label>
                  <input className='w-full font-medium pl-1 [appearance:textfield] h-10 spin-in border-2 border-white rounded focus:outline-none' type="number" name={product.name} onChange={(e) => handleAmount(e, product.name)} onWheel={(e: WheelEvent<HTMLInputElement>) => e.currentTarget.blur()} value={nameO[product.name] || ""}/>
                </div>
                <div className='flex flex-col'>
                  <label className='text-[#565353]' htmlFor="amount">comment</label>
                  <textarea className='pl-1 font-medium w-full border-2 min-h-10 border-white rounded focus:outline-none' onChange={(e) => handleComment(e, product.name)}  rows={2}/>
                </div>
                <div className='flex flex-col mt-14 max-sm:mt-2 gap-8 justify-center items-center w-full'>
                  <div className=' self-center flex w-full font-semibold gap-4'>
                    <p className='whitespace-pre-wrap'>price * amount</p>
                    <h1 className='w-1/2'>{amount ? `${(Number(nameO[product.name] ?? 0) * product.price)}`: 0}</h1>
                  </div>
                  
                  <button onClick={() => {
                    if(!user){
                    setAmount(null)
                    router.push('/login')
                    
                  } else if(user) {
                    product.price && 
                    addItem({
                    categoryName: specificCategory.catagory,
                    id: product.id,
                    image: product.image,
                    name: product.name,
                    price: product.price,
                    orderPrice: amount ? (Number(nameO[product.name] ?? 0) * product.price) : 0,
                    quantity: amount!!,
                    comment: comment ? commentO[product.name] : undefined
                    }) 
                    setAmount(null)
                  }
                    }
                    } 
                    className=' w-full px-4 py-1 hover:bg-[#dddddd] backdrop-blur-2xl border-white border hover:text-black text-white text-center whitespace-nowrap cursor-pointer font-medium'>add to cart</button>
                </div>
              </div>
            </div>
          ))
        }
        <div>
          <h1>{}</h1>
        </div>
      <div onClick={isMobile ? toggleCart : () => { 
        if(!user){
          router.push('/login')
        } 
        if(user){
          router.push('/cart')
        }
        }} className='text-white cursor-pointer self-center duration-300 transition-all shadow-[0_3px_5px_1px_rgba(150,150,150,0.9)]  
      hover:shadow-[0_2px_3px_1px_rgba(0,0,0,0.9)]  
      hover:translate-y-1 whitespace-nowrap gap-4 text-2xl flex border-2 bg-black border-white px-10 py-2 font-bold'>       
         <h1>cart</h1>
         <Icons.cart width={30} height={30} fill='white'/>
      </div>
      </div>
      <div className='flex text-white px-20 gap-8 min-w-full bg-[rgba(0,0,0,0.5)] flex-col overflow-hidden items-start'>
        <h1 className='font-bold text-4xl max-sm:text-3xl'>Other Products</h1>
        <div className='flex smallProduct py-5 overflow-x-auto w-full gap-10'>
          {PRODUCTCS.map((product, index) => (
            <Link href={`/category/${product.id}`} className=' flex-col shrink-0 flex-nowrap border-black' key={index} replace hidden = {product.id === id}>
              <Image className=' w-32 h-32 max-sm:w-24 max-sm:h-24' alt={product?.catagory} src={product?.image} width={200} height={200}/>
              <h1 className='font-medium whitespace-nowrap text-xl'>{product?.catagory}</h1>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Category
