export const runtime = 'nodejs';
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { account } from '@/db/schema';
import { hash } from "@node-rs/argon2";

export async function POST(req: NextRequest){
    const {token, password} = await req.json();

    const userAccount = await db.select().from(account).where(eq(account.passwordResetToken, token))
    const singleUserAccount = userAccount[0]
    console.log(`useraccount ${singleUserAccount} and ${singleUserAccount.passwordResetTokenExpires! > new Date() }`)

    if(!userAccount || !(singleUserAccount.passwordResetTokenExpires! > new Date())){
        return NextResponse.json(
            {success: false, message: 'time expired please send verification again'},
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
