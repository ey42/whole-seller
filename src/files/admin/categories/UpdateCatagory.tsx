'use client'
import { insertToProductTable } from '@/db/crud/insert'
import { updateCategoryData, updateProductData } from '@/db/crud/update'
import { useAuthSession } from '@/files/context/AurhContext'
import { updateCategoryImage, updateProductImage, uploadNewImageToProduct } from '@/lib/supabase/storage/uploadToStorage'
import { categoryWithProductProps, userProductProp } from '@/types/types'
import { Delete, DeleteIcon, Edit2, EraserIcon, Trash, X } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChangeEvent, useCallback, useEffect, useState, WheelEvent } from 'react'
import z from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { deleteOneFromStorage } from '@/lib/supabase/storage/deleteFromStorage'
import { useRealtimeProducts } from '@/db/realtime-fetch/realtime-product'
import { supabase } from '@/lib/supabase/supabaseServer'
import { getProducts } from '@/db/crud/select'

const UpdateCatagory = ({category}: {category: categoryWithProductProps | undefined}) => {
  const [updateCategory, setUpdateCategory] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewProductUrl, setPreviewProductUrl] = useState<{url: string, productId: string} | null>(null);
  const [updateProduct, setUpdateProduct] = useState<boolean>(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [isAddProduct, setIsAddProduct] = useState<boolean>(false);
  const [productDetails, setProductDetails] = useState<{name?: string, description?: string, price?: string, stockQuantity?: string, image?: File} | null>(null);
  const [categoryDetails, setCategoryDetails] = useState<{name?: string, description?: string, image?: File} | null>(null);
  const [addNewProduct, setAddNewProduct] = useState<Partial<{id: String, title: string, description: string, price: string, amount: string, type: string, imageFile: File}> | null>(null);
  const [newProductPreview, setNewProductPreview] = useState<string | null>(null);
  const [newProductError, setNewProductError] = useState<{
    [key: string]: string
  } | null>(null);
  const {user} = useAuthSession();
  const router =  useRouter();
  
  const newProductSchema = z.object({
    id: z.string().min(4, 'Product ID is required'),
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: 'Price must be a positive number' }),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: 'Amount must be a non-negative number' }),
    type: z.string().min(1, 'Type is required'),
    imageFile: z.instanceof(File, { message: 'Image file is required' }),
  });

  const handleNewProductSubmit = async() => {
    if(!addNewProduct){
      alert('Please fill all the fields');
      return;
    }
    const parseResult = newProductSchema.safeParse(addNewProduct);
    if(!parseResult.success){  
      setNewProductError(parseResult.error.flatten().fieldErrors as {[key: string]: string});
      return;
    }

    const {data: imageData, error: imageError} = await uploadNewImageToProduct({file: parseResult.data.imageFile!, categoryId: category!.id, productId: parseResult.data.id})

    if(imageError){
      alert(`Image upload failed: ${imageError}`);
      return;
    }
    const {message, success} = await insertToProductTable({productData:{...parseResult.data, image: imageData!, categoryId: category!.id, stockOuantity: parseInt(parseResult.data.amount, 10), name: parseResult.data.title }, userId: user!.user.id});
    if(!success){
      deleteOneFromStorage(`product/${category!.id}/${parseResult.data.id}.${parseResult.data.imageFile!.type.split('/')[1]}`);
      alert(`Product insertion failed: ${message}`);
      return;
    }
      alert(`Product insertion success: ${message}`);
      router.refresh();
      setIsAddProduct(false);
      setAddNewProduct(null);
      setNewProductPreview(null);
      setNewProductError(null);
      return;
    
  };

  const handleNewProductImage = (e: ChangeEvent<HTMLInputElement>): void =>{
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
            setNewProductPreview(previewUrl);
            setAddNewProduct({...addNewProduct, imageFile: file, id: uuidv4()} );
  }
  } 

  const handleUpdateCategoryImage = (e: ChangeEvent<HTMLInputElement>): void =>{
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
            setPreviewUrl(previewUrl);
            setCategoryDetails({...categoryDetails, image: file});
  }
}

  const handleUpdateProductImage = (e: ChangeEvent<HTMLInputElement>, productId: string): void =>{
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
            setPreviewProductUrl({url: previewUrl, productId});
            setProductDetails({...productDetails, image: file});
  }
}
const handleProductId = (id:string): void => {
  setProductId(id);
  setUpdateProduct(true);
}
const handleCategoryUpdate = async() => {
  if(!categoryDetails || !user){
    alert('No changes made to update');
    return;
  }
  if(categoryDetails.image){
    const {data, error} = await updateCategoryImage({file: categoryDetails.image, categoryId: category!.id})
    if(data !== null){
     const {success, message} = await updateCategoryData({name: categoryDetails.name, description: categoryDetails.description, image: data, categoryId: category!.id,  role: user?.user.userRole})
      if(!success){
      alert(`No changes made to update: ${message}`);
      // router.refresh()
      return
      }
     setCategoryDetails(null);
     alert(message);
     router.refresh()
      return 
    } else {
      alert(`image update failed: ${error}`);
      // router.refresh()
      return 
    }

  }
  const {success, message} = await updateCategoryData({name: categoryDetails.name, description: categoryDetails.description, categoryId: category!.id, image: undefined, role: user?.user.userRole})
  if(!success){
    alert(`No changes made to update: ${message}`);
    router.refresh()
    return
  }
  setCategoryDetails
  alert(message);
  router.refresh()
  return

}
const handleProductSubmit = async (id: string) => {
  if (!productDetails || !user) {
    alert('No changes made to updates');
    return;
  }

  if (productDetails.image) {
    const { data, error } = await updateProductImage({ file: productDetails.image, productId: id, categoryId: category!.id });
    if (data !== null) {
      const {success, message } = await updateProductData({
        name: productDetails.name,
        description: productDetails.description,
        image: data,
        price: productDetails.price,
        stockOuantity: productDetails.stockQuantity ? parseInt(productDetails.stockQuantity) : undefined,
        productId: id,
        role: user.user.userRole,
      });
      if (!success) {
        alert(`No changes made to update: ${message}`);
        return;
      }
      setProductDetails(null);
      alert(message);
      router.refresh();
      return;
    } else {
      alert(`product image update failed: ${error}`);
      return;
    }
  }

  const { success, message } = await updateProductData({
    name: productDetails.name,
    description: productDetails.description,
    image: undefined,
    price: productDetails.price,
    stockOuantity: productDetails.stockQuantity ? parseInt(productDetails.stockQuantity) : undefined,
    productId: id,
    role: user.user.userRole,
  });

  if (!success) {
    alert(`No changes made to update: ${message}`);
    return;
  }     

  setProductDetails(null);
  alert('product updated successfully');
  router.refresh();
  return;
}
  return (
    <div className='w-full max-w-max text-white'>
      {category ? (
        <div className='flex px-20 flex-col gap-5'>
            <div className='flex min-w-max max-w-max w-full flex-row items-start border-2 bg-black border-white justify-start p-4 gap-5'>
                {!updateCategory ? <div className='w-32 h-32 shrink rounded-full border-2 border-white overflow-hidden'>
                    <Image src={category.image} width={300} height={300} alt={`${category.name} image`} className='w-full object-contain h-full'/>
                </div> : 
                <div className='w-32 h-32 shrink cursor-pointer rounded-full border-2 border-white overflow-hidden flex flex-col justify-center items-center bg-gray-800' onClick={() => {
                  document.getElementById('categoryImage')?.click()
                }}>
                    {previewUrl ? (
                      <Image src={previewUrl} width={300} height={300} alt='Category preview image' className='w-full h-full object-cover'/>
                    ) : (
                      <p className='text-gray-400 text-center px-2'>Click to upload new category image</p>
                    )}
                <input type="file" id='categoryImage' accept='image/*' onChange = {handleUpdateCategoryImage} hidden/>
                </div>}
                
                <div className='flex flex-col gap-2 ml-5'>
                   {updateCategory ? 
                   <input type="text" defaultValue={category.name} className='text-2xl font-bold bg-transparent border-b border-white focus:outline-none' 
                   onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setCategoryDetails({...categoryDetails, name: e.target.value})
                   }}
                   />
                    : 
                   <h1 className='text-2xl font-bold'>{category.name}</h1>}
                    {updateCategory ? 
                    <textarea defaultValue={category.description} className='max-w-lg text-[#d4cfcf] bg-transparent border-b border-white focus:outline-none' onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    setCategoryDetails({...categoryDetails, description: e.target.value})
                   }}/>
                     : 
                    <p className='max-w-lg text-[#d4cfcf]'>{category.description}</p>}
                    
                      <p className='max-w-lg text-white font-medium'>{category.products.length} products</p>
                      
                    {updateCategory && <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='px-6 py-1 border-2 rounded border-white w-1/2 self-center font-bold mt-5' onClick={handleCategoryUpdate}>update</motion.button>}
                </div>
                {updateCategory ? <X className='cursor-pointer' width={20} height={20} onClick={() => {
                  setCategoryDetails(null);
                  setPreviewUrl(null);
                  setUpdateCategory(false)}}/> : <Edit2 className='cursor-pointer' width={20} height={20} onClick={() => setUpdateCategory(!updateCategory)}/>}

        </div> 
        <div>
            <h1 className='text-2xl font-bold mb-4'>Products in this category:</h1>
            <div className='flex flex-wrap w-full gap-8'>
                {category.products.map((product)=>(
                    <div key={product.id} className='border-2 bg-black border-white p-4 flex gap-5 rounded-lg'>
                        {updateProduct && productId === product.id ? <div className='w-44 h-44 shrink cursor-pointer border-2 border-white overflow-hidden flex flex-col justify-center items-center bg-gray-800' onClick={() => {
                        document.getElementById('productImage')?.click()
                        }}>
                    {previewProductUrl && previewProductUrl.productId === product.id ? (
                      <Image src={previewProductUrl.url} width={300} height={300} alt='Category preview image' className='w-full h-full object-cover'/>
                    ) : (
                      <p className='text-gray-400 text-center px-2'>Click to upload new category image</p>
                    )}
                <input type="file" id='productImage' accept='image/*' onChange = {(e) => handleUpdateProductImage(e, product.id)} hidden/>
                </div> :<div className='w-44 h-44 overflow-hidden'>
                        <Image src={product.image} width={200} height={200} alt={`${product.name} image`} className='w-full h-full object-cover mb-2'/>
                        </div>}
                        <div className='flex flex-col gap-2'>
                        {updateProduct && productId === product.id ? 
                        <input type="text" defaultValue={product.name} className='text-xl font-semibold bg-transparent border-b border-white focus:outline-none'
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setProductDetails({...productDetails, name: e.target.value})
                        }} 
                        />
                         : 
                        <h2 className='text-xl font-semibold'>{product.name}</h2>}

                        {updateProduct && productId === product.id ? <div className='flex flex-col gap-1 text-sm'> <h1 className='text-[#979797]'>Description:</h1> <textarea defaultValue={product.description} className='text-gray-300 text-wrap bg-transparent border-b border-white focus:outline-none' 
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                          setProductDetails({...productDetails, description: e.target.value})
                        }} /> </div>
                        
                         : 
                        <p className='text-gray-300 text-wrap'>{product.description}</p>}

                        {updateProduct && productId === product.id ? 
                        <div  className='flex flex-col gap-1 text-sm'><h1 className='text-[#979797]'>price: </h1><input type="number" defaultValue={product.price!} className='text-gray-300 text-wrap bg-transparent border-b border-white focus:outline-none' 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setProductDetails({...productDetails, price: e.target.value})
                        }} onWheel={(e:WheelEvent<HTMLInputElement>) => e.currentTarget.blur()}/></div>
                         : 
                        <p className='text-gray-300 text-wrap'>{product.price} ETB</p>}

                        {updateProduct && productId === product.id ? <div  className='flex flex-col gap-1 text-sm '><h1 className='text-[#979797]'>on stock amount</h1><input type="number" defaultValue={product.stockOuantity!} className='text-gray-300 text-wrap bg-transparent border-b border-white focus:outline-none' 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setProductDetails({...productDetails, stockQuantity: e.target.value})
                        }} onWheel={(e: WheelEvent<HTMLInputElement>) => e.currentTarget.blur()}/></div> 
                        
                         : 
                        <p className='text-gray-300 text-wrap'>{product.stockOuantity} amount on stock</p>}

                        {updateProduct && productId === product.id && <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='px-6 py-1 border-2 rounded cursor-pointer border-white w-1/2 self-center font-bold mt-5' onClick={() => {
                          handleProductSubmit(product.id)
                        }}>update</motion.button>}
                        </div>
                        {updateProduct && productId === product.id ? <X className='cursor-pointer' width={20} height={20} onClick={() => {
                          productDetails && setProductDetails(null);
                          setUpdateProduct(false)}}/> : <Edit2 className='cursor-pointer' width={20} height={20} onClick={() => handleProductId(product.id)}/>}

                    </div>
                ))}
            </div>
        </div>
        <div className='flex justify-between'>
          {isAddProduct ? <X className='cursor-pointer' onClick={() => {
            setNewProductPreview(null);
            setIsAddProduct(false)}}/> : <button onClick={() => setIsAddProduct(true)} className='border border-white px-4 py-2 rounded-2xl hover:bg-white hover:text-black font-bold cursor-pointer'>add New Product</button>}
        </div>
        {isAddProduct && <div className='flex border max-sm:flex-col bg-black rounded border-white p-2 w-full gap-10'>
                    <div className='flex self-center flex-col'>
                    <div className='w-44 h-44 shrink cursor-pointer border-2 border-white overflow-hidden flex flex-col justify-center items-center bg-gray-800' onClick={() => {
                        document.getElementById('productImage')?.click()
                        }}>
                    {newProductPreview  ? (
                      <Image src={newProductPreview} width={300} height={300} alt='Category preview image' className='w-full h-full object-cover'/>
                    ) : (
                      <p className='text-gray-400 text-center px-2'>Click to upload new category image</p>
                    )}
                <input type="file" id='productImage' accept='image/*' onChange = {(e) => handleNewProductImage(e)} hidden/>
                </div>
                    </div>
                    <div className='flex flex-col w-full text-sm gap-4'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor={`productTitle`}>Title</label>
                            <input className='border border-white h-9 pl-1' type="text" name={`productTitle`} id= {`productTitle`}
                            onChange={(e) => {
                              setAddNewProduct({...addNewProduct, title: e.target.value})
                            }} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor={`productDescription`}>description</label>
                            <textarea className='border border-white h-9 pl-1' name={`productDescription`}  id={`productDescription`} rows={3} onChange={(e) => {
                              setAddNewProduct({...addNewProduct, description: e.target.value})
                            }}/>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor={`productPrice`}>price</label>
                            <input onWheel={(e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur()} className='border border-white h-9 pl-1' type="number" name={`productPrice`} id={`productPrice`} onChange={(e) => {
                              setAddNewProduct({...addNewProduct, price: e.target.value})
                            }} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="">amount</label>
                            <input onWheel={(e: React.WheelEvent<HTMLInputElement>) => e.currentTarget.blur()} className='border border-white h-9 pl-1' type="number" name={`productAmount`} id={`productAmount`} onChange={(e) => {
                              setAddNewProduct({...addNewProduct, amount: e.target.value})
                            }} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="">type (carton, litre, kilo, pieces or packed)</label>
                            <input className='border border-white h-9 pl-1' type="text" name={`productAmount`} id={`productAmount`} onChange={(e) => {
                              setAddNewProduct({...addNewProduct, type: e.target.value})
                            }} />
                        </div>
                        
                        <motion.button onClick={handleNewProductSubmit} whileTap={{scale: 0.8}} className='self-center cursor-pointer mt-5 bg-white text-sm font-bold px-6 py-1 rounded  text-black'>submit</motion.button>
                        
                    </div> 
                    
        </div>}
        </div>):(<div>loading</div>)}
    </div>
  )
}

export default UpdateCatagory;
