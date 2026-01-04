"use client"
import { GetProfile } from '@/db/crud/select'
import React, { ChangeEvent, Suspense, useEffect, useRef, useState } from 'react'
import { userProfileProps } from './types'
import Image from 'next/image'
import { Icons } from '@/Icons/iconica'
import { Camera, Eye, EyeClosed, X } from 'lucide-react'
import { updateProfile } from '@/db/crud/update'
import SubCityForm from './subCityForm'
import { options } from './fakedatabase'
import { usePathname, useRouter } from 'next/navigation'
import z from 'zod'
import { uploadToProfile } from '@/lib/supabase/storage/uploadToStorage'
import { AnimatePresence, motion } from 'framer-motion'

interface profileProp {
    image: File | null ,
    phoneNumber: string | null,
    shopName: string | null,
    subCity: string | null,
    woreda: string | null,
    kebele: string | null,
    TIN: string | null,
}
interface userprops{
    name: string|null,
    email: string | null,
}
interface passworProps{
    oldPassword: string | null,
    newPassword: string | null
}
interface errorProps {
    schemaError: string | null,
    fetchError: string | null,
}
interface updateErrorProps {
    emptyError: string
    [key: string] : string | string[]
}
const Profile = ({id}:{id:string}) => {
    const [profile, setProfile] = useState<userProfileProps | null>(null)
    const [open, setOpen] = useState<boolean>(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [successLoad, setSuccessLoad] = useState<boolean>(false)
    const imageRef = useRef<HTMLInputElement | null>(null)
    const [updatePasswordSuccess, setUpdatePasswordSuccess] = useState<boolean>(false)
    const [view, setView] = useState<boolean>(false)
    const pathname = usePathname()
    const profilePathname = pathname.includes('/profile') ? true : false
    const router = useRouter()
    const [updateError, setUpdateError] = useState<updateErrorProps>({
        emptyError: "please fill the fields before click update"
    })
       const [password, setPassword] = useState<passworProps>({
            newPassword: null,
            oldPassword: null
        })
        const [error, setError] = useState<errorProps>({
            fetchError: null,
            schemaError: null
        })
    const [userInfo, setUserInfo] = useState<userprops>({
        name: null,
        email: null,
        })
    const [profileInfo, setProfileInfo] = useState<profileProp>({
        image: null,
        phoneNumber: null,
        shopName: null,
        subCity: null,
        woreda: null,
        kebele: null,
        TIN: null,
        })
    
        
    useEffect(() => {
        GetProfile(id).then((data) => {
            if(data){
                setProfile(data)
            }
        })
    },[id, successLoad || false])

    const updateInfoSchema = z.object({
        name: z.string().min(2, 'name must be there').optional(),
        email:z.email("Invalid email address").optional(),
        phoneNumber: z.string().regex(/^\d{10}$/, "Must be a valid 10-digit number").optional(),
        shopName: z.string().min(2, "Shop name is required").optional(),
        subCity: z.string().min(2, 'subcity required field').optional(),
        woreda:  z.string().min(1, "Woreda is required").optional(),
        kebele: z.string().optional(),
        TIN: z.string().optional(),
    })

    const userSchema = updateInfoSchema.pick({
        email: true,
        name: true
    })
    const profileSchema = updateInfoSchema.pick({
        kebele: true,
        phoneNumber: true,
        shopName: true,
        subCity: true,
        TIN: true,
        woreda: true
    })

    const resetPasswordSchema = z.object({
        oldPassword: z.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        newPassword: z.string().min(8, "Password must be at least 8 characters long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
      })
    const handleUpdate = async() => {
     const hasUser : boolean = Object.entries(userInfo).filter(([_, I]) => I != null && I != '').length > 0
     const hasProfile : boolean = Object.entries(profileInfo).filter(([_, I]) => I != null && I != '').length > 0

     if(hasProfile === false && hasUser === false){
        setUpdateError({...updateError, emptyError: "please fill the fields before click update"})
        alert(updateError?.emptyError)
        return
     }
     console.log(`name ${userInfo.name} TIN ${profileInfo.TIN}`)

        const userSchemaResult = userSchema.safeParse(userInfo)
        const profileSchemaResult = profileSchema.safeParse(profileInfo)
        if(userSchemaResult.error || profileSchemaResult.error){
            if(profileSchemaResult.error){
                setUpdateError({...updateError, ...profileSchemaResult.error.flatten().fieldErrors})
                console.log(`userSchemaError ${profileSchemaResult.error.flatten().fieldErrors.phoneNumber}`)
            }
            if(userSchemaResult.error){
            setUpdateError({...updateError, ...userSchemaResult.error.flatten().fieldErrors,})
            console.log(`userSchemaError ${userSchemaResult.error.flatten().fieldErrors}`)
            }
            
        }
        if(profileInfo.image !== null){
            const {publicUrlData, error} = await uploadToProfile(profileInfo.image)
            if(publicUrlData){
                updateProfile({users: userInfo, profiles: {...profileInfo, image: publicUrlData.publicUrl}, id}).then((data) => {
                    if(data.success === true){
                        setTimeout(() => {
                            setSuccessLoad(true)
                        }, 3000);
                        setSuccessLoad(false)
                        setUpdateError({
                            emptyError: "please fill the fields before click update"
                        })
                        router.refresh()
                    }
                    if(data.success === false){
                        setUpdateError({...updateError, updateProfileError: data.message})
                        console.log('error when updating')
                    }
                    
            })
            }
            if(error){
            setUpdateError({...updateError, imageError: error.message})
            }   
        }
       updateProfile({users: userInfo, profiles: {...profileInfo, image: null}, id}).then((data) => {
                    if(data.success === true){
                        setTimeout(() => {
                            setSuccessLoad(false)
                        }, 3000);
                        setSuccessLoad(true)
                        setUpdateError({
                            emptyError: "please fill the fields before click update"
                        })
                        router.refresh()
                    }
                    if(data.success === false){
                        setUpdateError({...updateError, updateProfileError: data.message})
                    }
                    
            }) 
    }
    const handlePassword = async() => {
        const resultSchema = resetPasswordSchema.safeParse(password)
        if(resultSchema.error){
            setError({...error, schemaError :'please validate the password according to password specification'
            })
            return
        }
        const res =  await fetch('http://localhost:3000/api/verifyPassword',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              id: id,
              oldPassword: password.oldPassword,
              newPassword: password.newPassword
            })
          })
          const result = await res.json()
          if(!res.ok){
            setError({...error, fetchError: result.message})
            setUpdatePasswordSuccess(false)
            return
          }
          if(res.ok){
            setError({
                fetchError: null,
                schemaError: null
            })
            setTimeout(() => {
                setUpdatePasswordSuccess(false)
            }, 3000);
                setUpdatePasswordSuccess(true)
                router.refresh()
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
      
        setProfileInfo((prevData) => ({
          ...prevData,
          image: file
        }));
      }
    }
