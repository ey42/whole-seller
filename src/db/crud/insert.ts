"use server"
import { profile } from './../schema';
import { db } from "@/index";
import { v4 as uuidv4 } from "uuid";
import { formDataProp } from '@/files/types';

type updatedUser = Omit <formDataProp, 'image' | 'email' | 'fullName' > &{
    image: string | null 
    userId: string
}
export async function insertToProfileTable(formData : updatedUser){
    const {image, kebele, phoneNumber, shopName, subCity, tinNumber, woreda, userId} = formData
    try {
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