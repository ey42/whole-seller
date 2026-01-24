"use server"
import { account, session } from "@/db/schema";
import { db } from "@/index";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { generateToken } from "../generate-token";

export async function requireAuth() {
    console.log('am in requireAuth function')
    const cookieStore = cookies();

    const accessToken = (await cookieStore).get("accessToken")?.value
    const refreshToken = (await cookieStore).get("refreshToken")?.value
    const sessionId = (await cookieStore).get("sessionId")?.value
    console.log(`in the require-auth accessToken: ${accessToken} + refreshToken: ${refreshToken} + sessionId: ${sessionId}`)
    if(!sessionId){
        await db.transaction(async(tx) => {
                await tx.update(account).set({
                    accessToken: null,
                    refreshToken: null,
                    refreshTokenExpiresAt: null,
                    accessTokenExpiresAt: null
                }).where(lt(account.refreshTokenExpiresAt, new Date()))
                await tx.delete(session).where(lt(session.expiresAt, new Date()))
            })
            // redirect('/login')
            return {status: "unauthenticated"}
    }
    if(!accessToken) {
        if(!refreshToken){
            await db.transaction(async(tx) => {
                await tx.update(account).set({
                    accessToken: null,
                    refreshToken: null,
                    refreshTokenExpiresAt: null,
                    accessTokenExpiresAt: null
                }).where(lt(account.refreshTokenExpiresAt, new Date()))
                await tx.delete(session).where(lt(session.expiresAt, new Date()))
            })
            // redirect('/login')
            return {status: "unauthenticated"}
        
        }

        if(refreshToken){
            const newAccessToken = generateToken(32)
            await db.update(account).set({
                accessToken: newAccessToken,
                accessTokenExpiresAt: new Date(Date.now()  + 15 * 60 * 1000)
            }).where(eq(account.refreshToken, refreshToken));

            // TODO: then create route handler say require call this function on the route handler then add cookies but this function must return something that show everything successfully happen

            return {status: "refresh", newAccessToken}
        }
    }
    return {status: "authenticated"}
}