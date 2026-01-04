import { account, message } from "@/db/schema";
import { hashPassword, verifyPassword } from "@/files/Authentication/passwordHash";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

export async function POST(request: NextRequest){

    const {newPassword, oldPassword, id} = await request.json()
    if(!newPassword){
     return NextResponse.json({success: false, message: "please put password"},{status: 404})
    }
    try {

        const res = await db.query.account.findFirst({
            where: eq(account.userId, id),
        })

        if(res && res?.password !== undefined && res?.password !== null ){
           const verifyData = await verifyPassword({hash: res.password, password: oldPassword})

            if(verifyData === true){
                const hashedPassword = await hashPassword(newPassword)
                await db.update(account).set({
                    password: hashedPassword
                }).where(eq(account.userId, id))
                return NextResponse.json({success: true, message: "succesfully updated your password"},{status: 200})
            }
            return NextResponse.json({success: false, message: "wrong old password"}, {status: 404})
        }
        
        return NextResponse.json({success: false, message: "there is no data by this user"})

    } catch (error) {
         return NextResponse.json({success: false, message: "Failed to update password", error}, {status: 500});
    }
}