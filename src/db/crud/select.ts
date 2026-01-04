"use server"

import { db } from "@/index"
import { profile, user } from "../schema"
import { eq } from "drizzle-orm"

export async function GetProfile(id:string){
    const userProfile = await db.query.user.findFirst({
        where: eq(user.id, id),
        with: {
            profile: true
        },
    })
    console.log(userProfile?.email)
    return userProfile

}