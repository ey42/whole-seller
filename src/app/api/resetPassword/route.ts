export const runtime = 'nodejs';
import { db } from "@/index";
import { and, eq, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { user, account } from '@/db/schema';
import bcrypt from 'bcryptjs'
import { hash } from "@node-rs/argon2";

export async function POST(req: NextRequest){
    const {token, password} = await req.json();

    const userAccount = await db.select().from(account).where(eq(account.passwordResetToken, token))
    const singleUserAccount = userAccount[0]
    console.log(`useraccount ${singleUserAccount} and ${singleUserAccount.passwordResetTokenExpires! > new Date() }`)

    if(!userAccount || !(singleUserAccount.passwordResetTokenExpires! > new Date())){
        console.log(`error from route.ts`)
        return NextResponse.json(
            {error: "Invalid or expired"},
            {status: 400}
        )
    }
    const hashed = await hash(password)

    await db.update(account).set({
            passwordResetToken: null,
            passwordResetTokenExpires: null,
            password: hashed
        }).where(eq(account.id, singleUserAccount.id));

        return NextResponse.json({success: true, message: "succesfully update your password", status : 200})
}
