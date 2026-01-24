import { account, profile, user } from "@/db/schema";
import { db } from "@/index";
import { hash } from "@node-rs/argon2";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request){
    const {name, email, password, kebele, phoneNumber, shopName, subCity, tinNumber, woreda, image} = await req.json();
    try {
       if(!name){
        return NextResponse.json({success: false, message: "pls provide name", data: null}, {status: 401 })   
    }
    if(!email){
        return NextResponse.json({success: false, message: "pls provide email", data: null}, {status: 401 })   
    }
    if(!password){
        return NextResponse.json({success: false, message: "pls provide password", data: null}, {status: 401 })   
    }

    const idUser = uuidv4()
    const idAccount = uuidv4()
    const idProfile = uuidv4()
    await db.transaction(async(tx) => {
       const res= await tx.insert(user).values({
            email,
            name,
            id: idUser,
        }).returning()
        if (!res[0]?.id) {
        throw new Error("User was not inserted")
        }
        const hashed = await hash(password)
        const acc = await tx.insert(account).values({
            accountId: res[0].id,
            id: idAccount,
            providerId: 'credential',
            userId: res[0].id,
            password: hashed
        }).returning()
        if (!acc.length) {
        throw new Error("Account insert failed")
        }
        const prof = await tx.insert(profile).values({
            id: idProfile,
            phoneNumber,
            subCity,
            TIN: tinNumber,
            userId: res[0].id,
            image,
            kebele,
            shopName,
            woreda
        }).returning()
         if (!prof.length) {
        throw new Error("profile insert failed")
        }
    })
    const data = await db.query.user.findFirst({
        where: eq(user.email, email)
    })
 

    return NextResponse.json({success: true, message: 'user created successfully', data: data}, {status: 200})

    } catch (error: any) {
        const cause = error.cause
        if(cause?.code === "23505"){
            return NextResponse.json({success: false, message: `failed to create user : ${cause.detail}`, data: null}, {status: 500})
        }
        return NextResponse.json({success: false, message: `failed to create user : ${error}`, data: null}, {status: 500})
    }

    







}