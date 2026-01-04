"use server"

import { db } from "@/index"
import { profile, user } from "../schema"
import { eq } from "drizzle-orm";

interface userUpdateProps {
  name: string|null,
  email: string | null,
}
interface profileUpdateProps {
  image: string | null,
  phoneNumber: string | null,
  shopName: string | null,
  subCity: string | null,
  woreda: string | null,
  kebele: string | null,
  TIN: string | null
}
export async function updateProfile({users, profiles, id}: {users: userUpdateProps, profiles: profileUpdateProps, id:string}){
    const hasUser : boolean = Object.entries(users).filter(([_, I]) => I != null && I != '').length > 0
    const hasProfile : boolean = Object.entries(profiles).filter(([_, I]) => I != null && I != '').length > 0
    const safeUpdateUser = Object.fromEntries(
    Object.entries(users).filter(([_, v]) => v != null && v != '')
  );
    const safeUpdateProfile = Object.fromEntries(
    Object.entries(profiles).filter(([_, v]) => v != null && v != '')
  );
  console.log('am on the server side ', safeUpdateUser.name)
  try {
    if(hasUser && hasProfile){
    await db.transaction(async (tx) => {
      await tx.update(user).set({
        ...safeUpdateUser
      }).where(eq(user.id, id))
  
      await tx.update(profile).set({
        ...safeUpdateProfile
      }).where(eq(profile.userId, id))
    })
    return {success: true, message: 'successfully update'}
  } else if(hasUser && !hasProfile){
    await db.update(user).set({
      ...safeUpdateUser
    }).where(eq(user.id, id))
    return {success: true, message: 'successfully update'}
  } else if(hasProfile && !hasUser){
    await db.update(profile).set({
      ...safeUpdateProfile
    }).where(eq(profile.userId, id))
    return {success: true, message: 'successfully update'}
  }
  return {success: false, message: `update failed ${error}`}
  } catch (error) {
    return {success: false, message: `update failed ${error}`}
  }

}