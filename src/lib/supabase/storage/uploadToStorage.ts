"use server"
import { getSession, } from '@/lib/auth-server'
import { storage } from '@/lib/supabase/supabaseServer'


export async function uploadToProfile (file: File) {

    const session = await getSession()
    const user = session?.user

    if(!user){
    throw new Error("Unauthorized user access")
    }
    if( file !== null ){
    const ext = file.type.split('/')[1]
    const filePath = `profile/${user.id}.${ext}`

    const { data: dataUrl, error } = await storage.from('whole-seller').upload(`${filePath}`, file, {
        upsert: true
    })
    if(dataUrl){
    const {data: publicUrlData} = await storage.from('whole-seller').getPublicUrl(dataUrl.path)
    return {publicUrlData, error} 
    }
    if(error){
        return{dataUrl, error}
    }

    }
    return{data: null, error: {status: 400, message: "error image is null"}}

}