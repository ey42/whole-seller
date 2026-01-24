"use client"
import { Icons } from '@/Icons/iconica';
import { userProfileProps } from '@/types/types'
import { Search } from 'lucide-react';
import  { ChangeEvent, useEffect, useRef, useState } from 'react'
import UserDetail from './UserDetail';

const MannageUser = ({usersData}: {usersData: userProfileProps[]}) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResult, setSearchResult] = useState<userProfileProps[]>([]);
    const [search, setSearch] = useState<boolean>(false);
    const [userDetail, setUserDetail] = useState<boolean>(false)
    const searchInputRef = useRef<HTMLInputElement | null>(null)
    const resultContainerRef = useRef<HTMLDivElement | null>(null);
    const adminUsers = usersData.filter((user) => user.userRole === 'admin')

    useEffect(() => {
        if(searchTerm === ''){
            setSearchResult([])
        }

        const result = usersData && usersData.filter((data) => {
            const searchLower = searchTerm.toLowerCase();
            if(searchLower === "") return
            return (
                data.name.toLowerCase().includes(searchLower) ||
                data.email.toLowerCase().includes(searchLower) ||
                data.profile.shopName?.toLowerCase().includes(searchLower) ||
                data.profile.TIN?.toLowerCase().includes(searchLower) ||
                data.profile.phoneNumber.toLowerCase().includes(searchLower) ||
                data.profile.subCity.toLowerCase().includes(searchLower)
            )
        });

        setSearchResult(result)
    },[searchTerm, usersData])

    useEffect(() => {

    function handleClickOutside(event: MouseEvent) {
      if (
      searchInputRef.current && !(searchInputRef.current.contains(event.target as Node)) &&
      resultContainerRef.current &&
      !(resultContainerRef.current).contains(event.target as Node)
      ) {
      setSearchTerm('');
      setSearchResult([]);
      setSearch(false);
      }
    }
  

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    
  },[setSearch, searchInputRef, resultContainerRef])
  return (
    <div className='flex px-2 flex-col gap-4 text-white'>
        
        <div onClick={() => {
            setSearch(true)
        }} className='self-center text-white gap-2 items-center flex '>
            <Search className='self-end' onClick={() => searchInputRef.current?.focus()} width={20}/>
            <input ref={searchInputRef} className='border text-sm pl-1 h-9 pt-2 border-white focus:outline-none w-full' type="text" name="search" id="searchId" value={searchTerm} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}/>
        </div>
        {search ? <h1 className='font-semibold flex gap-2 text-sm'><Icons.User width={20} height={20}  fill='white'/> {searchResult.length} search Result</h1>:<h1 className='font-semibold flex gap-2 text-sm'><Icons.User width={20} height={20}  fill='white'/> {usersData.length} users registerd</h1>}
       {!search ? <div className=' grid grid-cols-2 gap-4 max-sm:flex max-sm:flex-col'>
            {
                usersData.map((userData, i) => (
                    <div onClick={() => setUserDetail(true)} className='border-2 rounded-md text-sm font-semibold border-black gap-2 bg-white text-black px-2 py-2 flex flex-col' key={i}>
                        <div className='flex max-sm:flex-col justify-between gap-4'>
                        <h1 className=''>{userData.name}</h1>
                        <h1>{userData.profile.shopName}</h1>
                        </div>
                        <div className='flex justify-between gap-4'>
                        <h1>{userData.email}</h1>
                        <h1 className='text-sm font-semibold'>created at: before {userData.createdAt.getDate()}days</h1>
                        </div>
                        <div className='flex'><UserDetail userData={userData}/></div>
                    </div>
                ))
            }
        </div> : 
        <div className='flex flex-col gap-4 w-full' ref={resultContainerRef}>
          {searchResult.map((result, i) => (
            <div key={i}>
                 <div onClick={() => setUserDetail(true)} className='border-2 rounded-md text-sm font-semibold border-black gap-2 bg-white text-black px-2 py-2 flex flex-col' key={i}>
                        <div className='flex max-sm:flex-col justify-between gap-4'>
                        <h1 className=''>{result.name}</h1>
                        <h1>{result.profile.shopName}</h1>
                        </div>
                        <div className='flex justify-between gap-4'>
                        <h1>{result.email}</h1>
                        <h1 className='text-sm font-semibold'>created at: before {result.createdAt.getDate()}days</h1>
                        </div>
                        <div className='flex'><UserDetail userData={result}/></div>
                    </div>
            </div>
          ))}  
        </div>}
    </div>
  )
}

export default MannageUser
