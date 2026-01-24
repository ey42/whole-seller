"use client"
import { Icons } from '@/Icons/iconica'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useAuthSession } from './context/AurhContext'
import { GetProfile } from '@/db/crud/select'
import { userProfileProps } from '@/types/types'
import { usePathname } from 'next/navigation'

const Footer = () => {
  const {user} = useAuthSession()
  const [profile, setProfile] = useState<userProfileProps | null>(null)
  const pathname = usePathname()
  useEffect(() => {
    if(user){
      console.log(user.user.email)
      GetProfile(user.id).then((data) => {
        if (data){
          setProfile(data)
          return
        } else {
          setProfile(null)
        }
      })
    }else{

      console.log('not user on footer')
    }
  }, [])
  return (
    <div className='relative inset-0 flex flex-col justify-center items-center pb-2 border-t-[1.5px] text-white bg-black border-white pt-2 break-all w-full max-sm:px-4 px-2 max-sm:gap-5'
    style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='3' height='3' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3cpath d='M15 16v2M16 17h-2' stroke-width='2'/%3e%3c/svg%3e")`,
        }}>
    <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_10%,black_100%)] pointer-events-none"></div>
    <div className='flex justify-between max-sm:flex-col max-sm:gap-6 w-full px-2'>
      <div className='flex max-sm:self-start flex-col max-sm:flex-row justify-evenly max-sm:justify-center gap-10 max-sm:gap-4 z-10 items-center'>
        <div>
          <h1 className='font-bold'>follow us</h1>
        </div>
        <div className='flex gap-2'>
          <Icons.facebook width={20} height={20} className='hover:fill-blue-500 fill-[#828282] duration-200 transition-colors'/>
          <Icons.linkedin width={20} height={20} className='hover:fill-blue-700 fill-[#828282] duration-200 transition-colors'/>
          <Icons.youtube width={20} height={20} className='hover:fill-red-600 fill-[#828282] duration-200 transition-colors'/>
          <Icons.instagram width={20} height={20} className='hover:fill-amber-500 fill-[#828282] duration-200 transition-colors'/>
        </div>
      </div>
      <div className='flex max-sm:grid max-sm:grid-cols-2 max-sm:gap-y-10 max-sm:w-full z-10 gap-20 mr-4'>
      <Link href={'/about/company'} className='flex flex-col max-sm:order-2 max gap-4' replace>
        <div className='font-medium'>company</div>
        <h1 className='font font-medium text-sm text-[#454545]'>Eyob Taffa</h1>
        <h1 className='font font-medium text-sm text-[#454545]'>About us</h1>
        <h1 className='font font-medium text-sm text-[#454545]'>Our team</h1>
      </Link>
      <Link href={'/about/our-service'} className='flex flex-col z-10 gap-4' replace>
        <div>
        <h1 className='font-medium'>Our service</h1></div>
        <h1 className='font-medium text-sm text-[#454545]'>wholesale distribution</h1>
        <h1 className='font-medium text-sm text-[#454545]'>Logistics and supply chain</h1>
        <h1 className='font-medium text-sm text-[#454545]'>market access</h1>
      </Link>
      <Link href={'/about/contact-us'} className='flex flex-col z-10 max-sm:order-1 gap-4' replace>
        <div > <h1 className='font-medium '>Contact us</h1></div>
        <div className='text-sm text-[#454545]'>
          <h1 className='font-medium'>address:</h1>
          <address>T/haymanot, merkato</address>
        </div>
        <div className='text-sm text-[#454545]'>
          <h1 className='font-medium'>call:</h1>
          <address>0967283176</address>
        </div>
        <div className='text-sm text-[#454545]'>
          <h1 className='font-medium'>email:</h1>
          <address>eyobtaffa@gmail.com</address>
        </div>
      </Link>
      </div>
      </div>
      {user && (user.user.userRole === "admin" || user.user.userRole === "intermediate") && <motion.button whileTap={{
        scale: 0.8
      }} className='w-auto px-6 py-1 rounded z-10 mb-2 h-auto border text-[#454545] cursor-pointer border-[#454545]'><Link href={pathname.includes('/admin') ? '/': '/admin'} className='inset-0'>{pathname.includes('/admin')? "client":"admin"}</Link></motion.button>}
      <div className='z-10 text-sm text-[#454545]'>Copyright &copy;2026 All rights reserved! {profile?.profile.id}</div>
    </div>
  )
}

export default Footer
