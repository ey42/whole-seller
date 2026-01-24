export const runtime = 'nodejs';
import { session } from "@/db/schema";
import { db } from "@/index";
import { requireAuth } from "@/lib/auth/require-auth";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const sessionId = (await cookies()).get("sessionId")?.value
    const result = await requireAuth()
    
    if (!sessionId) {
        return NextResponse.redirect(new URL("/login", process.env.BETTER_AUTH_URL))
    }
    if (result.status === 'unauthenticated') {
        return NextResponse.redirect(new URL("/login", process.env.BETTER_AUTH_URL))
    }
    if (result.status === "refresh" && result.newAccessToken){
            console.log('refresh route set cookies has refresh ');
            (await cookies()).set("accessToken", result.newAccessToken,{
                httpOnly: true,
                sameSite: "lax",
                path: "/",
            })
        }
    
    const activeUser = await db.query.session.findFirst({
        where: eq(session.id, sessionId),
        with: {user:true}
    }) 
    if(activeUser){
         return NextResponse.json({activeUser})
    }
    return NextResponse.json({activeUser:null})
}