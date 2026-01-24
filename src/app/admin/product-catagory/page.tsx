
import ProductCategories from '@/files/admin/categories/ProductCategories'

const page = () => {

  return (
    <div className='w-full h-full px-2 text-white'>
      <div className='flex flex-col gap-10 justify-start items-center mt-5'>
        <h1 className='text-3xl max-sm:text-xl font-bold'>customise your catagories of Product</h1>
        <ProductCategories/>
      </div>
    </div>
  )
}

export default page
