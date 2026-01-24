import { session } from "@/db/schema";
import { db } from "@/index";
import { deleteSession, validateSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        const sessionId  = (await cookies()).get("sessionId")?.value

    if(!sessionId){
        deleteSession();
        const res =  NextResponse.json({status: 200});
            res.cookies.delete('sessionId');
            res.cookies.delete('accessToken');
            res.cookies.delete('refreshToken');
            console.log(`logged out session ${(await cookies()).get('sessionId')?.value}`)
            return res
    }
    const sessions = await db.query.session.findFirst({
        where: eq(session.id, sessionId)
    })

    const userId = sessions?.userId

    deleteSession(sessionId, userId);
        const res = NextResponse.json({status: 200});
            res.cookies.delete('sessionId');
            res.cookies.delete('accessToken');
            res.cookies.delete('refreshToken');

            console.log(`logged out session ${(await cookies()).get('sessionId')}`)
            return res
    } catch (error) {
        return NextResponse.json({status:500})
    }

    

}