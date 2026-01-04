"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SubCityForm = ({label, options, value, onChange, path}:{label: string, options:string[], value: string, onChange: (val: string) => void, path?: boolean}) => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('w-full flex flex-col', path ? 'relative': 'relative')}>
        <label className='font-semibold'>{label}</label>

        <button className='flex bg-zinc-800 items-center justify-between w-full p-2 border border-zinc-700 hover:border-green-500 transition-colors text-left' onClick={() => setIsOpen(!isOpen)} type='button'>
            <span className='text-white'>
                {value ? value : "Select an option..."}
            </span>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={18}/>
            </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <>
            <div className={cn('fixed  inset-0 z-30 ',{
              'backdrop-blur-2xl': !path 
            })} onClick={() => setIsOpen(false)}/>
            <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn("left-0 subsityform mb-10 h-80 w-full bg-zinc-800 border border-zinc-700 rounded shadow-2xl z-40 overflow-auto",{
              'absolute top-[105%]': !path,
              'top-0 absolute h-60 bg-zinc-500': path
            })}>

              {options.map((option) => (
                <li key={option} onClick={() => {
                  onChange(option);
                  setIsOpen(false); 
                }} className='p-3 hover:bg-green-600 hover:text-white cursor-pointer font-semibold transition-colors'>
                  {option}
                </li>
              ))}</motion.ul>  
            </>
          )}
        </AnimatePresence>
      
    </div>
  )
}

export default SubCityForm
