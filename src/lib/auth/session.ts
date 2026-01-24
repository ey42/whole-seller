"use server"
import { account, session } from "@/db/schema";
import { db } from "@/index";
import { and, eq, gt, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { generateToken } from "../generate-token";
import { redirect } from "next/navigation";

export async function createSession(userId: string){
    const sessionId = crypto.randomUUID();
    const headerList = await headers();

    const ip = headerList.get('x-forwarded-for')?.split(',')[0] || 
             headerList.get('x-real-ip') || 
             'Unknown';

    const userAgent = headerList.get('user-agent') || 'unknown'

    const sessionToken = generateToken(32)
    const accessToken= generateToken(32)
    const refreshToken= generateToken(64)
    await db.transaction(async(tx) => {
    await tx.insert(session).values({
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        token: sessionToken,
        id: sessionId,
        userId,
        ipAddress: ip,
        userAgent: userAgent
    })
    await tx.update(account).set({
      accessToken,
      accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      refreshToken,
      refreshTokenExpiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
    }).where(eq(account.userId, userId))
  
  
  })
    return {sessionId, accessToken, refreshToken};
}
export async function validateSession(sessionId: string) {
  const [userSession] = await db
    .select()
    .from(session)
    .where(
      and(
        eq(session.id, sessionId),
        gt(session.expiresAt, new Date())
      )
    );
  
  return userSession;
}

// Delete session
export async function deleteSession(sessionId?: string, userId?: string) {
  if(sessionId && userId){
    await db.transaction(async(tx) => {
      await tx.delete(session).where(eq(session.id, sessionId));
      await tx.update(account).set({
        accessToken: null,
        refreshToken: null,
        refreshTokenExpiresAt: null,
        accessTokenExpiresAt: null
      }).where(eq(account.userId, userId))
    })
 
  return
  }
  if(userId){
  await db.transaction(async(tx) => {
      await tx.delete(session).where(lt(session.expiresAt, new Date()));
      await tx.update(account).set({
        accessToken: null,
        refreshToken: null,
        refreshTokenExpiresAt: null,
        accessTokenExpiresAt: null
      }).where(eq(account.userId, userId))
    })
    return 
  }
  await db.transaction(async(tx) => {
      await tx.delete(session).where(lt(session.expiresAt, new Date()));
      await tx.update(account).set({
        accessToken: null,
        refreshToken: null,
        refreshTokenExpiresAt: null,
        accessTokenExpiresAt: null
      }).where(lt(account.refreshTokenExpiresAt, new Date()))
    })
    return 
  
}