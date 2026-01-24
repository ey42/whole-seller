"use client"
import { getCategories } from '@/db/crud/select'
import { categoryProp } from '@/types/types'
import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const ProductCategories = () => {
  const [categories, setCategories] = useState<categoryProp[] | null>(null)
  useEffect(() => {
      getCategories().then((data) => {
        if(data){
          setCategories(data)
          return
        }
        setCategories(null)
      })
  },[])
  return (
    <div className='flex flex-row gap-4 flex-wrap'>
      {categories && categories.map((category, i) => (
        <Link href={`/admin/product-catagory/update-catagory/${category.id}`} key={category.id} className='flex flex-col border border-white rounded p-2 cursor-pointer w-28 h-28'>
          <Image src={category.image} className ="w-full h-full" width={200} height={200} alt={`${category.name} image`}/>
        </Link>
      ))}
      <Link href={'/admin/product-catagory/new-catagory'} className='w-28 h-28 border-black border-2 flex items-center justify-center bg-slate-200'>
        <Plus fill='black' stroke='black' width={50} height={50}/>
      </Link>
    </div>
  )
}

export default ProductCategories
