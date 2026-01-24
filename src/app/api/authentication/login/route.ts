export const runtime = 'nodejs';
import { account, user } from "@/db/schema";
import { verifyPassword } from "@/files/Authentication/passwordHash";
import { db } from "@/index";
import { createSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    const {email, password} = await req.json();
    try {
      const User = await db.query.user.findFirst({
        where: eq(user.email, email)})
    if(!User){
        return NextResponse.json({success: false, message: `${email} not registered please create account `},{status: 401})
    }
      const Account = await db.query.account.findFirst({
        where: eq(account.userId, User.id)
      })

      if(!Account?.password){
        return NextResponse.json({success: false, message: 'you dont have an account'},{status: 401,})
    }
      const validPassword = await verifyPassword({password, hash: Account.password})

      if(!validPassword){
        return NextResponse.json({success: false, message: "Incorrect password"},{status: 401})
      }
      
      const {sessionId, accessToken, refreshToken} = await createSession(User.id);
      console.log(`login sessionId ${sessionId}`)

      const cookie =  await cookies()
      cookie.set("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        priority: "high"
      })
      cookie.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
        path: '/',
        maxAge: 15 * 60,
        priority: "high"
      })
      cookie.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "lax",
        path: '/',
        maxAge: 60 * 60 * 24 * 180,
        priority: "high"
      })

    return NextResponse.json({success: true, message: 'succesfully signed'})

    } catch (error) {
        return NextResponse.json({success: false, message: 'server error'},{status: 500})
    }
    
}