
import { supabase } from '@/lib/supabase/supabaseServer'
import { deleteMultiFromStorage, deleteOneFromStorage } from './deleteFromStorage'
import { ca } from 'zod/v4/locales'


export async function uploadToProfile (TIN: string, file?: File): Promise<{data: string | null, error: string | null}> {

    if(file){
    const ext = file.type.split('/')[1]
    const filePath = `profile/${TIN}.${ext}`

    const { data: dataUrl, error } = await supabase.storage.from('whole-seller').upload(`${filePath}`, file, {
        upsert: true
    })
    if(dataUrl){
    const {data: publicUrlData} = await supabase.storage.from('whole-seller').getPublicUrl(dataUrl.path)
    return {data: publicUrlData.publicUrl, error} 
    }
    if(error){
        return{data: dataUrl, error: error.message}
        
    }

    }
    return{data: null, error:"error image is null"}

}
export async function uploadToCategory({file, categoryId}:{file: File, categoryId: string}){
 try {
    if(file){
    const ext = file.type.split('/')[1]
    const filePath = `category/${categoryId}/${ext}`
    const { data: dataUrl, error } = await supabase.storage.from('whole-seller').upload(`${filePath}`, file, {
        upsert: true
    })
    if(dataUrl){
    const {data: publicUrlData} = await supabase.storage.from('whole-seller').getPublicUrl(dataUrl.path)
    return {data: publicUrlData.publicUrl, error} 
    }
    if(error){
        return{data: dataUrl, error: error.message}
    }
}
    return {data: null, error: "image is required"}
 } catch (error) {
    throw new Error('error happening during uploading category image')
 }
}

interface uploadProductProps{
    id: string;
    image: File,
}

export async function uploadToProduct(datas: uploadProductProps[], categoryId: string/** is used for deleting multi image using one categoryname when i delete the category so an array of image must store using categoryName + their id */, categoryImage: File): Promise<{data: string | null, error: string | null, id: string}[] | null | undefined> {
    const catFilePath = `category/${categoryId}`
    
try {
    
    if(datas.length > 0){
        
        const uploadResults = await Promise.all(datas.map(async (data) => {
            try {
                const ext = data.image.type.split('/')[1]
                const filePath = `product/${categoryId}/${data.id}/${new Date().getTime()}.${ext}`
                const { data: dataUrl, error } = await supabase.storage.from('whole-seller').upload(`${filePath}`, data.image, {
                    upsert: true
                })
                if(dataUrl){
                    const {data: publicUrlData} = await supabase.storage.from('whole-seller').getPublicUrl(dataUrl.path)
                    return { data: publicUrlData?.publicUrl, error: null, id: data.id }
                }
                if(error){
                    await deleteMultiFromStorage(catFilePath)
                    return { data: null, error: error.message, id: data.id }
                }
                await deleteMultiFromStorage(catFilePath)
                return { data: null, error: 'upload failed', id: data.id }
            } catch (err) {
                await deleteMultiFromStorage(catFilePath)
                return { data: null, error: (err as Error)?.message ?? 'unknown error', id: data.id }
            }
        }))
        return uploadResults
    }
    await deleteMultiFromStorage(catFilePath)
    return null
} catch (error) {
    await deleteMultiFromStorage(catFilePath)
    return null
}
}

export async function updateProductImage({file, productId, categoryId}: {file: File, productId: string, categoryId: string}): Promise<{data: string | null, error: string | null}> {

    if(file){
    const path = `product/${categoryId}/${productId}`
    const {error: listError, data: listData} = await supabase.storage.from('whole-seller').list(path)
    if(listError){
        return {data: null, error: listError.message}
    }
    for(const item of listData){
        const itemPath = `${path}/${item.name}`
        await supabase.storage.from('whole-seller').remove([itemPath])
        console.log(`item in update file ${item.name}`)
    }
    const ext = file.type.split('/')[1]
    const filePath = `product/${categoryId}/${productId}/${new Date().getTime()}.${ext}` 

    const { data: dataUrl, error } = await supabase.storage.from('whole-seller').upload(`${filePath}`, file, {
        upsert: true,
        cacheControl: '0'
    })
    if(dataUrl){
    const {data: publicUrlData} = await supabase.storage.from('whole-seller').getPublicUrl(dataUrl.path)
    return {data: publicUrlData.publicUrl, error} 
    }   
    if(error){
        return{data: dataUrl, error: error.message}
    }   
    }
    return{data: null, error:"error image is null"} 
}

export async function updateCategoryImage({file, categoryId}: {file: File, categoryId: string}): Promise<{data: string | null, error: string | null}> {

    if(file){    

    const path = `product/${categoryId}}`
    const {error: listError, data: listData} = await supabase.storage.from('whole-seller').list(path)
    if(listError){
        console.log('Error listing files before updating category image:', listError.message);
        return {data: null, error: listError.message}

    }
    for(const item of listData){
        const itemPath = `${path}/${item.name}`
        await supabase.storage.from('whole-seller').remove([itemPath])
    }
    console.log('Updating category image for categoryId:', categoryId);
    const ext = file.type.split('/')[1]
    const filePath = `category/${categoryId}/${new Date().getTime()}.${ext}`
    const { data: dataUrl, error } = await supabase.storage.from('whole-seller').upload(`${filePath}`, file, {
        upsert: true
    })
    if(dataUrl){
    const {data: publicUrlData} = await supabase.storage.from('whole-seller').getPublicUrl(dataUrl.path)
    return {data: publicUrlData.publicUrl, error} 
    }
    if(error){
        return{data: dataUrl, error: error.message}
    }
    }
    return{data: null, error:"error image is null"} 
}   

export async function uploadNewImageToProduct({file, categoryId, productId}: {file: File, categoryId: string, productId: string}): Promise<{data: string | null, error: string | null}> {
    if(file){
            try {
                const ext = file.type.split('/')[1]
                const filePath = `product/${categoryId}/${productId}/${new Date().getTime()}.${ext}`
                const { data: dataUrl, error } = await supabase.storage.from('whole-seller').upload(`${filePath}`, file, {
                    upsert: true
                })  
                if(dataUrl){
                const {data: publicUrlData} = await supabase.storage.from('whole-seller').getPublicUrl(dataUrl.path)
                return {data: publicUrlData.publicUrl, error: null} 
                }
                if(error){
                    return{data: null, error: error.message}
                }
            } catch (err) {
                return {data: null, error: (err as Error)?.message ?? 'unknown error'}
            } 
    }
    return {data: null, error:"error image is null"}
}