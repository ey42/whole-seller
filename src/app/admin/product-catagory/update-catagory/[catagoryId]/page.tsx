export const dynamic = 'force-dynamic'
import { getCategoryById } from "@/db/crud/select"
import { productCategory } from "@/db/schema"
import UpdateCatagory from "@/files/admin/categories/UpdateCatagory"
import { db } from "@/index"
import { eq } from "drizzle-orm"


interface pageProps {
  params: {
    catagoryId: string
  }
}
const page = async({params}: pageProps) => {
  const {catagoryId} = await params
  console.log("catagoryId called inside /update-category/[catagoryId]", catagoryId)
  const getCategory = await db.query.productCategory.findFirst({
              where: eq(productCategory.id, catagoryId),
              with : {
                  products: true,  
              }
          })
  return (
    <div className='w-full mt-5 mb-5 text-white'>
      <UpdateCatagory category={getCategory}/>
    </div>
  )
}

export default page
