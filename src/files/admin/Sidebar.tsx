'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { useSidebar } from '../context/SidebarContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
    const {isOpen, closeOpen} = useSidebar()
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const pathname = usePathname()


    useEffect(() => {
        
        setIsMobile(window.innerWidth >= 640);
    
        const handleResize = () => {
          setIsMobile(window.innerWidth >= 640)
        };
    
        window.addEventListener('resize', handleResize)
    
        return () => window.removeEventListener('resize', handleResize)
      },[])
  return (
    <div className={cn('flex max-sm:fixed flex-col w-64 z-50 overflow-y-auto items-center origin-left duration-300 h-screen transition-transform bg-white border-b-2 text-black font-semibold border-white', !isMobile  && {
      'translate-x-0': isOpen,
      '-translate-x-full': !isOpen,
    })}>
        <h1 className='font-mono self-center text-center font-bold text-lg mb-5 mt-15'>welcome to admin dashboard</h1>
      <Link href='/admin/users' className={cn('pb-5 px-2 border-b-2 box-border relative group bg-white hover:bg-[#dddddd] transition-all duration-300 w-full',{
          'bg-[#dddddd]': pathname.startsWith('/admin/users')
      })} replace>
        <span className={cn("absolute bottom-0 h-1 w-full bg-black scale-x-10 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100",{
          'scale-x-100': pathname.startsWith('/admin/users')
        })}/>
        users</Link>
      <Link href="/admin/products"  className={cn('pb-5 px-2 border-b-2 box-border relative group bg-white hover:bg-[#dddddd] transition-all duration-300 w-full',{
          'bg-[#dddddd]': pathname.startsWith('/admin/products')
      })} replace>
        <span className={cn("absolute bottom-0 h-1 w-full bg-black scale-x-10 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100",{
          'scale-x-100': pathname.startsWith('/admin/products')
        })}/>
        products</Link>
      <Link href='/admin/product-catagory'  className={cn('pb-5 px-2 border-b-2 box-border relative group bg-white hover:bg-[#dddddd] transition-all duration-300 w-full',{
          'bg-[#dddddd]': pathname.startsWith('/admin/product-catagory')
      })} replace>
        <span className={cn("absolute bottom-0 h-1 w-full bg-black scale-x-10 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100",{
          'scale-x-100': pathname.startsWith('/admin/product-catagory')
        })}/>
        product-catagory</Link>
      <Link href='/admin/message'  className={cn('pb-5 px-2 border-b-2 box-border relative group bg-white hover:bg-[#dddddd] transition-all duration-300 w-full',{
          'bg-[#dddddd]': pathname.startsWith('/admin/message')
      })} replace>
        <span className={cn("absolute bottom-0 h-1 w-full bg-black scale-x-10 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100",{
          'scale-x-100': pathname.startsWith('/admin/message')
        })}/>
        message</Link>
      <Link href='/admin/notification'  className={cn('pb-5 px-2 border-b-2 box-border relative group bg-white hover:bg-[#dddddd] transition-all duration-300 w-full',{
          'bg-[#dddddd]': pathname.startsWith('/admin/notification')
      })} replace>
        <span className={cn("absolute bottom-0 h-1 w-full bg-black scale-x-10 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100",{
          'scale-x-100': pathname.startsWith('/admin/notification')
        })}/>
        notification</Link>
    </div>
  )
}

export default Sidebar
