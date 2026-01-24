"use server"

import { supabase } from "../supabaseServer"

export async function deleteMultiFromStorage(path: string): Promise<{data: boolean, error: string | null}> {
    try {
        const {error: listError, data: listData} = await supabase.storage.from('whole-seller').list(path)
        if(listError){
            return {data: false, error: listError.message}
        }
        for(const item of listData){
            const itemPath = `${path}/${item.name}`
            await supabase.storage.from('whole-seller').remove([itemPath])
        }
        
        return {data: true, error: null}
    } catch (error) {
        return {data: false, error: 'An unexpected error occurred while deleting the file.'}
    }
}
export async function deleteOneFromStorage(path: string): Promise<{data: boolean, error: string | null}> {
    try {
        const {error} = await supabase.storage.from('whole-seller').remove([path])
        if(error){
            return {data: false, error: error.message}
        }
        return {data: true, error: null}
    } catch (error) {
        return {data: false, error: 'An unexpected error occurred while deleting the file.'}
    }
}