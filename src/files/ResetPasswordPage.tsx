"use client"
import { cn } from '@/lib/utils';
import { Copy, CopyCheck, Eye, EyeOff } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import z from 'zod';
import { generateSecurePassword } from './generatePassword';

interface ResetPasswordPageProps {
  password?: string;
  passwordConfirm?: string;
}
interface objectProps {
  [key: string]: string | number | string[]
}
const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [resetPassword, setResetPassword] = React.useState<ResetPasswordPageProps>({})
  const [error, setError] = React.useState<objectProps>({})
  const [generatePassword, setGeneratedPassword] = React.useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  const token = useSearchParams().get('token');
  const router = useRouter()
  console.log(`token from url is: ${token}`)


  const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    passwordConfirm: z.string()
  }).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",})

    const handleResetPassword = async () => {
      console.log(`password: ${resetPassword.password} confirmPassword: ${resetPassword.passwordConfirm}`)
      const result = resetPasswordSchema.safeParse(resetPassword)
      try {
        if(result.error){
          setError(result.error.flatten().fieldErrors as objectProps)
        }
        console.log(`password ${result.data?.password} password confirm ${result.data?.passwordConfirm}`)
        if(result.success){
          const res = await fetch('http://localhost:3000/api/resetPassword',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              token: token,
              password: resetPassword.password
            })
          }).then((data) => {
            if(data.ok){
              router.push("/login")
            }
            if(!data.ok){
              alert('error happen send email again on login page')
            }
          })


        }
      } catch (error) {
        
      }
    }
    useEffect(() => {
       setGeneratedPassword(generateSecurePassword())
    },[])
    const copyToClipboard = async () => {
    try {
      // 1. Tell the browser to copy the text
      await navigator.clipboard.writeText(generatePassword);

      // 2. Show 'Copied!' feedback
      setCopied(true);

      // 3. Change it back to 'Copy' after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className='inset-0 flex items-center justify-center mt-10'>
        <div className='bg-black flex gap-10 flex-col items-center justify-center p-6 text-white shadow-[0_10px_500px_20px_rgba(255,255,255,0.6)] rounded-md min-w-96 min-h-96'>
              <div className='text-green-400 gap-10 flex flex-col'>
               <div className='flex flex-col'>
                <p>1 Capital</p>                
                <p>1 small</p>
                <p> 1 special character(^%$#*&@)</p>
                <p>minimum 8 length</p>
              </div>
              <div className='flex text-sm gap-2'>
                <p>password example : {generatePassword}</p>
                {copied ? <CopyCheck/> : <Copy className='cursor-pointer' onClick={copyToClipboard}/>}
              </div>
                
              </div>
            <div className='flex flex-col w-full gap-2 '>  
            <input className='focus:outline-none mb-2 font-bold text-black focus:placeholder:text-transparent rounded-md h-10 placeholder:text-gray-400 placeholder:font-medium pl-2 bg-white' type={showPassword ? "text" : "password"} placeholder='password' onChange = {(e) => {
              setResetPassword({...resetPassword, password: e.target.value})
            }
            } required/>
            <input className='focus:outline-none font-bold text-black focus:placeholder:text-transparent rounded-md h-10 placeholder:text-gray-400 placeholder:font-medium pl-2 bg-white' type={showPassword ? "text" : "password"} placeholder='confirm-password' onChange = {(e) => {
               console.log(`token from url is: ${token} and from useSearchParams is: ${token}`)
              setResetPassword({...resetPassword, passwordConfirm: e.target.value})
            }} required/>
            <button onClick={() => setShowPassword(!showPassword)}>{showPassword ?  (
          <EyeOff className="w-5 h-5 text-white" />
        ) : (
          <Eye className="w-5 h-5 text-white" />
        )}</button>
          </div>
        <button onClick={handleResetPassword} className={cn('rounded-2 border py-2 px-16 cursor-pointer', Object.values(error).length > 0 ? "border-red-500": "border-white")}>submit</button>
        {Object.values(error).length > 0  && <p className='text-red-500'>please check password format</p>}
        </div>
      
    </div>
  )
}

export default ResetPasswordPage
