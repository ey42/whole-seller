"use server"
import { auth } from "./auth"; // path to your Better Auth server instance
import { headers } from "next/headers";

export async function getSession() {
 const session = await auth.api.getSession({
    headers: await headers() // you need to pass the headers object.
})
    return session

}

