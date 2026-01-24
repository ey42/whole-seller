"use server"

import { db } from "@/index"
import { productCategory, profile, user, product } from "../schema"
import { eq } from "drizzle-orm";
import { success } from "zod";
import { supabase } from "@/lib/supabase/supabaseServer";

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
  return {success: false, message: 'update failed there is not user or profile'}
  } catch (error) {
    return {success: false, message: `update failed ${error}`}
  }

}

export async function updateUserRole(id:string, role: string, userRole:"user" | "intermediate"){
  try {
    if(role !== "admin"){
      throw new Error("you aren't eligible to change the role you aren't admin")
    }

    await db.update(user).set({
      userRole: userRole
    }).where(eq(user.id, id))
    return {success: true, message: "succesfully updated your client role" }
  } catch (error: any) {
    return {succuss: false, message: `error: error`}
  }
}

export async function updateCategoryData({name, description, image, categoryId, role}: {name?: string, description?: string, image?: string, categoryId: string , role: string}){
  try {
    if(role === 'admin' || role === 'intermediate'){
      await db.update(productCategory).set({
        name: name,
        description: description,
        image: image
      }).where(eq(productCategory.id, categoryId))
      return {success: true, message: "category updated successfully"}
    }
    return {success: false, message: "you are not authorized to update category"}
  } catch (error) {
    return {success: false, message: error instanceof Error ? `error updating category: ${error}` : "unknown error"}
  }
}
export async function updateProductData({name, description, image, price, stockOuantity, productId, role}: {name?: string, description?: string, image?: string, price?: string, stockOuantity?: number, productId: string , role: string}){
  try {
    if(role === 'admin' || role === 'intermediate'){
      await db.update(product).set({
        name: name,
        description: description,
        image: image,
        price: price?.toString(),
        stockOuantity: stockOuantity
      }).where(eq(product.id, productId))
    
      return {success: true, message: "product updated successfully"}
    }
    return {success: false, message: "you are not authorized to update product"}
  } catch (error) {
    return {success: false, message: error instanceof Error ? `error updating product: ${error}` : "unknown error"}
  }
}