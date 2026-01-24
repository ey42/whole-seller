"use server"
import { order, orderItem, product, productCategory, profile } from './../schema';
import { db } from "@/index";
import { v4 as uuidv4 } from "uuid";
import { categoryProp, formDataProp, productProp } from '@/types/types';
import {deleteMultiFromStorage } from '@/lib/supabase/storage/deleteFromStorage';

type updatedUser = Omit <formDataProp, 'image' | 'email' | 'fullName' > &{
    image: string | null 
    userId: string
}

export async function insertToProfileTable(formData : updatedUser){
    const {image, kebele, phoneNumber, shopName, subCity, tinNumber, woreda, userId} = formData
    try {
        console.log('start uploading to profile')
        const id = uuidv4()
        await db.insert(profile).values({
            id,
            image: image ?? undefined,
            subCity,
            kebele,
            shopName,
            TIN: tinNumber,
            phoneNumber,
            woreda,
            userId,
        })
    } catch (error) {
        console.error(`error during insert data to profile table`)
    }
}
export async function insertToOrderAndOrderItemTable({data , id}:{data: CartItem[], id: string | undefined}){
    try {
        if (!id){
            return {success: false, message: "user not found", status: 403}
        }
        const orderId = uuidv4()
        await db.transaction(async(tx) => {
          const res =  await tx.insert(order).values({
                id: orderId,
                userId: id,
                status: 'pending',
                totalProduct: data.length.toString(),
                totalPrice: data.reduce((sum, i) => sum + (i.price * i.quantity),0 ).toString()
            }).returning()

            for (const item of data) {
                await tx.insert(orderItem).values({
                    categoryId: item.categoryId,
                    orderId: res[0].id,
                    productId: item.id,
                    quantity: item.quantity.toString(),
                    unitPrice: item.price.toString(),
                    comment: item.comment ?? undefined,   
                })
            }

        })

        return {success: true, message: "ordered succesfully", status: 200}
    } catch (error) {
        console.error('error during insert to order/orderItem tables', error)
        return {success: false, message: "ordered failed", status: 403}
    }

}

export async function insertToCategoryAndProduct({productDatas, categoryData, userId}:{productDatas: Omit<productProp, "userId"| "updateAt"| "createdAt" | "like" >[], categoryData: Omit<categoryProp, "userId" | "updateAt" | "createdAt">, userId: string}):Promise<{
    success: boolean, message: string
}>{
    try {
        if(!userId){
            console.error('user id is undefined during inserting category and product')
            return {success: false, message: 'user not found'}
        }
        await db.transaction(async(tx) => {
            await tx.insert(productCategory).values({
                ...categoryData,
                userId
            }).catch((error) => {
                console.error('error during inserting to product category', error)
                deleteMultiFromStorage(`category/${categoryData.id}`)
                return {success: false, message: 'insertion failed on product category'}
                })
            

            for (const productData of productDatas) {
                await tx.insert(product).values({
                    ...productData,
                    userId,
                    categoryId: categoryData.id,
                    price: productData.price ? productData.price.toString() : null,
                })
                .catch((error) => {
                    console.error('error during inserting to product', error)
                    deleteMultiFromStorage(`product/${categoryData.id}`)
                    return {success: false, message: 'insertion failed on product'}
            })
        }
        }).catch((error) => {
            console.error('error during transaction inserting category and products', error)
            return {success: false, message: 'insertion failed'}
        })
        return {success: true, message: 'insertion successful'}
    } catch (error) {
        console.error('unexpected error during inserting category and products', error)
        return {success: false, message: 'insertion failed'}
    }
}

export async function insertToProductTable({productData, userId}:{productData: Omit<productProp, "userId"| "updateAt"| "createdAt" | "like" >, userId: string}):Promise<{
    success: boolean, message: string
}>{
    try {
        if(!userId){
            console.error('user id is undefined during inserting product')
            return {success: false, message: 'user not found'}
        }
        await db.insert(product).values({
            ...productData,
            userId,
            price: productData.price ? productData.price.toString() : null,
        })
        return {success: true, message: 'insertion successful'}
    } catch (error) {
        console.error('unexpected error during inserting product', error)
        return {success: false, message: 'insertion failed'}
    }
}