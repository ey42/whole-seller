"use client"

import { createAction } from "./createAction";
import { LoginUser, sign_up } from "./register";


export const LoginEmail = createAction(async (input: {
    email: string;
    password: string;
    callbackUrl?:string
}) => {
    const res = await LoginUser({email: input.email, password: input.password, callbackUrl:input.callbackUrl})

    if(input.callbackUrl){
        return {...res, redirectTo: input.callbackUrl}
    }
    return res
})

export const signUpEmail = createAction(async(input: {
    email: string,
    password: string,
    name: string,
    kebele: string,
    phoneNumber: string,
    shopName: string,
    subCity: string,
    tinNumber: string,
    woreda: string,
    image: string | null,
    callbackUrl?: string
}) => {
    const res = await sign_up({
        email: input.email,
        password: input.password, 
        name: input.name,
        kebele: input.kebele,
        phoneNumber: input.phoneNumber,
        shopName: input.shopName,
        subCity: input.subCity,
        tinNumber: input.tinNumber,
        woreda: input.woreda,
        image: input.image, 
        callbackUrl: input.callbackUrl})
     if(input.callbackUrl){
        return {...res, redirectTo: input.callbackUrl}
    }
    return res
})

export const Logout = async() => {
    const res = await fetch('http://localhost:3000/api/authentication/logout') 
    if(res.ok){
         if(typeof window !== 'undefined' )
        window.location.href = '/login'
        return {success: true, message: "successfully signed out"}
    }
    return {success: false, message: "error when signed out"}
}
