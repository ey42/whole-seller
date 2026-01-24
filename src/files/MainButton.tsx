"use client"
import { Icons } from '@/Icons/iconica'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { ListOrdered } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthSession } from './context/AurhContext'


const MainButton =  () => {
    const pathname = usePathname()
    const router = useRouter()
    // const [user, setUser] = useState<string|null>(null)
    const {user, setUser} = useAuthSession()


  return (
    <div className={cn('flex w-full rounded self-center max-w-lg bg-black h-16 text-black items-center justify-center flex-row', pathname.startsWith('/admin') ? 'hidden' : '' )}>
        <motion.div whileTap={{scale: 0.8}} className='w-full border-r-2 h-full items-center bg-white border-black  flex'>
            {pathname !== '/orders' ? <Link className='w-full h-full flex items-center' href={user ? '#' : '/login' }><ListOrdered className='w-full' width={30} height={30} fill='black'/></Link> : <Link className='w-full h-full flex items-center' href='/'><Icons.Home className='w-full' width={30} height={30} fill='black'/></Link>}
        </motion.div>
        <motion.div whileTap={{scale: 0.8}} className='w-full border-r-2 h-full items-center bg-white border-black flex'>
            {pathname === '/' ? <Link className='w-full h-full flex items-center' href={user ? "#" : "/login"}><Icons.notification className='w-full' width={30} height={30} fill='black' /></Link> : <Link className='w-full h-full flex items-center' href= "/"><Icons.Home className='w-full' width={30} height={30} fill='black' /></Link>}
        </motion.div>
        <motion.div whileTap={{scale: 0.8}} className='w-full border-r-2 h-full items-center bg-white border-black flex'>
            <Link className='w-full h-full flex items-center' href={user ? '/cart' : '/login'}><Icons.cart className='w-full' width={30} height={30} fill='black' /></Link>
        </motion.div>
        <motion.div whileTap={{scale: 0.8}} className='w-full h-full items-center  bg-white flex '>
            <Link className='w-full h-full flex items-center' href={user ? '#' : '/login'}><Icons.message className='w-full' width={30} height={30} fill='black' /></Link>
        </motion.div>
    </div>
  )
}

export default MainButton
