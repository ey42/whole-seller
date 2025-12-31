"use client"
import React, { useEffect, useState } from 'react'
import { useCart } from './context/CartContext'
import { cn } from '@/lib/utils'
import { Frown, Trash } from 'lucide-react'
import { Icons } from '@/Icons/iconica'
import Link from 'next/link'
import { user } from './fakedatabase'

const CartDrawer = () => {
    const { closeCart, isOpen, items, removeItem, clearCart} = useCart()    
    const itemCount = items.reduce((sum, i) => sum + (i.price * i.quantity),0)

    useEffect(() => {
        const handleOutSideClick = (e: MouseEvent) => {
            const drawer = document.getElementById("cart-drawer");
            if(drawer && !drawer.contains(e.target as Node)) closeCart()
;        };
            if (isOpen) document.addEventListener("mousedown", handleOutSideClick);
            return () => document.removeEventListener("mousedown", handleOutSideClick)
    },[isOpen, closeCart])
  return (
    <div className={cn('flex h-full z-30 text-white fixed inset-0 transition-opacity duration-300', isOpen ? "visible opacity-100": "invisible opacity-0", user ? '' : 'invisible')}>
      <div id='cart-drawer' className={cn('absolute flex flex-col right-0 w-80 top-16 max-h-full cart overflow-auto border-2 border-black bg-black shadow-lg p-4 transform transition-transform duration-300', isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className='flex justify-between items-center mb-4'>
            <h2 className='text-lg flex items-center gap-3 font-semibold'>Your Cart <Icons.cart width={20} height={20} fill='white'/></h2>
            <button className='font-bold text-xl cursor-pointer' onClick={closeCart}>X</button>
        </div>
        {items.length === 0 ? (
            <p className='text-sm flex gap-2'> your cart is empty <Frown /></p>
        ) : (
            <ul className='flex flex-col space-y-4'>
                {items.map((item) => (
                    <li key={item.id} className='flex justify-between items-center border-b pb-2'>
                        <div className='flex flex-col gap-1'>
                            <p className='font-medium'> {item.name} {item.categoryName}</p>
                            <p className='text-sm font-medium tracking-wide'>amount: {item.quantity}</p>
                            <p className='text-sm font-medium text-white'>
                                price of each: {item.price}
                            </p> 
                            <p className='font-bold'>total price: {item.price * item.quantity} ETB</p>
                        </div>
                        <button className='cursor-pointer text-red-500 text-sm' onClick={() => removeItem(item.id)}> <Trash /> </button>
                    </li>
                ))}
                <button className='self-start cursor-pointer border-4 border-red-500 px-4 mb-10 py-1 font-black tracking-wider text-red-500' onClick={clearCart}>clear all</button>
                <h1 className='text-center font-medium text-xl'> total cost: {itemCount} ETB</h1>
                <Link href={'/cart'} className='font-bold self-center px-6 py-2 hover:bg-white hover:text-black transition-colors duration-100 cursor-pointer text-xl border-2 border-white mb-10'>check out</Link>
                <button className='font-bold self-center px-6 py-2 hover:bg-white hover:text-black transition-colors duration-100 cursor-pointer text-xl border-2 border-white mb-10'>order now</button>
                <div className='h-10 w-32 invisible' aria-hidden></div>
            </ul>
        )}
      </div>

    </div>
  )
}

export default CartDrawer
