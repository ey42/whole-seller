'use client'
import { updateUserRole } from '@/db/crud/update'
import { Icons } from '@/Icons/iconica'
import { userProfileProps } from '@/types/types'
import { ArrowUpDown, Check, Edit, ShieldClose } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { useAuthSession } from '@/files/context/AurhContext'

const UserDetail = ({userData}: {userData:userProfileProps}) => {
    const userDataContainerRef = useRef<HTMLDivElement>(null)
    const [open, setIsOpen] = useState<boolean>(false)
    const [openRolePanel, setOpenRolePanel] = useState<boolean>(false)
    const [roleValue, setRoleValue] = useState<"user" | "intermediate" | null>(null)
    const role = ["user", "intermediate"] as const;
    const {user} = useAuthSession()

    const handleRoleUpdate = (id: string, userRole: "user" | "intermediate" | null) => {
        if(!user || !userRole) return
        updateUserRole(id, user?.user.userRole, userRole)
    }

    useEffect(() => {
        function handleClickOutSideUser (e: MouseEvent){
            if(userDataContainerRef.current && !(userDataContainerRef.current.contains(e.target as Node))){
                setIsOpen(false)
            }

        }
        document.addEventListener('mousedown', handleClickOutSideUser)

        return () => {
        document.removeEventListener('mousedown', handleClickOutSideUser)
        }
    }, [open || false])
  return ( 
    <div className='z-20'>
    <div className='cursor-pointer' 
    onClick={() => {
        console.log('clicke inside userDetails')
        setIsOpen(true)}}><Edit width={20}/></div>
    {open &&
    <div className='absolute inset-0 flex items-start pt-5 justify-center backdrop-blur-2xl'>
      <div ref={userDataContainerRef} className='flex font-semibold text-sm p-2 rounded-2xl min-w-1/2 max-sm:w-full bg-white flex-col gap-4'>
        <div className='flex justify-between'>
            <p >{userData.createdAt.toLocaleDateString()}</p>
            <ShieldClose onClick={() => setIsOpen(false)} className='cursor-pointer'/>
        </div>
        <div className='flex flex-col'>
            <h1>personal information</h1>
            <div className='flex max-sm:flex-col justify-evenly items-center border border-black p-4 border-dotted gap-8'>
                <div className='w-10 h-10 rounded-full border border-black'>
                    {!(userData.profile.image) ? <div className='rounded-full bg-gray-400 flex items-center justify-center'>
                        <Icons.User className='w-full'/>
                    </div>:
                    <div className='w-full rounded-full'>
                        <Image className='w-full rounded-full' src={userData.profile.image}  alt='image' width={200} height={200}/>
                    </div>
                    }
                </div>
                <h2 className='self-start'>name: {userData.name}</h2>
                <h2 className='self-start'>email: {userData.email}</h2>
                <div className='flex self-start flex-row justify-center relative items-center gap-6'>
                    <h2>role: {roleValue ? roleValue : userData.userRole}</h2>
                    <ArrowUpDown onClick={() => setOpenRolePanel(true)} width={15} height={15}/>
                    <div className='border border-black cursor-pointer rounded-full bg-green-500' onClick={() => {
                        handleRoleUpdate(userData.id, roleValue)
                    }}>
                        <Check width={15} height={15}/>
                    </div>
                    {openRolePanel && 
                    <ul className='absolute w-full rounded-md border border-black top-5 left-0 text-white bg-black'>
                        {role.map((r, i) => (
                            <li key={i} className='hover:bg-white hover:text-black px-2 cursor-pointer rounded-md w-full' style={{
                                fontSize: "12px"
                            }} onClick={() => {
                                setRoleValue(r)
                                setOpenRolePanel(false)
                            }}>{r}</li>
                        ))}    
                    </ul>}
                </div>
            </div>
        </div>
        <div className='flex flex-col'>
            <h1>address information</h1>
            <div className='flex flex-col border border-black p-4 border-dotted gap-8 max-sm:gap-4'>
                <div className='flex justify-evenly max-sm:flex-col max-sm:justify-start max-sm:items-start items-center max-sm:gap-4 gap-8'>
                    <h2>phoneNumber: {userData.profile.phoneNumber}</h2>
                    <h2>kebele: {userData.profile.kebele}</h2>
                    <h2>woreda: {userData.profile.woreda}</h2>
                </div>
                <div className='flex justify-evenly max-sm:flex-col max-sm:justify-start max-sm:items-start items-center max-sm:gap-4 gap-8'>
                    <h2>shop name: {userData.profile.shopName}</h2>
                    <h2>subcity: {userData.profile.subCity}</h2>
                    <h2>TIN: {userData.profile.TIN}</h2>
                </div>
            </div>
        </div>
      </div>
    </div>}
    </div>
  )
}

export default UserDetail
