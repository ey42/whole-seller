"use client"
import { Icons } from '@/Icons/iconica'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCart } from './context/CartContext'
import { useEffect, useState } from 'react'
import {motion} from 'motion/react'
import { LogIn, LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { SignOut } from './Authentication/authentication'




const Header = () => {
  const [user, setUser] = useState<string | null>(null)
  const router = useRouter()

  const pathname = usePathname()
  const {toggleCart, closeCart, isOpen} = useCart()
  useEffect(() => {
  authClient.getSession().then((session) => {
  if(session?.data?.user){
    setUser(session.data.user.email)
  } else {
    setUser(null)
  }})
}, [])


  
  return (
    <div className=' relative border-b-2 w-full backdrop-blur-3xl backdrop-contrast-200 border-white text-white max-sm:border-white flex justify-between'
    style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='3' height='3' fill='none' stroke='white'%3e%3cpath d='M0 .5H31.5V32'/%3e%3cpath d='M15 16v2M16 17h-2' stroke-width='2'/%3e%3c/svg%3e")`,
        }}> 
    <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,black_100%)] pointer-events-none"></div>
    <div className=' z-10 max-sm:hidden ml-14 flex'>
      <Link href={'/'} className=''>
        <Icons.icon width={50} height={50} fill='white'/>
      </Link>
    </div>
    <div className='flex h-full overflow-hidden max-sm:hidden absolute right-0  font-medium'>
      <div className='flex items-center justify-center'>

        <motion.div whileTap={{scale: 0.8}} className='cursor-pointer group relative justify-center border-r-2 border-black items-center w-24 bg-white hover:bg-[#dddddd] h-full' onClick={ user ? toggleCart : () => {console.log('hy')}}>
          <Link href={user ? "#" : "/login"}> 
            <Icons.cart width={25} height={25} fill='black' className='transition-all left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute duration-300'/>
          </Link>

          <span className="absolute bottom-0 left-0 h-1 w-full bg-black scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"/>
        </motion.div>
     
        <motion.div whileTap={{scale: 0.8}} 
        className='cursor-pointer flex items-center relative group justify-center w-24 border-r-2 border-black hover:bg-[#dddddd] bg-white h-full'>
          
          <Link href={user ? '#' : '/login'} >
            <Icons.User className='transition-all left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute duration-300'  width={25} height={25} fill='black'/>
          </Link>

          <span className="absolute bottom-0 left-0 h-1 w-full bg-black scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"/>

        </motion.div>

        <motion.div whileTap={{scale: 0.8}} 
        className='cursor-pointer hover:bg-[#dddddd] relative group flex items-center justify-center w-24 border-r-2 border-black bg-white h-full'>
          
          <Link href={user ? '#' : '/login'}>
            <Icons.message className='transition-all left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute duration-300' width={25} height={25} fill='black'/>
          </Link>

          <span className="absolute bottom-0 left-0 h-1 w-full bg-black scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"/>
        
        </motion.div>
      </div>
      {pathname !== "/login" ?  user === null 
      ? 
      (<motion.div whileTap={{scale: 0.8}} 
      className='cursor-pointer flex relative group hover:bg-[#dddddd] items-center justify-center w-24 border-r-2 border-black bg-white h-full'>
        
        <Link href={'/login'}>{/* this is link */}

          <button onClick={() => console.log("hy eyueal")} className='transition-all left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute duration-300 px-3 cursor-pointer font-bold flex text-black py-0.75'>
            login
            <LogIn />
          </button>

        </Link>

        <span className="absolute bottom-0 left-0 h-1 w-full bg-black scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"/>

      </motion.div>) : 
      (<motion.div whileTap={{scale: 0.8}} 
      className='cursor-pointer flex relative group hover:bg-[#dddddd] items-center justify-center w-24 border-r-2 border-black bg-white h-full'>
        <button onClick={() => {
        console.log("signing out")
        SignOut()
        setUser(null)
        router.refresh()
        router}} 
        className='px-3 cursor-pointer font-bold flex gap-2 transition-all left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute duration-300 text-black py-0.75'>
        logout 
        <LogOut />
        </button>

        <span className="absolute bottom-0 left-0 h-1 w-full bg-black scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"/>

      </motion.div>) : 
      <motion.div whileTap={{scale: 0.8}} 
      className='cursor-pointer hover:bg-[#dddddd] relative group flex items-center justify-center w-24 border-r-2 border-black bg-white h-full'>
        <Link href={'/'} className='transition-all left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute duration-300'> 
          <Icons.Home width={25} height={25} fill='black' />
        </Link>
      
      <span className="absolute bottom-0 left-0 h-1 w-full bg-black scale-x-0 origin-left transition-transform duration-300 ease-in-out group-hover:scale-x-100"/>
      </motion.div>}
    </div>
    {/* this is for mobile device */}
    <div className='flex z-10 w-full sm:hidden justify-between'>
      <div className='group relative flex items-center'>{/* this is link */}
        {pathname !== "/login" && pathname !== "/sign-up"  ? <Icons.userError width={25} height={25} fill='white'/> : <Link href={'/'}>  <Icons.Home width={25} height={25} fill='white'/> </Link>}   
      </div>
      <div>
        <Icons.notification width={25} height={25} fill='white'/>
      </div>
    </div>
    </div>
  )
}

export default Header
