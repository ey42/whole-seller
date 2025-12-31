"use client"
import { Icons } from '@/Icons/iconica'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import  { useState } from 'react'
import { SignIn } from './authentication'


const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showforget, setShowForget] = useState(false)
  const [resetEmail, setResetEmail] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleLogin = () => {
    SignIn(email, password).then(({data, error}) => {
      if(error){
        setError(error.message!)
      } 
    })
  }

  const handleForgetPassword = async() => {
    console.log(resetEmail)
    const res = await fetch('http://localhost:3000/api/sendEmail',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({to: resetEmail, subject: 'Password Reset', type: 'Password Reset'}),
    }).then(({}) => {})
    
  
  }

  return (

    <div className='flex flex-col shadow-[0_10px_500px_0px_rgba(255,255,255,0.6)] mt-10 mb-10 text-white items-center justify-between rounded-2xl sm:min-w-96  max-sm:w-full bg-black max-w-full px-10 max-sm:mx-5 mx-10'>
      <div className='flex flex-col  w-full items-center gap-9 justify-center mt-10'>
        <div className='flex justify-center gap-2 '>
          <h1 className='text-4xl font-bold'>Login</h1>
          <div> 
            <Icons.icon width={50} height={50}  className='group-hover:fill-green-500 fill-white transition-colors duration-300'/>  
            </div>
        </div>
        <div className='flex flex-col gap-6 w-full'>
        <h1 className='text-red-500 self-center text-sm'>{error}</h1>
          <input className=' focus:outline-none font-bold rounded focus:placeholder:text-transparent placeholder:text-gray-400 h-10 placeholder:font-medium pl-2 text-black bg-white' type="email" placeholder='email' onChange={(e) => setEmail(e.target.value)}/>
          <div className='flex flex-col gap-2 w-full'>  
            <input className='focus:outline-none font-bold text-black focus:placeholder:text-transparent rounded h-10 placeholder:text-gray-400 placeholder:font-medium pl-2 bg-white' type={showPassword ? "text" : "password"} placeholder='password' onChange = {(e) => setPassword(e.target.value)}/>
            <button onClick={() => setShowPassword(!showPassword)}>{showPassword ?  (
          <EyeOff className="w-5 h-5 text-white" />
        ) : (
          <Eye className="w-5 h-5 text-white" />
        )}</button>
          </div>
        
        </div>
        <div className='flex items-center w-full justify-center flex-col gap-10'>
          <div onClick={handleLogin} className='flex items-center justify-center border z-10 hover:border-green-600 transition-colors duration-300 relative max-w-full min-w-1/2 px-8 group py-1 cursor-pointer rounded gap-3 overflow-hidden'>
            <span
            className="
            pointer-events-none
            absolute inset-0
            rounded
            border-2 border-green-600
            -translate-x-full
            transition-transform duration-300 ease-in-out
            group-hover:translate-x-full
          "
          />
            {/* <h1 className='text-white text-xl font-bold'>Login</h1> */}
            <span className='z-10 relative inline-flex text-white text-xl font-bold'>
              {"LOGIN".split("").map((char, i) => (
                <span 
                key={i}
                style={{ transitionDelay: `${i * 40}ms`}}
                className="whitespace-pre transition-colors duration-300 group-hover:text-green-600">
                  {char}
                </span>
              ))}
            </span>
            {/* <div> 
            <Icons.icon width={25} height={25}  className='group-hover:fill-green-500 fill-white transition-colors duration-300'/>  
            </div> */}
          </div>
          <div>
            <h1 className='underline cursor-default select-none' onClick={() => setShowForget(!showforget)}>forget password</h1>
          </div>
          {showforget && <div className='flex gap-4 flex-col'>
            <p className='w-56 tracking-widest font-thin text-green-500' style={{
              fontSize: "12px"
            }}>please insert your email address and verify and click it on your email provider(gmail) to put your new password</p>
            <input className=' focus:outline-none font-bold rounded focus:placeholder:text-transparent placeholder:text-gray-400 h-10 placeholder:font-medium pl-2 text-black bg-white' onChange={(e) => setResetEmail(e.target.value)} type="email" placeholder='enter your email'/> 
            <button className='border cursor-pointer border-white px-6 py-1 group relative transition-colors duration-300 hover:border-green-500 overflow-hidden' onClick={handleForgetPassword}>
              <span
              className='absolute w-full inset-0 pointer-events-none border border-green-500 -translate-x-full transition-transform group-hover:translate-x-full duration-300'/>
              <span className='z-10 relative inline-flex text-white '>
              {"send to email".split("").map((char, i) => (
                <span 
                key={i}
                style={{ transitionDelay: `${i * 40}ms`}}
                className="whitespace-pre transition-colors duration-300 group-hover:text-green-600">
                  {char}
                </span>
              ))}
            </span>
            </button>
          </div>}
         
        </div>
      </div>
      <Link href={'/sign-up'} className='flex hover:underline underline-offset-4 items-center mb-4 mt-32 justify-center'>
        <h2 className='text-lg'>create new account</h2>
        <Icons.rightArrow className='mt-1' width={20} height={20} fill='white'/>
      </Link>
    </div>
    
  )
}

export default Login
