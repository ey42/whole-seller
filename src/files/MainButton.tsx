"use client"
import { Icons } from '@/Icons/iconica'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { user } from './fakedatabase'
// import React from 'react'


const MainButton =  () => {
    const pathname = usePathname()
    const router = useRouter()

  return (
    user ? (
    <div className='flex w-full rounded-lg self-center bg-black h-16 text-white items-center justify-center p-4 gap-14 flex-row'>
        <div className='w-full'>
            <Icons.phone className='w-full' width={30} height={30} fill='white' />
        </div>
        <div className='w-full'>
            <Icons.Home onClick={() => router.push('/')} className='w-full' width={30} height={30} fill='white' />
        </div>
        <div className='w-full' onClick={() => router.push('/cart')}>
            <Icons.cart className='w-full' width={30} height={30} fill='white' />
        </div>
        <div className='w-full'>
            <Icons.message className='w-full' width={30} height={30} fill='white' />
        </div>
    </div>
    ) : (
    <Link href={'/login'} className={cn('flex w-full rounded-2xl self-center bg-black h-16 text-white items-center justify-center p-4 gap-4 flex-row',{
        "hidden": pathname === "/login" || pathname === "/sign-up"
    }
    )}>
       <div><h1 className='text-3xl font-bold'>Login</h1></div>
       <div> <Image src={'/better-auth-logo.svg'} alt='logo' width={40} height={40}/>  </div>
    </Link>
    )
  )
}

export default MainButton
