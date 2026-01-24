"use client"
import React, { useEffect, useState } from 'react'
import { useRealtimeNotification } from '@/db/realtime-fetch/realtime-notification'
import { AnimatePresence, motion } from 'framer-motion'
import { useRealtimeMessage } from '@/db/realtime-fetch/realtime-message'



const Notification = ({notificationId: id} : {notificationId: string}) => {
    const [step, setStep] = useState(1)
    const notifications = useRealtimeNotification() 
    const messages = useRealtimeMessage(id)

    const privateNotification = () => {
      setStep(2)
    }
    const publicNotificatin = () => {
      setStep(1)
    }
    

  return (
    <div className='flex gap-4 w-full items-center mt-10 border-2 border-white backdrop-blur-2xl text-white col flex-col'>
      <div className='flex gap-4'>
        <motion.button whileTap={{scale: 0.8}} onClick={publicNotificatin} className='border rounded border-white px-6 py-1 mt-4'>public</motion.button>
        <motion.button whileTap={{scale: 0.8}} onClick={privateNotification} className='border rounded border-white px-6 py-1 mt-4'>private</motion.button>
      </div>
      <AnimatePresence mode='wait'>
         <motion.div
                    key={step}
                    initial={{x: 50, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: -50, opacity: 0}}
                    transition={{duration: 0.3}}
                    className='flex flex-col gap-4'>
                      
                      {step === 1 && (
                          <div className='flex-col flex gap-2'>
                              {notifications && notifications.length > 0 ? notifications.map((notification) => (
                                <div>hy</div>
                              )) : 'no notification'}
                          </div>
                        )}
                        {step === 2 && (
                          <div className='flex-col flex gap-2'>
                              {messages && messages.length > 0 ? messages.map((notification) => (
                                <div>hy</div>
                              )) : 'no message'}
                          </div>
                        )}
                        
                    </motion.div>
      </AnimatePresence>
      <div>
      </div>      
    </div>
  )
}

export default Notification
