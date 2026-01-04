export const runtime = 'nodejs';
import EmailTemplate from "@/files/EmailTemplate";
import { db } from "@/index";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {user, account} from '@/db/schema';


export async function POST(request: NextRequest){
    try {
        const {to, subject, type, body, email} = await request.json();
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = "Eyob whole-seller <whole-seller@resend.dev>";
        
        if(type === "request-reset-password"){
            if(email === ''){
            return NextResponse.json({success: false, message: `error: please provide your email address or body`}, {status: 404});
        }
            const users = await db.select().from(user).where(eq(user.email, to));
            const singleUser = users[0];
            if(users.length === 0 || !singleUser){
                return NextResponse.json({success: false, message: `No user found with email: ${to}`}, {status: 404});
            }
            const userAccount = await db.select().from(account).where(eq(account.userId, singleUser.id))
        if(userAccount[0].passwordResetToken !== null){
            await db.update(account).set({
            passwordResetToken: null,
            passwordResetTokenExpires: null,
        }).where(eq(account.userId, singleUser.id));
        }

        // 1. Create a buffer of 32 bytes (256 bits)
        const array = new Uint8Array(32);

        // 2. Fill it with cryptographically strong random values
        crypto.getRandomValues(array);

        // 3. Convert the byte array to a Hex string
        const token = Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

        const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes from now

        await db.update(account).set({
            passwordResetToken: token,
            passwordResetTokenExpires: expires,
        }).where(eq(account.userId, singleUser.id));

        const resetUrl = `${process.env.BETTER_AUTH_URL}/reset-password?token=${token}`;
        
        await resend.emails.send({
            from,
            to,
            subject,
            react: EmailTemplate({firstName: users.length > 0 ? users[0].name : "user", url: resetUrl, type}),
        });
        return NextResponse.json({success: true, message: `${type} email sent successfully to ${to}`}, {status: 200});
    } else if(type === 'contact'){

        if((!email || '') || (!body || '')){
            return NextResponse.json({success: false, message: `error: please provide your email address or body`}, {status: 404});
        }
        const users = await db.select().from(user).where(eq(user.email, email));
        const singleUser = users[0];
        const userName = singleUser.name ? `${singleUser.name} registered` : email;

        if(users.length === 0 || !singleUser){
            return NextResponse.json({success: false, message: `No user found with email: ${to} `}, {status: 404});
        }

        await resend.emails.send({
            from,
            to,
            subject,
            react: EmailTemplate({firstName: from , type: 'contact',body, email: userName}),
        });
        return NextResponse.json({success: true, message: `email sent successfully to ${to}`}, {status: 200});
    }
    } catch (error) {
        return NextResponse.json({success: false, message: "Failed to send email", error}, {status: 500});
    }
}