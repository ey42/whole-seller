"use client"
import React, { ChangeEvent, useState } from 'react'

const SendToEmail = () => {
    const [email, setEmail] = useState<string>('')
    const [body, setBody] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [data, setData] = useState<string>('')

    const handleSubmit = async() => {
            const res = await fetch('http://localhost:3000/api/sendEmail',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({to: 'beki4253@gmail.com', subject: 'contact issue', type: 'contact', body, email}),
            })
            const result = await res.json()

            if(!res.ok){
                setError(result.message)
                return
            }
            setData(result.message)
            setError("")

            }

  return (
    <div className=' flex-col flex gap-4'>
        <div className='flex flex-col gap-1'>
            <label className='text-sm' htmlFor="email">type your email address</label>
            <input className='text-black text-sm pl-1 pt-2 pb-1 focus:outline-none font-semibold bg-white w-1/2 max-sm:w-full' id='email'  type="email" onChange={(e: ChangeEvent<HTMLInputElement>) => {setEmail(e.target.value)}} required value={email}/>
        </div>
        <div className='flex flex-col gap-1'>
            <label className='text-sm' htmlFor="body">ask your issue</label>
            <textarea className='text-black text-sm pl-1 pt-2 pb-1 focus:outline-none font-semibold bg-white w-1/2 max-sm:w-full' id='body' onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {setBody(e.target.value)}} required value={body}/>
        </div>

        <button className='bg-white w-32 text-black font-semibold rounded mt-5 text-lg cursor-pointer' onClick={handleSubmit} type='submit'> submit </button>
        {error && <p className='text-sm text-red-700'>{error}</p>}
        {data && <p className='text-green-700 text-sm'>{data}</p>}
        
    </div>
  )
}

export default SendToEmail
