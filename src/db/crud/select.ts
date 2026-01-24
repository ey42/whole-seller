"use server"

import { db } from "@/index"
import { profile, user, notification, message, session, productCategory } from "../schema"
import { eq } from "drizzle-orm"
import { categoryProp, categoryWithProductProps } from "@/types/types"

export async function GetProfile(id:string){
    const userProfile = await db.query.user.findFirst({
        where: eq(user.id, id),
        with: {
            profile: true
        },
    })

    return userProfile 
}
export async function getNotification() {
    const userNotification = await db.query.notification.findMany({
        with: {
            user: true
        }
    })
    return userNotification
}
export async function getProducts() {
    const userProducts = await db.query.product.findMany({
        with: {
            user: true
        }
    })
    return userProducts
}
export async function getMessage(id: string) {
    const userMessage = await db.query.message.findMany({
        where: eq(message.userId, id),
        with: {
            user: true,
            admin: true
        }
    })
    return userMessage
}

export async function getActiveUser(id: string){
    try {
        
        const activeUser = await db.query.session.findFirst({
            where: eq(session.id, id),
            with: {user:true}
        }) 
    
        return activeUser
    } catch (error) {
        throw new Error(`error happen during getting active users ${error}`)
    }
}

export async function getCategories(){
    try {
        const categories: categoryProp[] = await db.query.productCategory.findMany()
        return categories
    } catch (error) {
        
    }
}

export async function getCategoryById(id: string): Promise<categoryWithProductProps | undefined>{
    try {
        const category: categoryWithProductProps | undefined = await db.query.productCategory.findFirst({
            where: eq(productCategory.id, id),
            with : {
                products: true,  
            }
        })
        return category
    } catch (error) {
        throw new Error(`error happen during getting category by id ${error}`)
    }
}