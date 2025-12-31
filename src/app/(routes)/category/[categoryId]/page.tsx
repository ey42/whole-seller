import { PRODUCTCS } from '@/files/fakedatabase'
import Category from '@/files/product/Category'
import { oneCategory } from '@/files/types'
import { getSession } from '@/lib/auth-server'
import React from 'react'


interface PageProps{
        params: {
            categoryId: string
        }
    }


    const page = async ({params}: PageProps) => {
        const session = await getSession()
            const user = session?.user
        const { categoryId } = await params
        const specificCategory : oneCategory  = PRODUCTCS.find((category) => category.id === categoryId) as oneCategory
        return (
            <div className='flex mt-5 w-full'>
            <Category id={categoryId} specificCategory = {specificCategory}/>
            </div>
        ) 
}

export default page