useEffect(() =>{
    router.refresh()
},[])

  return (
    <div className='flex flex-col w-full items-center justify-center relative'>
       { !open ?  <div className='flex mt-5 relative flex-col gap-10 px-6 py-10 backdrop-blur-lg backdrop-opacity-70 backdrop-brightness-50 border border-white rounded shadow-[0px_0px_50px_0px_rgba(255,255,255,0.6)] max-w-4xl'>
        <div className='flex max-sm:flex-col gap-10 max-sm:gap-2 w-full backdrop-blur-2xl bg-white rounded py-2'>
            <div className='self-center flex p-4'>
                {profile?.profile.image
                 ? 
                 (<div className='border border-black rounded-full overflow-hidden flex relative w-32 h-32'>  
                    <Image alt={profile.name} src={`${profile.profile.image}`} width={200} height={200} className='w-full absolute flex'/>
                </div>)
                :
                (<div className='rounded-full bg-gray-400 flex items-center justify-center  w-24 h-24'>
                    <Icons.User width={75} height={75}/>
                </div>)}
            </div>
            <div className='flex max-sm:self-start self-center max-sm:pl-10 text-black font-semibold max-sm:text-lg gap-4 flex-col'>
                {!profile?.name ? <h1 className='animate-pulse w-32 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='text-lg max-sm:text-2xl first-letter:uppercase'>{profile?.name}</h1>}
                {!profile?.profile.userRole ? <h1 className='animate-pulse w-32 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1>{profile?.profile.userRole}</h1>}
                {!profile?.profile.subCity ? <h1 className='animate-pulse w-32 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='first:uppercase'>{profile?.profile.subCity && `${profile?.profile.subCity},`} {profile?.profile.woreda && `woreda ${profile?.profile.woreda},`} {profile?.profile.woreda && `kebele ${profile?.profile.kebele}`}</h1>}
            </div>
        </div>
        <div className='flex flex-col px-6 bg-white rounded gap-6'>
            <div className='flex mt-2 max-sm:justify-center max-sm:gap-20 justify-between'>
                <h1 className='font-bold text-lg'>Personal informations</h1>
                <motion.button whileTap={{scale: 0.8}} onClick={() => setOpen(true)} className='border cursor-pointer rounded px-6 py-1 border-black font-bold'>edit</motion.button>

            </div>
            <div className='flex max-sm:flex-col max-sm:gap-6 gap-20'>
                <div className='flex text-sm flex-col'>
                    <p className='text-sm font-semibold'>First Name</p>
                    {!profile?.name ? <h1 className='animate-pulse w-32 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='font-semibold first-letter:uppercase'>{profile?.name}</h1>}
                </div>
                <div className='flex text-sm flex-col'>
                    <p className='text-sm font-semibold'>email</p>
                    {!profile?.email ? <h1 className='animate-pulse w-32 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='font-semibold first-letter:uppercase'>{profile?.email}</h1>}
                </div>
                <div className='flex flex-col'>
                    <p className='text-sm font-semibold'>phone number</p>
                    {!profile?.profile.phoneNumber ? <h1 className='animate-pulse w-32 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:(<h1 className='font-semibold text-sm'>{profile?.profile?.phoneNumber}</h1>)}
                </div>    
            </div>
            <div className='flex gap-2 pb-2'>
                <h1 className='text-sm font-semibold'>TIN:</h1>
                {!profile?.profile.TIN ? <h1 className='animate-pulse w-32 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='text-sm font-semibold'>{profile?.profile.TIN}</h1>}
            </div>
            <div className='flex gap-2 pb-2'>
                <h1 className='text-sm font-semibold'>shop name:</h1>
                {!profile?.profile.shopName ? <h1 className='animate-pulse w-32 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='text-sm font-semibold'>{profile?.profile.shopName}</h1>}
            </div>
            <div className='flex gap-2 pb-2'>
                <h1 className='text-sm font-semibold'>created at:</h1>
                {!profile?.createdAt ? <h1 className='animate-pulse w-32 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='text-sm font-semibold'>{profile?.createdAt.toLocaleDateString()}</h1>}
            </div>
        </div>
        <div className='flex flex-col px-6 py-2 max-sm:gap-6 bg-white rounded gap-10'>
            <div className='flex'>
                <h1 className='font-bold text-lg'>address</h1>
            </div>
            <div className='flex max-sm:flex-col max-sm:gap-6 gap-20'>
                <div className='flex flex-col'>
                    <h1 className='text-sm font-semibold'>City</h1>
                    {!profile?.profile.phoneNumber ? <h1 className='animate-pulse w-32 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='font-semibold'>Addis Ababa</h1>}
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-sm font-semibold'>sub-city</h1>
                    {!profile?.profile.subCity ? <h1 className='animate-pulse w-16 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='font-semibold'>{profile?.profile.subCity}</h1>}
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-sm font-semibold'>woreda</h1>
                    {!profile?.profile.woreda ? <h1 className='animate-pulse w-16 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='font-semibold'>{profile?.profile.woreda}</h1>}
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-sm font-semibold'>kebele</h1>
                    {!profile?.profile.kebele ? <h1 className='animate-pulse w-16 rounded bg-gray-400 h-auto  text-transparent'>l</h1>:<h1 className='font-semibold'>{profile?.profile.kebele}</h1>}
                </div>
            </div>
        </div>
        </div> : 
        <AnimatePresence mode='wait'>
        <>
        <div className='fixed inset-0 backdrop-blur-2xl z-10' onClick={() => setOpen(false)}/>
            <motion.div 
            initial = {{opacity: 0, y: -10}}
            animate= {{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -10}} 
            className='flex mt-5 relative flex-col gap-10 px-6 py-10 backdrop-blur-lg backdrop-opacity-70 backdrop-brightness-50 border border-white rounded shadow-[0px_0px_50px_0px_rgba(255,255,255,0.6)] max-w-4xl z-20'>
        <div className='flex max-sm:flex-col p-4 gap-10 max-sm:gap-6 w-full backdrop-blur-2xl  bg-white rounded '>
            <div className='self-center flex'>
                {profile?.profile.image
                 ? 
                 (<div className='rounded-full overflow-hidden flex w-32 h-32'>  
                    <Image alt='image' src={imagePreview ?? profile.profile.image} width={200} height={200} className='w-full'/>
                </div>)
                : imagePreview ? (<div className='rounded-full overflow-hidden flex w-32 h-32'>  
                    <Image alt='image' src={imagePreview } width={200} height={200} className='w-full'/>
                </div>) :
                (<div className='rounded-full bg-gray-400 flex items-center justify-center  w-24 h-24'>
                    <Icons.User width={75} height={75}/>
                </div>)}<Camera className='cursor-pointer' onClick={() => imageRef.current?.click()}/>
                <input type="file" name="image" ref={imageRef} id="image" onChange={handleImageSelect} hidden/>
            </div>
            <div className='flex self-center max-sm:gap-2 gap-10 max-sm:pl-2 max-sm:flex-col max-sm:self-start'>
            <div className='flex self-center max-sm:self-start gap-2 text-black font-semibold  flex-col'>
                <h1 className='text-lg max-sm:text-lg first-letter:uppercase'>{profile?.name}</h1>
                <h1>role: {profile?.profile.userRole}</h1>
                <h1>shop name: {profile?.profile.shopName}</h1>
                <h1 className='first:uppercase'>{profile?.profile.subCity && `${profile?.profile.subCity},`} {profile?.profile.woreda && `woreda ${profile?.profile.woreda},`} {profile?.profile.woreda && `kebele ${profile?.profile.kebele}`}</h1>
            </div>
            <div className='flex gap-2 max-sm:self-start self-center text-black font-semibold  flex-col'>
                <h1 className=' first-letter:uppercase'>{profile?.email}</h1>
                <h1>{profile?.profile.phoneNumber}</h1>
                <h1 className='first:uppercase'>TIN: {profile?.profile.TIN}</h1>
            </div>
            </div>
        </div>
        <div className='flex flex-col px-6 py-2 bg-white rounded gap-5'>
            <div className='flex mt-2 max-sm:justify-center max-sm:gap-0 justify-between'>
                <h1 className='font-bold text-lg'>Update Personal informations</h1>
                <motion.button whileTap={{scale:0.8}} onClick={() => setOpen(false)} className='border flex items-center justify-center cursor-pointer h-8 rounded-full border-black w-8 font-bold'><X/></motion.button>

            </div>
            <div className='grid grid-cols-2 max-sm:flex max-sm:flex-col max-sm:gap-6 gap-4'>
                <div className='flex flex-col'>
                    <label htmlFor='name' className='text-sm font-semibold'>Full Name</label>
                    <input id='name' className='border py-1 font-medium border-black rounded text-sm pl-1 focus:outline-none' type='text' 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setUserInfo({...userInfo, name: e.target.value})
                    }}
                    value={userInfo.name ?? ''}/>
                    {updateError && updateError['name'] && <span className='text-red-500 text-sm'>{updateError['name']}✍</span>}
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='email' className='text-sm font-semibold'>email</label>
                    <input id='email' className='border py-1 font-medium border-black rounded text-sm pl-1 focus:outline-none' type='email' 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setUserInfo({...userInfo, email: e.target.value})
                    }}
                    value={userInfo.email ?? ''}/>
                    {updateError && updateError['email'] && <span className='text-red-500 text-sm'>{updateError['email']}✍</span>}
                </div>
                <div className='flex flex-col'>
                    <label htmlFor='phoneNumber' className='text-sm font-semibold'>phone number</label>
                    <input id='phoneNumber' className='border py-1 font-medium border-black rounded text-sm pl-1 focus:outline-none' type='tel' 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setProfileInfo({...profileInfo, phoneNumber: e.target.value})
                    }}
                    value={profileInfo.phoneNumber ?? ''}/>
                    {updateError && updateError['phoneNumber'] && <span className='text-red-500 text-sm'>{updateError['phoneNumber']}✍</span>}
                </div>
                 
            </div>
            <div className='flex gap-20 max-sm:gap-6 max-sm:flex-col max-sm:w-full self-start'>
                <div className='flex flex-col '>
                <label htmlFor='tin' className='text-sm font-semibold'>TIN</label>
                    <input id='tin' className='border py-1 font-medium border-black rounded text-sm pl-1 focus:outline-none' type='text' 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setProfileInfo({...profileInfo, TIN: e.target.value})
                    }}
                    value={profileInfo.TIN ?? ''}/>
                    {updateError && updateError['TIN'] && <span className='text-red-500 text-sm'>{updateError['TIN']}✍</span>}
                </div>  
                <div className='flex flex-col '>
                <label htmlFor='shopName' className='text-sm font-semibold'>shop name</label>
                    <input id='shopName' className='border py-1 font-medium border-black rounded text-sm pl-1 focus:outline-none' type='text' 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setProfileInfo({...profileInfo, shopName: e.target.value})
                    }}
                    value={profileInfo.shopName ?? ''}/>
                    {updateError && updateError['shopName'] && <span className='text-red-500 text-sm'>{updateError['shopName']}✍</span>}
                </div>  
            </div>
        
            <div className='flex'>
                <h1 className='font-bold text-lg'>address:</h1>
            </div>
            <div className='grid gap-4 max-sm:flex-col max-w-1/2 max-sm:min-w-full max-sm:gap-6'>
               <div className='flex w-44 flex-col'>                  
                <SubCityForm  label='sub city' options={options} onChange={(val) => setProfileInfo({...profileInfo, subCity: val})} value={profileInfo.subCity ?? ''} path={profilePathname}/>
                  {updateError && updateError['subCity'] && <span className='text-red-500 text-sm'>{updateError['subCity']}✍</span>}
                </div> 
                <div className='flex flex-col'> 
                    <label htmlFor='woreda' className='text-sm font-semibold'>woreda</label>
                    <input id='woreda' className='border py-1 font-medium border-black rounded text-sm pl-1 focus:outline-none' type='text' 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setProfileInfo({...profileInfo, woreda: e.target.value})
                    }}
                    value={profileInfo.woreda ?? ''}/>
                    {updateError && updateError['woreda'] && <span className='text-red-500 text-sm'>{updateError['woreda']}✍</span>}
                </div>   
                <div className='flex flex-col'> 
                    <label htmlFor='kebele' className='text-sm font-semibold'>kebele</label>
                    <input id='woreda' className='border py-1 font-medium border-black rounded text-sm pl-1 focus:outline-none' type='text' 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setProfileInfo({...profileInfo, kebele: e.target.value})
                    }}
                    value={profileInfo.kebele ?? ''}/>
                    {updateError && updateError['kebele'] && <span className='text-red-500 text-sm'>{updateError['kebele']}✍</span>}
                </div>   
            </div>
            <div className='flex flex-col gap-2'>
                <motion.button whileTap={{scale: 0.8}} className='border-2 max-w-1/2 cursor-pointer border-black font-bold rounded px-6 py-1' onClick={handleUpdate}>update</motion.button>
                {successLoad === true && <div className='w-full rounded-md border-2 text-green-500  flex items-center justify-center'>
                <h1>successfully update your pofile🎉</h1>
                </div>}

            </div>
        </div>
        <div className='flex flex-col px-6 py-2 max-sm:gap-6 bg-white rounded gap-10'>
            <div className='flex flex-col gap-2'>
                <div className='flex'>
                <h1 className='font-bold text-lg'>change password</h1>
            </div>
            <p className=' text-green-600'>please put 1 capital 1 small 1 special min 8 char</p>
            </div>
            <div className='flex flex-col gap-2'>
            <div className='flex max-sm:flex-col max-sm:gap-6 gap-20'>
               <div className='flex flex-col'> 
                    <label htmlFor='oldPassword' className='text-sm font-semibold'>old password</label>
                    <input id='oldPassword' className='border py-1 font-medium border-black rounded text-sm pl-1 focus:outline-none' type={view ? 'text' : 'password'} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setPassword({...password, oldPassword: e.target.value})
                    }}
                    value={password.oldPassword ?? ''}/>
                </div>   
                <div className='flex flex-col'> 
                    <label htmlFor='newPassword' className='text-sm font-semibold'>new password</label>
                    <input id='newPassword' className='border py-1 font-medium border-black rounded text-sm pl-1 focus:outline-none' type={view ? 'text' : 'password'} 
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setPassword({...password, newPassword: e.target.value})
                    }}
                    value={password.newPassword ?? ''}/>
                </div>
            </div>
                <div>
                    {view ? <Eye onClick={() => setView(!view)}/> : <EyeClosed onClick={() => setView(!view)}/>} 
                </div>   
            </div>
            <div className='flex flex-col'>
                <motion.button whileTap={{scale: 0.8}} onClick={handlePassword} className='border-2 cursor-pointer w-28 border-black font-semibold rounded px-6 py-1'>update</motion.button>
                {error.fetchError || error.schemaError && 
                (
                <div className='flex flex-col'>
                    
                     {Object.entries(error).map(([key, value], i) => (
                    <div className='flex gap-2' key={i}>
                        {value && <h1 className='font-bold text-sm text-red-500'>{key}:</h1>}
                        <p className='text-sm font-semibold text-red-500'>{value}</p>
                    </div>
                ))}
                </div>
            )}
                {updatePasswordSuccess === true && <div className='w-full self-center rounded-md border-2 text-green-500  flex items-center justify-center'>
                <h1>successfully update your password🎉</h1>
                </div>}
            </div>
        </div>
        
        </motion.div>
        </>
        </AnimatePresence>
        }
    </div>
  )
}

export default Profile
