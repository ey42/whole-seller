"use client"
import { cn } from '@/lib/utils';
import { ArrowLeftToLine, Copy, CopyCheck, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '@/Icons/iconica';
import {z} from 'zod';
import SubCityForm from '../subCityForm';
import { options } from '../fakedatabase';
import { useRouter } from 'next/navigation';
import { SignUp } from './authentication';
import { uploadToProfile } from '@/lib/supabase/storage/uploadToStorage';
import { insertToProfileTable } from '@/db/crud/insert';
import { generateSecurePassword } from '../generatePassword';

interface objectProps {
  [key: string]: string | number | string[]
}

export interface formDataProps {
  fullName: string,
  image: File | null ,
  email: string,
  phoneNumber: string,
  password1: string,
  password2: string,
  shopName: string,
  subCity: string,
  woreda: string,
  kebele: string,
  tinNumber: string
}

const SignUpComponent = () => {
  // const [selectedImage, setSelectedImage] = useState<File | null> (null)
  const [showPassword, setShowPassword] = React.useState(false)     
  const [step, setStep] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null> (null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const submitRef = useRef<HTMLButtonElement | null>(null)
  const [error, setError] = useState<objectProps | undefined>(undefined)
  const [formData, setFormData] = useState<formDataProps>({
    fullName: "",
    image: null,
    email: "",
    phoneNumber: "",
    password1: "",
    password2: "",
    shopName: "",
    subCity: "",
    woreda: "",
    kebele: "",
    tinNumber: ""
  })
  const [generatePassword, setGeneratedPassword] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)
  const router = useRouter();
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

  const RegistrationSchema = z.object({
    fullName: z.string().min(2, "Full name is required"),
    // image: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {message: "File size must be less than 5MB",}).refine(
    // (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp",null].includes(file.type),
    // "Only .jpg, .jpeg, .png and .webp formats are supported.").optional(),
    email: z.email("Invalid email address"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Must be a valid 10-digit number"),
    password1: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    password2: z.string(),
    shopName: z.string().min(2, "Shop name is required"),
    subCity: z.string().min(2, 'subcity required field'),
    woreda: z.string().min(1, "Woreda is required"),
    kebele: z.string(),
    tinNumber: z.string()
  })
  // .refine((data) => data.password1 === data.password2, {
  //   message: "Passwords do not match",
  //   path: ["password2"], // This attaches the error to password2 specifically
  // });

  function validEachFrom(): boolean {
    if(step === 0){
      const personalDetailsSchema = RegistrationSchema.pick({
        'fullName': true,
        'email': true,
        'phoneNumber': true,
        'password1': true,
        'password2': true
      })
      .refine((data) => data.password1 === data.password2, {
        message: "Passwords do not match",
        path: ["password2"],
      }); 
      const result = personalDetailsSchema.safeParse(formData);

      if (result.error) {
        console.log(`error ${result.error.flatten().fieldErrors}`);
        setError(result.error.flatten().fieldErrors)
        return false
      } else {
        return true
      }
    } else if (step === 1){
      const locationInfoSchema = RegistrationSchema.pick({
        'shopName': true,
        'subCity': true,
        'woreda': true,
        'kebele': true,
        'tinNumber': true
      });
      const result = locationInfoSchema.safeParse(formData);
      if (result.error) {
        console.log(`error ${result.error.flatten().fieldErrors}`);
        setError(result.error.flatten().fieldErrors)
        return false
      } else {
        return true
      }
  } else if (step === 2){
    // You can add additional validation for step 2 if needed
    if(validateForm() === true){
      return true;
    } else{
      return false;
    }
  }
  return false;
}

  function validateForm ():boolean {
    console.log(`form data ${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join(", ")}`);
    const result = RegistrationSchema.safeParse(formData);
    if (result.error) {
      console.log(`error ${result.error.flatten().fieldErrors}`);
      setError(result.error.flatten().fieldErrors)
      return false
    } else {
      return true
      // Proceed with form submission (e.g., send data to server)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const totalSteps = 3;

  const nextStep = () => {
    if(validEachFrom() === true){
     setStep((prev) =>  Math.min(prev + 1, totalSteps - 1))
     setError(undefined)
    console.log(step);
  }
    };


  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = RegistrationSchema.safeParse(formData);
    if (!result.success) {
      console.log(result.error.format());
    } else {
      console.log("Form data is valid:", result.data);
      // Proceed with form submission (e.g., send data to server)
      SignUp(formData).then(async({data, error}) => {
        if (error) {
          alert("Error during sign up: " + error.message) ;
        } else if(data){
          if(formData.image !== null){
          const {datas: datas,error} = await uploadToProfile(formData.image!)
          
            if(!datas || error){
              insertToProfileTable({...formData, image: null, userId: data.user.id})
              alert(`there is error on uploading profile image: ${error?.message}`)
              router.push('/login')
            }else if(datas !== null){
              insertToProfileTable({...formData ,userId: data.user.id, image: datas.fullPath})
              router.push('/')
            }
          }else {
            insertToProfileTable({...formData, image: null, userId: data.user.id})
            router.push('/')
          }
        } else {
          console.log("Unexpected response from sign up");
        }
    })
  }
    
  }

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
  const file = event.target.files?.[0];
  
  if (file) {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Please select an image smaller than 5MB');
      return;
    }    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  
    setFormData((prevData) => ({
      ...prevData,
      image: file
    }));


    

  }
};
  return (
    <div className='bg-black max-sm:rounded-t-none min-w-96 rounded-2xl max-sm:w-full text-white max-sm:mx-5 max-w-full flex flex-col mb-10 justify-center px-5 py-10 gap-5 max-sm:gap-10  items-center mt-10 max-sm:min-w-full'>
      <div className='flex flex-col items-center justify-center gap-10'>
        <AnimatePresence mode='wait'>
            <motion.div
            key={step}
            initial={{x: 50, opacity: 0}}
            animate={{x: 0, opacity: 1}}
            exit={{x: -50, opacity: 0}}
            transition={{duration: 0.3}}
            className='flex flex-col gap-4'>
              {step === 0 && (
                  <h2 className='font-bold text-white text-2xl'>Personal Details💍</h2>
                )}
                {step === 1 && (
                  <h2 className='font-bold text-2xl text-white'>Location Information</h2>
                )}
                { step === 2 && (
                  <h2 className='font-bold text-2xl text-white'>Success!✌</h2>
                )}
            </motion.div>
          </AnimatePresence>
      
        <div className='flex items-center gap-4 mb-10'>
          {[...Array(totalSteps)].map((_, index) => (
            <React.Fragment key={index}>
              <motion.div
              initial={false}
              animate = {{backgroundColor: index <= step ? "#22c552": "#3f3f46",
                scale: index === step ? 1.2 : 1
              }}
              className= "w-4 h-4 rounded-full"
              />

              {index < totalSteps - 1 && (
                <div className='w-12 h-1 bg-white relative'>
                  <motion.div
                  className='absolute inset-0 bg-green-500 origin-left'
                  initial={{scaleX: 0}}
                  animate={{scaleX: index < step ? 1 : 0}}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* 2. The Form Container */}

      <form className='relative w-full max-w-md flex flex-col gap-6 rounded-2xl py-8 px-4 ' onSubmit={handleSubmit}>
        <AnimatePresence mode='wait'>
          <motion.div
          key={step}
          initial={{x: 50, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          exit={{x: -20, opacity: 0}}
          transition={{duration: 0.5}}
          className='flex flex-col gap-4'>
            {
              step === 0 && (
                <div className='flex flex-col gap-4'>
                
                  <div className='flex max-w-full justify-center items-center  max-sm:gap-10'>
                    <div className='w-24 h-24 rounded-4xl border-2 overflow-hidden z-20 border-white'>
                      {imagePreview && <Image className={cn('w-full h-full ',{
                        'hidden': imagePreview === null
                    })} src={imagePreview} alt='image' width={200} height={200}/>}
                  
                  </div>
                        <div className=' text-black self-end mb-1 cursor-pointer  font-bold px-3 py-1 ' onClick={() => fileInputRef.current?.click()}>
                          <input className=' hidden' type="file" name="signUpImage" accept='image/*' onChange={handleImageSelect} ref={fileInputRef}/>
                          <Icons.Plus width={20} height={20} fill='white'/>
                        </div>
                </div>
                  <div className='flex flex-col'>                  
                    <label htmlFor="fullName" style={{fontSize: 12}} className='text-white tracking-wider'>
                      full name
                    </label>
                    <input onChange={handleChange} className={cn('bg-white text-black font-medium text-sm placeholder:text-sm px-2 py-1 focus:outline-none focus:placeholder:text-white rounded-[2]',{
                      'border-red-500 border': error && error['fullName']
                    })} name='fullName' placeholder='full name' value={formData.fullName} type='text' id='fullName'/>
                    {error && error['fullName'] && <span className='text-red-500 text-sm'>{error['fullName']}✍</span>}
                  </div>
                  <div className='flex flex-col'>                  
                    <label htmlFor="email" style={{fontSize: 12}} className='text-white tracking-wider'>email</label>
                    <input onChange={handleChange} className={cn('bg-white text-black font-medium text-sm placeholder:text-sm px-2 py-1 focus:outline-none focus:placeholder:text-white rounded-[2]',{
                      'border-red-500 border': error && error['email']
                    })} name='email' value={formData.email} placeholder='email' type='email' id='email'/>
                    {error && error['email'] && <span className='text-red-500 text-sm'>{error['email']}✍</span>}
                  </div>
                  <div className='flex flex-col'>                  
                    <label htmlFor="phoneNumber" style={{fontSize: 12}} className='text-white tracking-wider'>phone number</label>
                    <input onChange={handleChange} className={cn('bg-white text-black font-medium text-sm placeholder:text-sm px-2 py-1 focus:outline-none focus:placeholder:text-white rounded-[2]',{
                      'border-red-500 border': error && error['phoneNumber']
                    })} value={formData.phoneNumber} name='phoneNumber' placeholder='phone number' type='tel' id='phoneNumber'/>
                    {error && error['phoneNumber'] && <span className='text-red-500 text-sm'>{error['phoneNumber']}✍</span>}
                  </div>

                <div className='flex flex-col gap-2'>
                  <div className='flex flex-col'>   
                    <div className='text-green-400 gap-10 flex' style={{fontSize: 12}}>
                    <p>password example : {generatePassword}</p>
                    {copied ? <CopyCheck width={20} height={20}/> : <Copy width={20} height={20} className='cursor-pointer' onClick={copyToClipboard}/>}
                  </div>               
                    <label htmlFor="password1" style={{fontSize: 12}} className='text-white tracking-wider'>password</label>
                    <input onChange={handleChange} className={cn('bg-white text-black font-medium text-sm placeholder:text-sm px-2 py-1 focus:outline-none focus:placeholder:text-white rounded-[2]',{
                      'border-red-500 border': error && error['password1']
                    })} value={formData.password1} name='password1' placeholder='password' type={!showPassword ? 'password' : 'text'} id='password1'/>
                    {error && error['password1'] && <span className='text-red-500 text-sm'>{error['password1']}✍</span>}
                  </div>
                  <div className='flex flex-col'>                  
                    <label htmlFor="password2" style={{fontSize: 12}} className='text-white tracking-wider font-extralight'>confirm password</label>
                    <input onChange={handleChange} value={formData.password2} className={cn('bg-white text-black font-medium text-sm placeholder:text-sm px-2 py-1 focus:outline-none focus:placeholder:text-white rounded-[2]',{
                      'border-red-500 border': error && error['password2']
                    })} name='password2' placeholder='password' type={!showPassword ? 'password' : 'text'} id='password2'/>
                    {error && error['password2']  && <span className='text-red-500 text-sm'>{error['password2']}✍</span>}
                    <button onClick={() => setShowPassword(!showPassword)}>{showPassword ?  (
          <EyeOff className="w-5 h-5 text-white" />
        ) : (
          <Eye className="w-5 h-5 text-white" />
        )}</button>
                  </div>
                </div>

                </div>
              )
            }
            {step === 1 && (
            <div className='text-white flex flex-col gap-4'>
                <div className='flex flex-col'>                  
                <label htmlFor="shopName" style={{fontSize: 12}} className='text-white tracking-wider'>
                  shop name
                </label>
                <input onChange={handleChange} className={cn('bg-white text-black font-medium text-sm placeholder:text-sm px-2 py-1 focus:outline-none focus:placeholder:text-white rounded-[2]',{
                      'border-red-500 border': error && error['shopName']
                    })} name='shopName' placeholder='abc shoping center' value={formData.shopName} type='text' id='shopName'/>
                    {error && error['shopName'] && <span className='text-red-500 text-sm'>{error['shopName']}✍</span>}
                </div>
                <div className='flex flex-col'>                  
                <SubCityForm label='sub city' options={options} onChange={(val) => setFormData({...formData, subCity: val})} value={formData?.subCity}/>
                  {error && error['subCity'] && <span className='text-red-500 text-sm'>{error['subCity']}✍</span>}
                </div>
                <div className='flex flex-col'>                  
                <label htmlFor="woreda" style={{fontSize: 12}} className='text-white tracking-wider'>
                  woreda
                </label>
                <input onChange={handleChange} className={cn('bg-white text-black font-medium text-sm placeholder:text-sm px-2 py-1 focus:outline-none focus:placeholder:text-white rounded-[2]',{
                      'border-red-500 border': error && error['woreda']
                    })} name='woreda' placeholder='05' value={formData.woreda} type='text' id='woreda'/>
                    {error && error['woreda'] && <span className='text-red-500 text-sm'>{error['woreda']}✍</span>}
                </div>
                <div className='flex flex-col'>                  
                <label htmlFor="kebele" style={{fontSize: 12}} className='text-white tracking-wider'>
                  kebele
                </label>
                <input onChange={handleChange} className={cn('bg-white text-black font-medium text-sm placeholder:text-sm px-2 py-1 focus:outline-none focus:placeholder:text-white rounded-[2]',{
                      'border-red-500 border': error && error['kebele']
                    })} name='kebele' placeholder='41' value={formData.kebele} type='text' id='kebele'/>
                    {error && error['kebele'] && <span className='text-red-500 text-sm'>{error['kebele']}✍</span>}
                </div>
                <div className='flex flex-col'>                  
                <label htmlFor="tinNumber" style={{fontSize: 12}} className='text-white tracking-wider'>
                  TIN number
                </label>
                <input onChange={handleChange} className={cn('bg-white text-black font-medium text-sm placeholder:text-sm px-2 py-1 focus:outline-none focus:placeholder:text-white rounded-[2]',{
                      'border-red-500 border': error && error['tinNumber']
                    })} name='tinNumber' placeholder='TIN' value={formData.tinNumber} type='text' id='tinNumber'/>
                    {error && error['tinNumber'] && <span className='text-red-500 text-sm'>{error['tinNumber']}✍</span>}
                </div>
            </div>
            ) } {step === 2 && (
              <div className='text-xl flex items-center justify-center gap-5 flex-col' >
                <h1 className='text-4xl'>congratulations✨</h1>
                <p className='text-center w-full'>You have successfully completed the sign-up process. Click finish to create your account and start using our services!</p>    
                
                <div className='flex text-white w-full justify-between'>
                <button ref={submitRef} type= 'submit' className={cn('border px-6 hidden py-1 font-bold rounded self-center text-center cursor-pointer', step === totalSteps - 1 ? 'bg-green-500 text-black' : 'bg-white text-black')} disabled = {step !== totalSteps - 1}>
                  finish
                </button>
                </div>
              </div>
              
            )}
          </motion.div>
        </AnimatePresence>


      </form>
        <div className='flex text-white w-full justify-between'>
          <button type='button' className='border px-6 py-1 rounded self-center text-center cursor-pointer' onClick={prevStep}>
            prev        
          </button>
          {step < totalSteps - 1 ? <button type={step === totalSteps - 1 ? 'submit' : 'button'} className={cn('border px-6 py-1 font-bold rounded self-center text-center cursor-pointer', step === totalSteps - 1 ? 'bg-green-500 text-black' : 'bg-white text-black')} onClick={nextStep}>
            next
          </button> : 
          <button type= 'submit' className={cn('border px-6 py-1 font-bold rounded self-center text-center cursor-pointer', step === totalSteps - 1 ? 'bg-green-500 text-black' : 'bg-white text-black')} disabled = {step !== totalSteps - 1} onClick={() => submitRef.current?.click()}>
                  finish
          </button> }
         {/* <button type={step === totalSteps - 1 ? 'submit' : 'button'} className={cn('border px-6 py-1 font-bold rounded self-center text-center cursor-pointer', step === totalSteps - 1 ? 'bg-green-500 text-black' : 'bg-white text-black')} onClick={nextStep}>
            next
          </button> */}

        </div>
    </div>
  )
}

export default SignUpComponent
