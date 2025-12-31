"use client"
import Link from 'next/link'
import { useCart } from './context/CartContext'
import { ArrowLeft, ArrowUpLeft, ArrowUpLeftFromSquareIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import GridBackground from './GridBackground'

interface updateObjectProps {
  [id: string]: string
}

const Cart = () => {
  const [checked, setChecked] = useState(false)
  const [comment, setComment] = useState<updateObjectProps>({})
  const [quantity, setQuantity] = useState<updateObjectProps>({})
  const {items, addItem, removeItem, clearCart} = useCart()
  const router = useRouter()
  const itemCount = items.reduce((sum, i) => sum + (i.price * i.quantity),0)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    router.back()
  }
  const handleChangeComment = (e: React.ChangeEvent<HTMLTextAreaElement>, id: string) => {
    const { value} = e.target
    setComment((prev) => ({
      ...prev,
      [id]: value
    }))
  }
  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const { value} = e.target
    setQuantity((prev) => ({
      ...prev,
      [id]: value
    }))
  }
  const handleUpdateItem = (id: string, quantity: number, comment?: string) => {
    const item = items.find((item) => item.id === id)
     if (!item) return
    addItem({...item, comment, quantity}, true)
  }
  return (
    <div className='flex px-10 max-sm:px-2 pt-5 flex-col w-5/6 max-sm:w-full pb-10 text-white gap-10'>
      <div onClick={handleClick} className='font-bold flex gap-2 max-sm:self-start text-xl'> <ArrowLeft className='mt-1'/> continue shopping</div>
      <div className='self-center max-sm:text-2xl text-4xl underline underline-offset-8 font-bold tracking-wider'>HERE IS YOUR ORDER</div>
      <div className='flex max-sm:flex-col max-sm:self-start max-sm:justify-start max-sm:px-2 max-sm:w-full self-center justify-center px-10 gap-20 w-full'>
        <div className='w-96 max-sm:w-full gap-4 flex flex-col'>
          {items.length === 0 ? <div className='flex justify-center items-center h-full font-bold text-2xl'>Your cart is empty</div> : items.map((item, index) => (
            <div key={index} className='flex bg-sky-100 shadow-[-5px_2px_10px_1px_rgba(0,0,0,0.9)] flex-col border-2 border-black rounded-sm p-5 gap-2'>
              <h1 className='font-bold text-xl'>{item.name}</h1>
              <div className='mt-2 flex items-end gap-6'>
                <div className='flex gap-1 flex-col'>
                <label className='font-medium text-sm' htmlFor='quantity'>Quantity: you can update</label>
                <div className='flex max-sm:flex-col gap-4'>    
                <input
                  id='quantity'
                  name='quantity'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeQuantity(e, item.id)}
                  type='number'
                  className='[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:-moz-appearance-textfield font-medium border-2 spin-out focus:outline-none py-0.5 border-black rounded-[1.5px] bg-slate-50 pl-1'
                  value={quantity[item.id] ?? "" }
                  onWheel={(e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur()}
                />
                <button className='border-2 duration-150 transition-all shadow-[0_3px_5px_1px_rgba(0,0,0,0.5)]
 border-black h-8 font-medium rounded-[1.5px] bg-black text-white px-4 whitespace-pre cursor-pointer' onClick={() => handleUpdateItem(item.id, Number(quantity[item.id]) ?? item.quantity, item.comment)}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if(e.key === 'enter'){
                    e.preventDefault()
                    handleUpdateItem(item.id, Number(quantity[item.id]) ?? item.quantity, item.comment)
                  }
                }}
                >update</button>
                </div>
            
                </div>
              </div>
              <p className='font-medium'>Price: ETB {item.price}.00</p>
              <p className='font-medium'>Order Price: ETB {item.orderPrice}.00</p>
              {item.comment && <p className='font-medium'>Comment: {item.comment !== undefined || null ? item.comment : ""}</p>} 
        </div>))}
        </div>
        <div className='w-96 px-2 max-sm:w-full rounded-sm justify-between h-96 border-2 text-white flex flex-col gap-4 bg-black border-black'>
          <div className='flex flex-col gap-4 mt-4 px-4'>
            <h1 className='font-bold text-center text-3xl border-b-2 pb-4 pt-2 '>Summary</h1>
            <h3 className='font-medium tracking-wider'>Products: {items.length} products </h3>
            <h3 className='font-medium tracking-wider'>Delivery: free delivery </h3>
            <h3 className='font-medium tracking-wider'>Total Price: {itemCount} ETB</h3>
          </div>
          <button className='mb-10 bg-white text-black font-bold text-lg whitespace-nowrap cursor-pointer self-center rounded-[0.5px] px-6 py-2 w-32'>Order now</button>
        </div>
      </div>
    </div>

  )
}

export default Cart
