"use client"
import { uploadToCategory, uploadToProduct } from '@/lib/supabase/storage/uploadToStorage';
import { v4 as uuidv4 } from "uuid";
import { categoryProp, productProp } from '@/types/types';
import { Plus } from 'lucide-react'
import Image from 'next/image';
import React, { ChangeEvent, useRef, useState } from 'react'
import z from 'zod';
import { useAuthSession } from '@/files/context/AurhContext';
import { insertToCategoryAndProduct } from '@/db/crud/insert';
import { useRouter } from 'next/navigation';


interface productInterface {
        id: string;
        name: string;
        createdAt: Date;
        userId: string;
        image: string;
        description: string;
        updateAt: Date;
        price: number | null;
        categoryId: string | null;
        stockOuantity: number;
        like: number | null;
        type: string
    };
type OptionalProduct = Partial<Omit<productInterface, "image">> & { image?: string | File, index: number };
type OptionalCategory = Omit<categoryProp, "image"> & {image: File}
type CategoriesProp = Partial<OptionalCategory>
interface arrayImageProp{
    image: File,
    index: number,
    name: string,
    preview?: string
}
interface objectProps {
 errorUploadingCategory: string | null
 errorUploadingProducts: string | null
 insertionError: string | null
 errorOnTypeProduct: string  | null
 errorOnTypeCategory: string  | null
}
const NewCategory = () => {
    const categoryImageRef = useRef<HTMLInputElement | null>(null);
    const [insertProduct, setInsertProduct] = useState<OptionalProduct[]>([])
    const [insertCategory, setInsertCategory] = useState<CategoriesProp>({})
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageName, setImageName] = useState<string | null>(null)
    const [arrayLength, setArrayLength] = useState<number>(1) 
    const [arrayProduct, setArrayProduct] = useState<number[]>([1]) 
    const [arrayImage, setArrayImage] = useState<arrayImageProp[]>([])
    const onErrorRef = useRef<HTMLDivElement | null>(null);
    const [error, setError] = useState<Partial<objectProps>| undefined>(undefined)
    const {user} = useAuthSession()
    const router = useRouter();

    const categorySchema = z.object({
        id: z.string().min(2, "error image is not selected"),
        name: z.string().min(2, 'category name must be specified'),
        description: z.string().min(2, 'description must be specified'),
        image: z
        .instanceof(File)
        .refine((file) => file.type.startsWith('image/'), "only image files are allowed" )
        .refine((file) => file.size > 0, "image is required")
        .refine((file) => file.size <= 5 * 1024 * 1024, "image must be less than 50mb"),

    })

    const productSchema = z.object({
        id: z.string().min(2, "error the id must specifiy").nonempty("error the id must be specifiy"),
        name: z.string().min(2, "product name is mandatory").nonempty("product name is mandatory"),
        image: z.instanceof(File)
        .refine((file) => file.type.startsWith('image/'), "only image files are allowed" )
        .refine((file) => file.size > 0, "image is required")
        .refine((file) => file.size <= 5 * 1024 * 1024, "image must be less than 50mb"),
        description: z.string().min(2, "description is mandatory").nonempty("description is mandatory"),
        price: z.number({error: "price is required"}).positive("price must be greater than 0").nonnegative("price must be positive"),
        stockOuantity: z.number({error: "amount of product is mandatory"}).nonnegative("amount must be positive").positive("amount must be greater than 0"),
        type: z.string().min(2, "the way the product prepared to the user is must be specified in lts, carton or piece").nonempty("the way the product prepared to the user is must be specified in lts, carton or piece"),
    })

    const arrayOfProductSchema = z.array(productSchema)

    const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file = event.target.files?.[0];
        
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
            }
        

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Please select an image smaller than 5MB');
            return;
            }    
            setImageName(file.name) 
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        
            setInsertCategory((prevData) => ({
            ...prevData,
            image: file,
            id: uuidv4()
            }));
        }
    }
    const createArrayOfProduct = () => {

        const arrayOfProduct = Array.from({length: arrayLength}).fill(0) as number[]
        setArrayProduct(arrayOfProduct)
    }

    const handleArrayImage = (e: ChangeEvent<HTMLInputElement>, i:number) => {
        e.preventDefault();
        const file = e.target.files?.[0];
        
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
            }
        

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Please select an image smaller than 5MB');
            return;
            }    
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setArrayImage((prev) => {
                console.log('updating array image preview')
                // replace existing entry for this index if present
                const filtered = prev.filter(p => p.index !== i);
                return [...filtered, {image: file, name: file.name, index: i, preview: previewUrl}];
            });
        
            setInsertProduct((prev) => {
                const selectedProduct = prev.find(p => p.index === i)
                if (selectedProduct) {
                    const uuid = uuidv4()
                    // update existing product entry with the new image
                    console.log('updating existing product image with id', selectedProduct.id)
                    return prev.map(p => p.index === i && p.id !== undefined ? { ...p, image: file } :  p.index === i && p.id === undefined ? { ...p, image: file, id: uuid }: p);
                }

                const uuid = uuidv4()
                console.log('adding new product image with id', uuid)

                // add a new product entry with the required index
                return [...prev, { image: file, index: i, id: uuid}];
            })
        }
    }
    const handleTitleInput = (e: ChangeEvent<HTMLInputElement>, i: number) => {
            const title = e.target.value
            setInsertProduct((prev) => {
                const selectedProduct = prev.find(p => p.index === i)
                if (selectedProduct) {
                    // update existing product entry with the new image
                    return prev.map(p => p.index === i ? { ...p, name: title } : p);
                }
                // add a new product entry with the required index
                return [...prev, { name: title, index: i }];
            })  
    }
    const handleDescriptionInput = (e: ChangeEvent<HTMLTextAreaElement>, i: number) => {
            const desc = e.target.value
            setInsertProduct((prev) => {
                const selectedProduct = prev.find(p => p.index === i)
                if (selectedProduct) {
                    // update existing product entry with the new image
                    return prev.map(p => p.index === i ? { ...p, description: desc } : p);
                }
                // add a new product entry with the required index
                return [...prev, { description: desc, index: i }];
            })  
    }
    const handlePriceInput = (e: ChangeEvent<HTMLInputElement>, i: number) => {
            const price = Number(e.target.value)
            setInsertProduct((prev) => {
                const selectedProduct = prev.find(p => p.index === i)
                if (selectedProduct) {
                    // update existing product entry with the new image
                    return prev.map(p => p.index === i ? { ...p, price: price } : p);
                }
                // add a new product entry with the required index
                return [...prev, { price: price, index: i }];
            })  
    }
    const handleTypeInput = (e: ChangeEvent<HTMLInputElement>, i: number) => {
            const type = e.target.value
            setInsertProduct((prev) => {
                const selectedProduct = prev.find(p => p.index === i)
                if (selectedProduct) {
                    // update existing product entry with the new image
                    return prev.map(p => p.index === i ? { ...p, type: type } : p);
                }
                // add a new product entry with the required index
                return [...prev, { type: type, index: i }];
            })  
    }
    const handleAmountInput = (e: ChangeEvent<HTMLInputElement>, i: number) => {
            const amount = Number(e.target.value)
            setInsertProduct((prev) => {
                const selectedProduct = prev.find(p => p.index === i)
                if (selectedProduct) {
                    // update existing product entry with the new image
                    return prev.map(p => p.index === i ? { ...p, stockOuantity: amount } : p);
                }
                // add a new product entry with the required index
                return [...prev, { stockOuantity: amount, index: i }];
            })  
    }

    const handleCategoryNameInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInsertCategory((prevData) => ({
            ...prevData,
            name: e.target.value
            }));
    }

    const handleCategoryDescInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setInsertCategory((prevData) => ({
            ...prevData,
            description: e.target.value
            }));
    }


    const handleSubmit = async() => {
        console.log('handling submit')
        onErrorRef.current?.scrollIntoView({behavior: 'smooth'});
        const {success, data, error} = categorySchema.safeParse(insertCategory)
        const result = arrayOfProductSchema.safeParse(insertProduct)
        if(success && data){
            console.log('category data is valid')
            if(result.success && result.data.length > 0){
                console.log('product data is valid')
            const {data: categoryImageUrl, error: uploadCategoryError } = await uploadToCategory({file: data.image, categoryId: data.id})
            if(uploadCategoryError){
                setError({
                    errorUploadingCategory: "error during uploading image please try again",
                    errorUploadingProducts: null,
                    insertionError: null,
                    errorOnTypeProduct: null,
                    errorOnTypeCategory: null,
                })
                return 
            }
            const dataForProductUpload = result.data.map((product) => ({
                id: product.id,
                image: product.image as File,
            }))

            // uploadToProduct returns an array of { data, error } or null/undefined, so don't destructure as a single object
            const productUploadResult = await uploadToProduct(dataForProductUpload, data.id, data.image)
            if (!productUploadResult) {
                setError({
                errorUploadingProducts: "error during uploading products",
                errorUploadingCategory: null,
                insertionError: null,
                errorOnTypeProduct: null,
                errorOnTypeCategory: null
                });
                return
            }
            // productUploadResult is { data: string | null; error: string | null }[]
            const productImageUrls = productUploadResult

            const failedUploads = productImageUrls.filter(result => result.error !== null)
            if (failedUploads.length > 0) {
                const errorMessages = failedUploads.map(failure => failure.error).join(", ")
                setError({errorUploadingProducts: `Errors during product uploads: ${errorMessages}`})
                return
            }
            const finalProductData = result.data.map((product) => {
                const uploadedImage = productImageUrls.find(img => img.id === product.id)
                return { 
                    id: product.id,
                    name: product.name as string,
                    description: product.description as string,
                    image: uploadedImage?.data as string,
                    price: product.price?.toString() as string,
                    stockOuantity: product.stockOuantity as number,
                    categoryId: data.id,
                    type: product.type as string,
                }
            })

            const categoryData= {
                id: data.id,
                name: data.name,
                description: data.description,
                image: categoryImageUrl as string,
            }
            await insertToCategoryAndProduct({categoryData, productDatas: finalProductData, userId: user?.user.id as string}).then((res)  => {
                if(res.success === true){
                    console.log('category and products inserted successfully ', res.message)
                    setError(undefined)
                    setInsertCategory({})
                    setInsertProduct([])
                    setImagePreview(null)
                    setArrayImage([])
                    router.push('/admin/product-catagory')
                    return
                }
                setError({
                    insertionError: res.message,
                    errorOnTypeCategory: null,
                    errorOnTypeProduct: null,
                    errorUploadingCategory: null,
                    errorUploadingProducts: null
                })
                console.log('insertion failed result', res.message)
            })

        } else{
            setError({errorOnTypeProduct: "check your product data inputs or reload the page and try again"})
            console.log('product data is not valid', result.error   )
            return
        }
        } else{
            setError({errorOnTypeCategory: "check your category data inputs or reload the page and try again"})
            return
        }
    }

  return (
    <div className='flex flex-col max-w-2xl min-w-1/2 r mt-10 px-2 max-sm:w-full pb-10 gap-20'>
        <div ref={onErrorRef} className='flex flex-col gap-2 items-center justify-center'>
            {error !== undefined && <h1 className='text-lg font-bold text-red-500'>error👀</h1>}
        {error?.insertionError && <p className='text-red-500 text-sm font-semibold'>{error.insertionError}</p>}
        {error?.errorOnTypeCategory && <p className='text-red-500 text-sm font-semibold'>{error.errorOnTypeCategory}</p>}
        {error?.errorOnTypeProduct && <p className='text-red-500 text-sm font-semibold'>{error.errorOnTypeProduct}</p>}
        {error?.errorUploadingCategory && <p className='text-red-500 text-sm font-semibold'>{error.errorUploadingCategory}</p>}
        {error?.errorUploadingProducts && <p className='text-red-500 text-sm font-semibold'>{error.errorUploadingProducts}</p>}
        </div>
      <div className='flex bg-black p-3 rounded-md border-white border max-sm:flex-col max-sm:px-5 justify-center items-center gap-10'>
        <div className='flex flex-col gap-2'>
           { imagePreview ? <div className='w-36 h-28 flex gap-2'>
            <div className='w-28 h-28 flex gap-2'>
            <Image className='w-full rounded-md' src={imagePreview} alt="image" width={200} height={200}/>
           </div>
           <Plus className='self-end cursor-pointer' onClick={() => {
            categoryImageRef.current?.click()
           }} fill='white' stroke='white' width={30} height={30}/> 
           <input onChange={handleImage} className='hidden' type="file" name="image" id="image" ref={categoryImageRef} accept='image/*'/>
           </div> : <div className='w-28 h-28 rounded-md border-black border-2 cursor-pointer flex items-center justify-center bg-slate-200' onClick={() => {
                categoryImageRef.current?.click()
            }}>
            <Plus fill='black' stroke='black' width={50} height={50}/>
            <input onChange={handleImage} className='hidden' type="file" name="image" id="image" ref={categoryImageRef} accept='image/*'/>
            </div>}
            <h1 className='text-white text-sm font-semibold'>{imageName}</h1>
        </div>
        <div className='flex w-full gap-2 flex-col'>
            <div className='w-full flex flex-col'>
                <label htmlFor="title"> Title </label>
                <input className='border border-white h-9' type="text" name="title" id="title" onChange={handleCategoryNameInput}/>
            </div>
            <div className='w-full text-sm flex flex-col'>
                <label htmlFor="description">description</label>
                <textarea className='border border-white' rows={3} id='description' onChange={handleCategoryDescInput}/>
            </div>
            
        </div>
      </div>
      <div className='flex bg-black border-white border rounded p-3 flex-col gap-2'>
        <p className='text-sm'>how many sub catagories do you want</p>
      <div className='flex w-72 overflow-hidden gap-4'>
        <input onWheel={(e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur()} className='border h-9 w-full border-white' onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setArrayLength(Number(e.target.value))
        }} type="number" name="amountArray" id="amountArray"  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>{
            if(e.key === 'Enter'){
                createArrayOfProduct()
            }
        }}/>
        <button className='bg-white px-6 cursor-pointer rounded text-black font-semibold' onClick={createArrayOfProduct}>ok</button>
      </div>
      </div>
      <div className='flex flex-col gap-20 w-full'>
        {arrayProduct.map((_, i) => (
            <div className='flex border max-sm:flex-col bg-black rounded border-white p-2 w-full gap-10' key={i}>
            <div className='flex self-center flex-col'>
                { arrayImage[i]?.preview ? <div className='w-36 h-28 flex gap-2'>
            <div className='w-28 h-28 flex gap-2'>
            <Image className='w-full rounded-md' src={arrayImage[i].preview as string} alt="image" width={200} height={200}/>
           </div>
           <Plus className='self-end cursor-pointer' onClick={() => {
            document.getElementById(`array-image-${i}`)?.click()
           }} fill='white' stroke='white' width={30} height={30}/> 
           <input onChange={(e) => handleArrayImage(e, i)} id={`array-image-${i}`} className='hidden' type="file" name={`arrayImage${i}`} accept='image/*'/>
           </div> : <div className='w-28 h-28 rounded-md border-black border-2 cursor-pointer flex items-center justify-center bg-slate-200' onClick={() => {
                document.getElementById(`array-image-${i}`)?.click()
            }}>
            <Plus fill='black' stroke='black' width={50} height={50}/>
            <input onChange={(e) => handleArrayImage(e, i)} id={`array-image-${i}`} className='hidden' type="file" name={`arrayImage${i}`} accept='image/*'/>
            </div>}
            </div>
            <div className='flex flex-col w-full text-sm gap-4'>
                <div className='flex flex-col gap-1'>
                    <label htmlFor={`productTitle${i}`}>Title</label>
                    <input className='border border-white h-9 pl-1' type="text" name={`productTitle${i}`} id= {`productTitle${i}`}
                    onChange={(e) => handleTitleInput(e, i)}/>
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor={`productDescription${i}`}>description</label>
                    <textarea className='border border-white h-9 pl-1' name={`productDescription${i}`}  id={`productDescription${i}`} rows={3} onChange={(e) => handleDescriptionInput(e, i)}/>
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor={`productPrice${i}`}>price</label>
                    <input onWheel={(e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur()} className='border border-white h-9 pl-1' type="number" name={`productPrice${i}`} id={`productPrice${i}`} onChange={(e) => handlePriceInput(e, i)} />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="">amount</label>
                    <input onWheel={(e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur()} className='border border-white h-9 pl-1' type="number" name={`productAmount${i}`} id={`productAmount${i}`} onChange={(e) => handleAmountInput(e, i)} />
                </div>
                <div className='flex flex-col gap-1'>
                    <label htmlFor="">type (carton, litre, kilo, pieces or packed)</label>
                    <input className='border border-white h-9 pl-1' type="text" name={`productAmount${i}`} id={`productAmount${i}`} onChange={(e) => handleTypeInput(e, i)} />
                </div>
            </div> 
            </div>
        ))}
      </div>
      <button className='border border-black bg-white px-6 py-1 text-black font-semibold cursor-pointer' onClick={handleSubmit}>submit</button>
    </div>
  )
}

export default NewCategory
