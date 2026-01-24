"use client";
import { authClient } from "@/lib/auth-client";
import { bekaAuth } from "@/lib/auth/authentication";
import { userSessionProps } from "@/types/types";
import { createContext, useState, useContext, useEffect, ReactNode } from "react";

//  interface User {
//     id: string;
//     createdAt: Date;
//     updatedAt: Date;
//     email: string;
//     emailVerified: boolean;
//     name: string;
//     image?: string | null | undefined;
// } 
type AuthProps = {
    user: userSessionProps | null;
    setUser: (user: userSessionProps | null) => void;
} 

const AuthContext = createContext<AuthProps | null>(null)

export function AuthProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<userSessionProps | null>(null)

    useEffect(() => {
        // authClient.getSession().then((session) => {
        //     setUser(session?.data?.user ?? null)
        // })
         bekaAuth().getSesssion().then(async(data)  =>{
            const dat = await data
            if(dat){
                setUser(dat)
            }else{
                setUser(null)
            }
        })
    }, [])
    return (
        <AuthContext.Provider value={{user, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthSession = () => {
    const ctx = useContext(AuthContext)
    if(!ctx) throw new Error("useAuthSession must be used inside AuthProvider")
        return ctx
}